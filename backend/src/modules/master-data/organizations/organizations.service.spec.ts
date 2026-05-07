import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { PrismaService } from '@common/prisma/prisma.service';
import { OrganizationsService } from './organizations.service';

interface MockOrganization {
  id: string;
  type: 'GROUP' | 'COMPANY' | 'BRANCH';
  parentId: string | null;
  deletedAt: Date | null;
  name?: string;
  code?: string;
}

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let prisma: {
    organization: {
      findMany: ReturnType<typeof vi.fn>;
      findFirst: ReturnType<typeof vi.fn>;
      findUnique: ReturnType<typeof vi.fn>;
      count: ReturnType<typeof vi.fn>;
      create: ReturnType<typeof vi.fn>;
      update: ReturnType<typeof vi.fn>;
    };
  };

  beforeEach(() => {
    prisma = {
      organization: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    };
    service = new OrganizationsService(prisma as unknown as PrismaService);
  });

  describe('create', () => {
    it('cho phép tạo GROUP không có cha', async () => {
      prisma.organization.create.mockResolvedValue({ id: 'g1', code: 'RTD', type: 'GROUP' });
      const result = await service.create({ code: 'RTD', name: 'RTD Group', type: 'GROUP' });
      expect(result.code).toBe('RTD');
    });

    it('reject COMPANY thiếu parent', async () => {
      await expect(
        service.create({ code: 'C1', name: 'Cty', type: 'COMPANY' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('reject COMPANY trực thuộc BRANCH (sai cấp bậc)', async () => {
      const parent: MockOrganization = { id: 'p', type: 'BRANCH', parentId: null, deletedAt: null };
      prisma.organization.findFirst.mockResolvedValue(parent);
      await expect(
        service.create({ code: 'C1', name: 'Cty', type: 'COMPANY', parentId: 'p' }),
      ).rejects.toThrow(/COMPANY chỉ được trực thuộc/);
    });

    it('cho phép COMPANY trực thuộc GROUP', async () => {
      const parent: MockOrganization = { id: 'g', type: 'GROUP', parentId: null, deletedAt: null };
      prisma.organization.findFirst.mockResolvedValue(parent);
      prisma.organization.create.mockResolvedValue({ id: 'c', code: 'C1', type: 'COMPANY' });
      const r = await service.create({ code: 'C1', name: 'Cty', type: 'COMPANY', parentId: 'g' });
      expect(r.code).toBe('C1');
    });
  });

  describe('softDelete', () => {
    it('reject xóa khi còn đơn vị con', async () => {
      prisma.organization.findFirst.mockResolvedValue({
        id: '1', name: 'Cty A', deletedAt: null, type: 'COMPANY', parentId: null,
      });
      prisma.organization.count.mockResolvedValue(2);
      await expect(service.softDelete('1')).rejects.toThrow(/còn 2 đơn vị con/);
    });

    it('soft delete khi không còn con', async () => {
      prisma.organization.findFirst.mockResolvedValue({
        id: '1', name: 'Cty A', deletedAt: null, type: 'COMPANY', parentId: null,
      });
      prisma.organization.count.mockResolvedValue(0);
      await service.softDelete('1');
      expect(prisma.organization.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({ deletedAt: expect.any(Date), isActive: false }),
      });
    });

    it('reject khi không tìm thấy', async () => {
      prisma.organization.findFirst.mockResolvedValue(null);
      await expect(service.softDelete('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update — cycle detection', () => {
    it('reject self-parent', async () => {
      prisma.organization.findFirst.mockResolvedValue({
        id: 'a', type: 'COMPANY', parentId: null, deletedAt: null,
      });
      // mock parent check
      prisma.organization.findFirst.mockResolvedValueOnce({
        id: 'a', type: 'COMPANY', parentId: null, deletedAt: null,
      });
      await expect(service.update('a', { parentId: 'a' })).rejects.toThrow();
    });

    it('reject parent là descendant (gây cycle)', async () => {
      // org A -> tries to set parent = B; but B's parent chain leads back to A
      const orgA: MockOrganization = { id: 'a', type: 'COMPANY', parentId: null, deletedAt: null };
      const orgB: MockOrganization = { id: 'b', type: 'COMPANY', parentId: 'a', deletedAt: null };

      // getById(a)
      prisma.organization.findFirst.mockResolvedValueOnce(orgA);
      // assertParentValid: findFirst(parentId=b) -> orgB  (need GROUP parent type — let's stub COMPANY...)
      // Adjust: A is COMPANY, allowed parent = GROUP. So setting parent=B (COMPANY) fails before cycle check.
      // Switch test: A is BRANCH, B is COMPANY, B.parent = A (cycle).
      orgA.type = 'BRANCH';
      prisma.organization.findFirst.mockReset();
      prisma.organization.findFirst
        .mockResolvedValueOnce(orgA) // getById
        .mockResolvedValueOnce(orgB); // assertParentValid
      prisma.organization.findUnique
        .mockResolvedValueOnce({ parentId: 'a' }) // walk up: B's parent = a
      ;
      await expect(service.update('a', { parentId: 'b' })).rejects.toThrow(/vòng lặp/);
    });
  });

  describe('list', () => {
    it('mặc định loại trừ deleted', async () => {
      prisma.organization.findMany.mockResolvedValue([]);
      prisma.organization.count.mockResolvedValue(0);
      await service.list({ page: 1, pageSize: 20, includeDeleted: false });
      const call = prisma.organization.findMany.mock.calls[0]?.[0] as { where: { deletedAt: null } };
      expect(call.where.deletedAt).toBeNull();
    });
  });
});

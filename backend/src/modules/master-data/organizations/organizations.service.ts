import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Organization, OrganizationType, Prisma } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import type {
  CreateOrganizationDto,
  ListOrganizationsQuery,
  UpdateOrganizationDto,
} from './organizations.schemas';

export type OrganizationTreeNode = Organization & { children: OrganizationTreeNode[] };

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

const ALLOWED_PARENT_TYPES: Record<OrganizationType, OrganizationType[]> = {
  GROUP: [],
  COMPANY: ['GROUP'],
  BRANCH: ['COMPANY'],
};

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListOrganizationsQuery): Promise<PaginatedResult<Organization>> {
    const { page, pageSize, search, type, parentId, isActive, includeDeleted } = query;

    const where: Prisma.OrganizationWhereInput = {
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(type && { type }),
      ...(parentId !== undefined && { parentId }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { code: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      this.prisma.organization.findMany({
        where,
        orderBy: [{ type: 'asc' }, { code: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.organization.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async getById(id: string): Promise<Organization> {
    const org = await this.prisma.organization.findFirst({
      where: { id, deletedAt: null },
    });
    if (!org) throw new NotFoundException(`Không tìm thấy tổ chức ${id}`);
    return org;
  }

  async getTree(rootId?: string): Promise<OrganizationTreeNode[]> {
    const all = await this.prisma.organization.findMany({
      where: { deletedAt: null },
      orderBy: [{ type: 'asc' }, { code: 'asc' }],
    });
    return this.buildTree(all, rootId ?? null);
  }

  async create(dto: CreateOrganizationDto): Promise<Organization> {
    if (dto.parentId) {
      await this.assertParentValid(dto.type, dto.parentId);
    } else if (dto.type !== 'GROUP') {
      throw new BadRequestException(`${dto.type} bắt buộc phải có tổ chức cha`);
    }
    return this.prisma.organization.create({
      data: { ...dto, parentId: dto.parentId ?? null },
    });
  }

  async update(id: string, dto: UpdateOrganizationDto): Promise<Organization> {
    const current = await this.getById(id);
    const targetType = dto.type ?? current.type;

    if (dto.parentId !== undefined && dto.parentId !== null) {
      await this.assertParentValid(targetType, dto.parentId);
      await this.assertNoCycle(id, dto.parentId);
    }

    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async softDelete(id: string): Promise<void> {
    const org = await this.getById(id);
    const childCount = await this.prisma.organization.count({
      where: { parentId: id, deletedAt: null },
    });
    if (childCount > 0) {
      throw new BadRequestException(
        `Không thể xóa: tổ chức "${org.name}" còn ${childCount} đơn vị con đang hoạt động`,
      );
    }
    await this.prisma.organization.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }

  // ----- private helpers -----

  private async assertParentValid(childType: OrganizationType, parentId: string): Promise<void> {
    const parent = await this.prisma.organization.findFirst({
      where: { id: parentId, deletedAt: null },
    });
    if (!parent) throw new BadRequestException('Tổ chức cha không tồn tại hoặc đã bị xóa');

    const allowed = ALLOWED_PARENT_TYPES[childType];
    if (!allowed.includes(parent.type)) {
      throw new BadRequestException(
        `${childType} chỉ được trực thuộc ${allowed.join('/') || '(không có cha)'}; cha hiện tại là ${parent.type}`,
      );
    }
  }

  private async assertNoCycle(id: string, newParentId: string): Promise<void> {
    if (id === newParentId) {
      throw new BadRequestException('Tổ chức không thể là cha của chính nó');
    }
    let cursor: string | null = newParentId;
    const visited = new Set<string>();
    while (cursor) {
      if (cursor === id) {
        throw new BadRequestException('Cập nhật parent tạo vòng lặp tổ chức');
      }
      if (visited.has(cursor)) break;
      visited.add(cursor);
      const parent: { parentId: string | null } | null = await this.prisma.organization.findUnique({
        where: { id: cursor },
        select: { parentId: true },
      });
      cursor = parent?.parentId ?? null;
    }
  }

  private buildTree(all: Organization[], rootId: string | null): OrganizationTreeNode[] {
    const byParent = new Map<string | null, Organization[]>();
    for (const org of all) {
      const list = byParent.get(org.parentId) ?? [];
      list.push(org);
      byParent.set(org.parentId, list);
    }
    const recurse = (parentId: string | null): OrganizationTreeNode[] =>
      (byParent.get(parentId) ?? []).map((o) => ({ ...o, children: recurse(o.id) }));
    return recurse(rootId);
  }
}

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@common/prisma/prisma.service';
import type { ListUsersQuery } from './users.schemas';

interface UserListItem {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  companyId: string;
  companyName: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  roles: string[];
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListUsersQuery): Promise<PaginatedResult<UserListItem>> {
    const { page, pageSize, search, companyId, isActive } = query;
    const where: Prisma.UserWhereInput = {
      ...(companyId && { companyId }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { fullName: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: [{ fullName: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          company: { select: { name: true } },
          userRoles: { include: { role: { select: { code: true } } } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    const items: UserListItem[] = rows.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      companyId: u.companyId,
      companyName: u.company.name,
      isActive: u.isActive,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      roles: u.userRoles.map((ur) => ur.role.code),
    }));

    return { items, total, page, pageSize };
  }
}

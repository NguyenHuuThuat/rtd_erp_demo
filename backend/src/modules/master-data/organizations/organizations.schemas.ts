import { z } from 'zod';

export const organizationTypeSchema = z.enum(['GROUP', 'COMPANY', 'BRANCH']);
export type OrganizationTypeDto = z.infer<typeof organizationTypeSchema>;

const codeSchema = z
  .string()
  .min(2, 'Mã tối thiểu 2 ký tự')
  .max(20, 'Mã tối đa 20 ký tự')
  .regex(/^[A-Z0-9_-]+$/, 'Mã chỉ gồm chữ HOA, số, gạch dưới hoặc gạch ngang');

export const createOrganizationSchema = z.object({
  code: codeSchema,
  name: z.string().min(2).max(200),
  type: organizationTypeSchema,
  parentId: z.string().uuid().nullable().optional(),
  taxCode: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  provinceCode: z.string().max(5).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
});
export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();
export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>;

export const listOrganizationsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  type: organizationTypeSchema.optional(),
  parentId: z.string().uuid().optional(),
  isActive: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().default(false),
});
export type ListOrganizationsQuery = z.infer<typeof listOrganizationsSchema>;

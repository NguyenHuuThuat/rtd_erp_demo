import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { OrganizationsService } from './organizations.service';
import {
  type CreateOrganizationDto,
  createOrganizationSchema,
  type ListOrganizationsQuery,
  listOrganizationsSchema,
  type UpdateOrganizationDto,
  updateOrganizationSchema,
} from './organizations.schemas';

@ApiTags('master-data/organizations')
@ApiBearerAuth()
@Controller('master-data/organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationsService) {}

  @Get()
  @Permissions('master_data.organizations:read')
  @ApiOperation({ summary: 'Danh sách tổ chức (phân trang + lọc)' })
  list(@Query(new ZodValidationPipe(listOrganizationsSchema)) query: ListOrganizationsQuery) {
    return this.service.list(query);
  }

  @Get('tree')
  @Permissions('master_data.organizations:read')
  @ApiOperation({ summary: 'Cây tổ chức (toàn bộ hoặc 1 nhánh)' })
  tree(@Query('rootId') rootId?: string) {
    return this.service.getTree(rootId);
  }

  @Get(':id')
  @Permissions('master_data.organizations:read')
  @ApiOperation({ summary: 'Chi tiết 1 tổ chức' })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getById(id);
  }

  @Post()
  @Permissions('master_data.organizations:write')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo tổ chức mới' })
  create(@Body(new ZodValidationPipe(createOrganizationSchema)) dto: CreateOrganizationDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Permissions('master_data.organizations:write')
  @ApiOperation({ summary: 'Cập nhật tổ chức' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(updateOrganizationSchema)) dto: UpdateOrganizationDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions('master_data.organizations:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa mềm tổ chức (deletedAt)' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.softDelete(id);
  }
}

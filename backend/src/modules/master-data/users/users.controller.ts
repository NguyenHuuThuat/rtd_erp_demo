import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { UsersService } from './users.service';
import { type ListUsersQuery, listUsersSchema } from './users.schemas';

@ApiTags('master-data/users')
@ApiBearerAuth()
@Controller('master-data/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @Permissions('master_data.users:read')
  @ApiOperation({ summary: 'Danh sách người dùng (kèm role)' })
  list(@Query(new ZodValidationPipe(listUsersSchema)) query: ListUsersQuery) {
    return this.service.list(query);
  }
}

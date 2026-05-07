import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodError, ZodSchema } from 'zod';

interface ZodFieldError {
  field: string;
  message: string;
}

/**
 * Pipe chuyển input thô sang DTO type-safe theo Zod schema.
 * Fail trả về ProblemDetails với danh sách lỗi từng field.
 */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown, _metadata: ArgumentMetadata): T {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;

    throw new BadRequestException({
      type: 'about:blank',
      title: 'Validation Failed',
      detail: this.formatZodErrors(result.error),
    });
  }

  private formatZodErrors(error: ZodError): ZodFieldError[] {
    return error.errors.map((e) => ({
      field: e.path.join('.') || '<root>',
      message: e.message,
    }));
  }
}

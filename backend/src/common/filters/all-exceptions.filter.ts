import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: unknown;
  instance: string;
}

/**
 * RFC 7807 Problem Details exception filter.
 * Map mọi exception (HTTP, Prisma, runtime) về cấu trúc response chuẩn.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const problem = this.toProblemDetails(exception, request.url);

    if (problem.status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${problem.status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response
      .status(problem.status)
      .header('Content-Type', 'application/problem+json')
      .json(problem);
  }

  private toProblemDetails(exception: unknown, instance: string): ProblemDetails {
    if (exception instanceof HttpException) {
      return this.fromHttpException(exception, instance);
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.fromPrismaError(exception, instance);
    }
    if (exception instanceof Prisma.PrismaClientValidationError) {
      return {
        type: 'about:blank',
        title: 'Database Validation',
        status: HttpStatus.BAD_REQUEST,
        detail: exception.message.split('\n').pop() ?? exception.message,
        instance,
      };
    }
    return {
      type: 'about:blank',
      title: 'Internal Server Error',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      detail: exception instanceof Error ? exception.message : 'Unknown error',
      instance,
    };
  }

  private fromHttpException(ex: HttpException, instance: string): ProblemDetails {
    const status = ex.getStatus();
    const body = ex.getResponse();
    const fallbackTitle = HttpStatus[status]?.toString().replaceAll('_', ' ') ?? 'Error';

    if (typeof body === 'object' && body !== null) {
      const obj = body as Record<string, unknown>;
      return {
        type: typeof obj.type === 'string' ? obj.type : 'about:blank',
        title: typeof obj.title === 'string' ? obj.title : fallbackTitle,
        status,
        detail: obj.detail ?? obj.message,
        instance,
      };
    }
    return { type: 'about:blank', title: fallbackTitle, status, detail: body, instance };
  }

  private fromPrismaError(err: Prisma.PrismaClientKnownRequestError, instance: string): ProblemDetails {
    const meta = err.meta as { target?: string[]; field_name?: string } | undefined;
    switch (err.code) {
      case 'P2002':
        return {
          type: 'about:blank',
          title: 'Conflict',
          status: HttpStatus.CONFLICT,
          detail: `Trùng giá trị trên trường: ${meta?.target?.join(', ') ?? 'unknown'}`,
          instance,
        };
      case 'P2003':
        return {
          type: 'about:blank',
          title: 'Foreign Key Violation',
          status: HttpStatus.BAD_REQUEST,
          detail: `Vi phạm khóa ngoại: ${meta?.field_name ?? 'unknown'}`,
          instance,
        };
      case 'P2025':
        return {
          type: 'about:blank',
          title: 'Not Found',
          status: HttpStatus.NOT_FOUND,
          detail: 'Không tìm thấy bản ghi',
          instance,
        };
      default:
        return {
          type: 'about:blank',
          title: 'Database Error',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          detail: `${err.code}: ${err.message}`,
          instance,
        };
    }
  }
}

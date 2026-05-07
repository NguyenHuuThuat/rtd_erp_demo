import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

/**
 * Bọc response controller theo cấu trúc { data, meta }.
 * Nếu service trả { items, total, page, pageSize } (paginated) thì
 * tự động tách items ra `data` và phần còn lại vào `meta`.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((value) => {
        if (this.isPaginated(value)) {
          const { items, ...meta } = value;
          return { data: items as T, meta };
        }
        return { data: value as T };
      }),
    );
  }

  private isPaginated(value: unknown): value is { items: unknown; total: number; page: number; pageSize: number } {
    return (
      typeof value === 'object' &&
      value !== null &&
      'items' in value &&
      'total' in value &&
      'page' in value &&
      'pageSize' in value
    );
  }
}

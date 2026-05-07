import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableCors({ origin: true, credentials: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RTD ERP API')
    .setDescription('Demo Hệ thống Thông tin Quản lý Tập đoàn RTD — Phase 1')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Đăng nhập & quản lý phiên')
    .addTag('master-data/organizations', 'Cơ cấu tổ chức')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`🚀 RTD ERP API: http://localhost:${port}/api/v1`);
  // eslint-disable-next-line no-console
  console.log(`📚 Swagger:    http://localhost:${port}/api/docs`);
}

void bootstrap();

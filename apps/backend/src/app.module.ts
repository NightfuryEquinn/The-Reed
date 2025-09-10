import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './api/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { KyselyModule } from './kysely/kysely.module';
import { LoggingInterceptor } from './logging/logging.interceptor';
import { LoggingMiddleware } from './logging/logging.middleware';
import { LoggingModule } from './logging/logging.module';

@Module({
  imports: [
    ConfigModule,
    KyselyModule,
    LoggingModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*')
  }
}

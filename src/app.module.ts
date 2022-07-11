import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DashboardModule,
    CategoryModule,
    ProductModule,
  ],
  providers: [ChatGateway],
})
export class AppModule {}

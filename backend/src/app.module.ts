import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ItemsModule } from './items/items.module';
import { RentalsModule } from './rentals/rentals.module';
import { ReturnsModule } from './returns/returns.module';
import { PaymentsModule } from './payments/payments.module';
import { DepositsModule } from './deposits/deposits.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule } from './config/config.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ItemsModule,
    RentalsModule,
    ReturnsModule,
    PaymentsModule,
    DepositsModule,
    PromotionsModule,
    ReviewsModule,
    NotificationsModule,
    AdminModule,
    ReportsModule,
    ConfigModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

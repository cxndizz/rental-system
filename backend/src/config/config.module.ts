import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService as SystemConfigService } from './config.service';

@Module({
  controllers: [ConfigController],
  providers: [SystemConfigService],
  exports: [SystemConfigService],
})
export class ConfigModule {}

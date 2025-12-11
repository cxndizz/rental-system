import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ConfigService as SystemConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private configService: SystemConfigService) {}

  @Get()
  getAllConfigs() {
    return this.configService.getAllConfigs();
  }

  @Get(':key')
  getConfig(@Param('key') key: string) {
    return this.configService.getConfig(key);
  }

  @Put(':key')
  updateConfig(@Param('key') key: string, @Body() dto: any) {
    return this.configService.updateConfig(key, dto.value);
  }
}

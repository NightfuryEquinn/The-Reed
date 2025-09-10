import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvVars } from './repo/env';

@Injectable()
export class ConfigService extends NestConfigService<EnvVars> {
  constructor() {
    super();
  }
}

import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [ConfigService, MailService],
  exports: [MailService],
})
export class MailModule {}

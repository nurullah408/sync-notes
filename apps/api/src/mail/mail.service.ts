import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import Handlebars from 'handlebars';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);

  private readonly client: ReturnType<Mailgun['client']>;
  private readonly domain: string;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    //const region = this.configService.getOrThrow<string>('MAILGUN_REGION');
    this.domain = this.configService.getOrThrow<string>('MAILGUN_DOMAIN');
    this.from = this.configService.getOrThrow<string>('MAIL_FROM');
    this.client = new Mailgun(FormData).client({
      username: 'api',
      key: this.configService.getOrThrow<string>('MAILGUN_API_KEY'),
      url: this.configService.getOrThrow<string>('MAILGUN_BASE_URL'),
    });
  }

  private async renderTemplate(
    template: string,
    context: Record<string, string>,
  ): Promise<string> {
    const path = join(__dirname, 'templates', `${template}.hbs`);
    const source = await readFile(path, 'utf-8');
    const compile = Handlebars.compile(source, { strict: true });
    return compile(context);
  }

  private async sendMail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, string>,
  ) {
    try {
      const html = await this.renderTemplate(template, context);
      await this.client.messages.create(this.domain, {
        from: this.from,
        to: [to],
        subject,
        html,
      });
      this.logger.log(`Email accepted from mailgun for ${to}`);
    } catch (e: unknown) {
      this.logger.error(`Email not accepted by mailgun for ${to}.`);
      this.logger.error(e);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  async sendVerificationEmail(to: string, otp: string) {
    await this.sendMail(to, 'Verify your email', 'verification', { otp });
  }

  async sendPasswordResetEmail(to: string, resetLink: string) {
    await this.sendMail(to, 'Reset your SyncNotes Password', 'password-reset', {
      resetLink,
    });
  }
}

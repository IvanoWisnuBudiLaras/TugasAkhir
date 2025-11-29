import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { GmailService } from './gmail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'EMAIL_SERVICE',
            useFactory: (configService: ConfigService) => {
                // Gunakan Gmail Service jika service account tersedia
                const serviceAccountKey = configService.get('GMAIL_SERVICE_ACCOUNT_KEY');
                const keyFilePath = configService.get('GMAIL_KEY_FILE_PATH');
                
                if (serviceAccountKey || keyFilePath) {
                    return new GmailService(configService);
                }
                
                // Fallback ke SMTP biasa
                return new EmailService(configService);
            },
            inject: [ConfigService],
        },
        EmailService,
        GmailService,
    ],
    exports: ['EMAIL_SERVICE', EmailService, GmailService],
})
export class EmailModule { }
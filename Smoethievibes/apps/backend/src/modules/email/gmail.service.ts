import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import * as path from 'path';

@Injectable()
export class GmailService {
  private auth: any;

  constructor(private configService: ConfigService) {
    this.initializeAuth();
  }

  private initializeAuth() {
    try {
      // Coba gunakan service account dari environment variable
      const serviceAccountKey = this.configService.get('GMAIL_SERVICE_ACCOUNT_KEY');
      
      if (serviceAccountKey) {
        // Parse JSON dari environment variable
        const credentials = JSON.parse(serviceAccountKey);
        
        this.auth = new google.auth.GoogleAuth({
          credentials,
          scopes: ['https://www.googleapis.com/auth/gmail.send'],
        });
      } else {
        // Fallback ke file service account
        const keyFilePath = this.configService.get('GMAIL_KEY_FILE_PATH') || 
                           path.join(process.cwd(), 'service-account-key.json');
        
        this.auth = new google.auth.GoogleAuth({
          keyFile: keyFilePath,
          scopes: ['https://www.googleapis.com/auth/gmail.send'],
        });
      }
    } catch (error) {
      console.error('Error initializing Gmail service:', error);
      throw error;
    }
  }

  async sendOtp(email: string, otp: string) {
    try {
      const authClient = await this.auth.getClient();
      const gmail = google.gmail({ version: 'v1', auth: authClient });
      
      const senderEmail = this.configService.get('GMAIL_SENDER_EMAIL') || 
                         this.configService.get('EMAIL_FROM') || 
                         'noreply@smoethievibes.com';

      const message = [
        `From: "SmoethieVibes" <${senderEmail}>`,
        `To: ${email}`,
        'Subject: Your Login OTP',
        'Content-Type: text/html; charset=utf-8',
        '',
        `<p>Your OTP code is: <b>${otp}</b></p><p>It expires in 5 minutes.</p>`,
      ].join('\r\n');

      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      console.log('Email sent successfully:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Error sending email via Gmail:', error);
      
      // Fallback: log OTP ke console untuk development
      console.log('DEV MODE OTP:', otp);
      
      throw error;
    }
  }
}
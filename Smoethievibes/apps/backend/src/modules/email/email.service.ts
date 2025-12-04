import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter | null;

    constructor(private configService: ConfigService) {
        const emailPass = this.configService.get('EMAIL_PASS');
        
        // Development mode: disable email and use console logging
        if (emailPass === 'disable-email-for-dev') {
            console.log('📧 Email service disabled for development - OTP will be logged to console');
            this.transporter = null;
            return;
        }
        
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('EMAIL_HOST'),
            port: Number(this.configService.get('EMAIL_PORT')) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: emailPass,
            },
        });
    }

    async sendOtp(email: string, otp: string) {
        // Development mode: log to console instead of sending email
        if (!this.transporter) {
            console.log(`\n🎯 DEVELOPMENT OTP for ${email}: ${otp}\n`);
            return { messageId: 'dev-mode', message: 'OTP logged to console in development mode' };
        }

        const mailOptions = {
            from: '"SmoethieVibes" <no-reply@smoethievibes.com>',
            to: email,
            subject: 'Your Login OTP',
            text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
            html: `<p>Your OTP code is: <b>${otp}</b></p><p>It expires in 5 minutes.</p>`,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            // Fallback: log the OTP if email fails
            console.log('🎯 FALLBACK OTP:', otp);
            throw error;
        }
    }
}
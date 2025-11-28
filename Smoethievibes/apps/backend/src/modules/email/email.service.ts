import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: Number(this.configService.get('MAIL_PORT')) || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }

    async sendOtp(email: string, otp: string) {
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
            // In dev, we might want to log the OTP if email fails
            console.log('DEV MODE OTP:', otp);
            throw error;
        }
    }
}

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

/**
 * @strategy Google OAuth 2.0
 * @deskripsi Passport strategy untuk Google OAuth 2.0 authentication
 * @fitur
 *   - Login/registrasi dengan akun Google
 *   - Extract user info (email, name, avatar) dari Google profile
 *   - Auto-create user jika belum terdaftar
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private readonly logger = new Logger(GoogleStrategy.name);

    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        const clientID = configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');

        // @fitur Initialize strategy dengan Google OAuth credentials
        super({
            clientID: clientID || 'disable',
            clientSecret: clientSecret || 'disable',
            callbackURL: configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/auth/google/callback',
            scope: ['email', 'profile'],
        });

        // @validasi Pastikan credentials Google OAuth dikonfigurasi setelah super() dipanggil
        if (!clientID || clientID === 'YOUR_GOOGLE_CLIENT_ID_HERE' || clientID === 'disable') {
            const message = 'Google OAuth disabled. Silakan configure GOOGLE_CLIENT_ID di file .env';
            this.logger.warn(message);
        }

        if (!clientSecret || clientSecret === 'YOUR_GOOGLE_CLIENT_SECRET_HERE' || clientSecret === 'disable') {
            const message = 'Google OAuth disabled. Silakan configure GOOGLE_CLIENT_SECRET di file .env';
            this.logger.warn(message);
        }

        this.logger.log('Google OAuth Strategy berhasil diinisialisasi');
    }

    /**
     * @method validate
     * @deskripsi Validasi user dari Google dan buat user di DB jika belum ada
     * @param accessToken - Google access token
     * @param refreshToken - Google refresh token
     * @param profile - Google profile data
     * @param done - Passport callback
     */
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            const { name, emails, photos } = profile;
            const user = {
                email: emails[0].value,
                firstName: name.givenName,
                lastName: name.familyName,
                picture: photos[0]?.value || null,
                accessToken,
            };

            // @fitur Validasi atau buat user di database
            const validatedUser = await this.authService.validateGoogleUser(user);
            done(null, validatedUser);
        } catch (error) {
            this.logger.error('Error dalam Google OAuth validation:', error);
            done(error, false);
        }
    }
}
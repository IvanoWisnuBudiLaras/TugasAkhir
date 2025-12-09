import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private readonly logger = new Logger(GoogleStrategy.name);

    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        const clientID = configService.get('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');

        // Call super first to initialize the strategy
        super({
            clientID: clientID || 'disable',
            clientSecret: clientSecret || 'disable',
            callbackURL: configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3001/auth/google/callback',
            scope: ['email', 'profile'],
        });

        // Validate that credentials are configured after super() is called
        if (!clientID || clientID === 'YOUR_GOOGLE_CLIENT_ID_HERE' || clientID === 'disable') {
            const message = 'Google OAuth is disabled. Please configure GOOGLE_CLIENT_ID in your .env file';
            this.logger.warn(message);
        }

        if (!clientSecret || clientSecret === 'YOUR_GOOGLE_CLIENT_SECRET_HERE' || clientSecret === 'disable') {
            const message = 'Google OAuth is disabled. Please configure GOOGLE_CLIENT_SECRET in your .env file';
            this.logger.warn(message);
        }

        this.logger.log('Google OAuth Strategy initialized successfully');
    }

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

            // Validate or create user in DB
            const validatedUser = await this.authService.validateGoogleUser(user);
            done(null, validatedUser);
        } catch (error) {
            this.logger.error('Error in Google OAuth validation:', error);
            done(error, false);
        }
    }
}
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * @strategy JWT
 * @deskripsi Passport strategy untuk validasi JWT token
 * @fitur
 *   - Extract JWT dari Authorization header (Bearer token)
 *   - Validasi signature dan expiration token
 *   - Return user payload pada validasi sukses
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);

    constructor(configService: ConfigService) {
        super({
            // @fitur Extract JWT dari header "Authorization: Bearer <token>"
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // @fitur Reject token yang sudah expired (ignoreExpiration: false berarti token harus valid)
            ignoreExpiration: false,
            // @fitur Gunakan JWT secret key yang dikonfigurasi untuk validasi signature token
            secretOrKey: configService.get('JWT_SECRET') || configService.get('jwt.secret') || 'super-secret',
        });
        this.logger.debug('JWT Strategy diinisialisasi');
    }

    /**
     * @method validate
     * @deskripsi Extract dan validasi payload dari JWT token
     * @param payload - Decoded JWT payload { sub, email, roles, iss, aud, iat, exp }
     * @returns User object dengan sub (user ID), email, dan roles
     */
    async validate(payload: any) {
        this.logger.debug(`Memvalidasi JWT untuk user: ${payload.email}`);
        return { 
            sub: payload.sub,      // User ID
            email: payload.email,
            roles: payload.roles || [],
        };
    }
}
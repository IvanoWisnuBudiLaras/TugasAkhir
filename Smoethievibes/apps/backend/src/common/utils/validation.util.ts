import { validate } from 'class-validator';

export class ValidationUtil {
  static async validateDto(dto: any): Promise<string[]> {
    const errors = await validate(dto);
    if (errors.length > 0) {
      return errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      );
    }
    return [];
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone);
  }

  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
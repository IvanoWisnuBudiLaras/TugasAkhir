import { validate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class ValidationUtil {
  static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  static readonly PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;
  static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  static readonly SLUG_REGEX = /^[a-z0-9-]+$/;
  static readonly SKU_REGEX = /^[A-Z0-9-]+$/;
  static readonly BARCODE_REGEX = /^[0-9]{8,13}$/;

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

  static validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    return this.EMAIL_REGEX.test(email.trim().toLowerCase());
  }

  static validatePhone(phone: string): boolean {
    if (!phone || typeof phone !== 'string') return false;
    return this.PHONE_REGEX.test(phone.replace(/\s/g, ''));
  }

  static validatePassword(password: string): boolean {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 8 && password.length <= 128;
  }

  static validateStrongPassword(password: string): boolean {
    if (!password || typeof password !== 'string') return false;
    return this.PASSWORD_REGEX.test(password) && password.length >= 8;
  }

  static validateSlug(slug: string): boolean {
    if (!slug || typeof slug !== 'string') return false;
    return this.SLUG_REGEX.test(slug.toLowerCase());
  }

  static validateSKU(sku: string): boolean {
    if (!sku || typeof sku !== 'string') return false;
    return this.SKU_REGEX.test(sku.toUpperCase());
  }

  static validateBarcode(barcode: string): boolean {
    if (!barcode || typeof barcode !== 'string') return false;
    return this.BARCODE_REGEX.test(barcode);
  }

  static sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') return '';
    return email.trim().toLowerCase();
  }

  static sanitizePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') return '';
    return phone.replace(/\s/g, '');
  }

  static sanitizeSlug(text: string): string {
    if (!text || typeof text !== 'string') return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    return input
      .trim()
      .replace(/[<>"'&;|`]/g, '')
      .replace(/\s+/g, ' ')
      .substring(0, 1000);
  }

  static validateRequiredFields(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !data[field] || data[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
    }
  }

  static validateEnum(value: string, validValues: string[], fieldName: string): void {
    if (!validValues.includes(value)) {
      throw new BadRequestException(`Invalid ${fieldName}. Must be one of: ${validValues.join(', ')}`);
    }
  }

  static validateRange(value: number, min: number, max: number, fieldName: string): void {
    if (value < min || value > max) {
      throw new BadRequestException(`${fieldName} must be between ${min} and ${max}`);
    }
  }

  static validateMinLength(value: string, minLength: number, fieldName: string): void {
    if (!value || value.length < minLength) {
      throw new BadRequestException(`${fieldName} must be at least ${minLength} characters long`);
    }
  }

  static validateMaxLength(value: string, maxLength: number, fieldName: string): void {
    if (value && value.length > maxLength) {
      throw new BadRequestException(`${fieldName} must not exceed ${maxLength} characters`);
    }
  }

  static generateOTP(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min.toString();
  }

  static generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }

  static generateSKU(prefix: string = 'SKU'): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${timestamp}-${random}`;
  }
}
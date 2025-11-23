import { ValidationUtil } from './validation.util';
import { IsEmail, IsString, MinLength } from 'class-validator';

class TestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  name!: string;
}

describe('ValidationUtil', () => {
  describe('validateDto', () => {
    it('should validate valid DTO', async () => {
      const dto = new TestDto();
      dto.email = 'test@example.com';
      dto.name = 'Test User';

      const result = await ValidationUtil.validateDto(dto);
      expect(result).toBe(true);
    });

    it('should throw error for invalid DTO', async () => {
      const dto = new TestDto();
      dto.email = 'invalid-email';
      dto.name = 'ab'; // Too short

      await expect(ValidationUtil.validateDto(dto)).rejects.toThrow();
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      expect(ValidationUtil.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationUtil.isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(ValidationUtil.isValidEmail('invalid-email')).toBe(false);
      expect(ValidationUtil.isValidEmail('@example.com')).toBe(false);
      expect(ValidationUtil.isValidEmail('test@')).toBe(false);
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return true for valid phone numbers', () => {
      expect(ValidationUtil.isValidPhoneNumber('+1234567890')).toBe(true);
      expect(ValidationUtil.isValidPhoneNumber('123-456-7890')).toBe(true);
      expect(ValidationUtil.isValidPhoneNumber('(123) 456-7890')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(ValidationUtil.isValidPhoneNumber('123')).toBe(false);
      expect(ValidationUtil.isValidPhoneNumber('invalid')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(ValidationUtil.isValidUrl('https://example.com')).toBe(true);
      expect(ValidationUtil.isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(ValidationUtil.isValidUrl('not-a-url')).toBe(false);
      expect(ValidationUtil.isValidUrl('ftp://example.com')).toBe(false);
    });
  });
});
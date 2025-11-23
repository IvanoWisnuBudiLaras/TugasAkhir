import { StringUtil } from './string.util';

describe('StringUtil', () => {
  describe('capitalize', () => {
    it('should capitalize first letter of string', () => {
      expect(StringUtil.capitalize('hello')).toBe('Hello');
      expect(StringUtil.capitalize('world')).toBe('World');
    });

    it('should handle empty string', () => {
      expect(StringUtil.capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(StringUtil.capitalize('a')).toBe('A');
    });
  });

  describe('slugify', () => {
    it('should create slug from string', () => {
      expect(StringUtil.slugify('Hello World')).toBe('hello-world');
      expect(StringUtil.slugify('Test Product Name')).toBe('test-product-name');
    });

    it('should handle special characters', () => {
      expect(StringUtil.slugify('Hello@World!')).toBe('hello-world');
      expect(StringUtil.slugify('Product #123')).toBe('product-123');
    });

    it('should handle multiple spaces', () => {
      expect(StringUtil.slugify('Hello   World')).toBe('hello-world');
    });
  });

  describe('truncate', () => {
    it('should truncate string to specified length', () => {
      const longString = 'This is a very long string that needs to be truncated';
      const result = StringUtil.truncate(longString, 20);
      expect(result).toBe('This is a very long...');
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    });

    it('should not truncate short strings', () => {
      const shortString = 'Short string';
      const result = StringUtil.truncate(shortString, 50);
      expect(result).toBe(shortString);
    });
  });

  describe('generateCode', () => {
    it('should generate code with default length', () => {
      const code = StringUtil.generateCode();
      expect(code).toHaveLength(8);
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    it('should generate code with custom length', () => {
      const length = 12;
      const code = StringUtil.generateCode('', length);
      expect(code).toHaveLength(length);
      expect(code).toMatch(/^[A-Z0-9]+$/);
    });

    it('should generate different codes each time', () => {
      const code1 = StringUtil.generateCode();
      const code2 = StringUtil.generateCode();
      expect(code1).not.toBe(code2);
    });
  });

  describe('maskEmail', () => {
    it('should mask email properly', () => {
      expect(StringUtil.maskEmail('user@example.com')).toBe('u***@example.com');
      expect(StringUtil.maskEmail('test.user@domain.co.uk')).toBe('t********@domain.co.uk');
    });

    it('should handle short emails', () => {
      expect(StringUtil.maskEmail('ab@cd.com')).toBe('a*@cd.com');
    });
  });
});
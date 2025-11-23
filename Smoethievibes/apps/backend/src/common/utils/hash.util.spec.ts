import { HashUtil } from './hash.util';

describe('HashUtil', () => {
  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = await HashUtil.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await HashUtil.hashPassword(password);
      const hash2 = await HashUtil.hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const password = 'testPassword123';
      const hashedPassword = await HashUtil.hashPassword(password);
      
      const result = await HashUtil.comparePassword(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword123';
      const hashedPassword = await HashUtil.hashPassword(password);
      
      const result = await HashUtil.comparePassword(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('generateRandomString', () => {
    it('should generate string with default length', () => {
      const randomString = HashUtil.generateRandomString();
      expect(randomString).toHaveLength(32);
    });

    it('should generate string with custom length', () => {
      const length = 16;
      const randomString = HashUtil.generateRandomString(length);
      expect(randomString).toHaveLength(length);
    });

    it('should generate different strings each time', () => {
      const string1 = HashUtil.generateRandomString();
      const string2 = HashUtil.generateRandomString();
      
      expect(string1).not.toBe(string2);
    });
  });
});
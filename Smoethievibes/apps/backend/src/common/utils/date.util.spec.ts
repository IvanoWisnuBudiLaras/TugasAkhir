import { DateUtil } from './date.util';

describe('DateUtil', () => {
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = DateUtil.formatDate(date);
      expect(result).toBe('2024-01-15');
    });
  });

  describe('formatDateTime', () => {
    it('should format datetime correctly', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = DateUtil.formatDateTime(date);
      expect(result).toBe('2024-01-15 10:30:00');
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2024-01-15');
      const result = DateUtil.addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle month boundaries', () => {
      const date = new Date('2024-01-28');
      const result = DateUtil.addDays(date, 5);
      expect(result.getDate()).toBe(2);
      expect(result.getMonth()).toBe(1); // February
    });
  });

  describe('addHours', () => {
    it('should add hours to date', () => {
      const date = new Date('2024-01-15T10:00:00');
      const result = DateUtil.addHours(date, 3);
      expect(result.getHours()).toBe(13);
    });

    it('should handle day boundaries', () => {
      const date = new Date('2024-01-15T22:00:00');
      const result = DateUtil.addHours(date, 5);
      expect(result.getHours()).toBe(3);
      expect(result.getDate()).toBe(16);
    });
  });

  describe('isExpired', () => {
    it('should return true for expired date', () => {
      const expiredDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago
      expect(DateUtil.isExpired(expiredDate)).toBe(true);
    });

    it('should return false for future date', () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
      expect(DateUtil.isExpired(futureDate)).toBe(false);
    });
  });

  describe('getStartOfDay', () => {
    it('should return start of day', () => {
      const date = new Date('2024-01-15T15:30:45');
      const result = DateUtil.getStartOfDay(date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  });

  describe('getEndOfDay', () => {
    it('should return end of day', () => {
      const date = new Date('2024-01-15T10:30:45');
      const result = DateUtil.getEndOfDay(date);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
      expect(result.getMilliseconds()).toBe(999);
    });
  });
});
import { ParseUUIDPipe } from './parse-uuid.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ParseUUIDPipe', () => {
  let pipe: ParseUUIDPipe;

  beforeEach(() => {
    pipe = new ParseUUIDPipe();
  });

  describe('transform', () => {
    it('should transform valid UUID', async () => {
      const validUuid = '550e8400-e29b-41d4-a716-446655440000';
      const result = await pipe.transform(validUuid, { type: 'param', metatype: String, data: '' });
      expect(result).toBe(validUuid);
    });

    it('should throw error for invalid UUID', async () => {
      const invalidUuid = 'invalid-uuid';
      
      await expect(
        pipe.transform(invalidUuid, { type: 'param', metatype: String, data: '' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error for empty string', async () => {
      await expect(
        pipe.transform('', { type: 'param', metatype: String, data: '' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error for null', async () => {
      await expect(
        pipe.transform(null as any, { type: 'param', metatype: String, data: '' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error for undefined', async () => {
      await expect(
        pipe.transform(undefined as any, { type: 'param', metatype: String, data: '' })
      ).rejects.toThrow(BadRequestException);
    });
  });
});
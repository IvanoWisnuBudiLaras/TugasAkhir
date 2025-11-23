import { ValidationPipe } from './validation.pipe';
import { ArgumentMetadata } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';

class TestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(3)
  name!: string;
}

describe('ValidationPipe', () => {
  let pipe: ValidationPipe;

  beforeEach(() => {
    pipe = new ValidationPipe();
  });

  describe('transform', () => {
    it('should transform valid input', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: TestDto,
        data: '',
      };

      const input = {
        email: 'test@example.com',
        name: 'Test User',
      };

      const result = await pipe.transform(input, metadata);
      expect(result).toEqual(input);
    });

    it('should throw error for invalid input', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: TestDto,
        data: '',
      };

      const input = {
        email: 'invalid-email',
        name: 'ab', // Too short
      };

      await expect(pipe.transform(input, metadata)).rejects.toThrow();
    });

    it('should handle non-object input', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: String,
        data: '',
      };

      const input = 'simple string';
      const result = await pipe.transform(input, metadata);
      expect(result).toBe(input);
    });

    it('should handle undefined metatype', async () => {
      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: undefined,
        data: '',
      };

      const input = { test: 'data' };
      const result = await pipe.transform(input, metadata);
      expect(result).toBe(input);
    });
  });
});
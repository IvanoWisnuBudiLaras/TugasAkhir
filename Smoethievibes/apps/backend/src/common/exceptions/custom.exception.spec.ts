import { CustomException, NotFoundException, UnauthorizedException, ForbiddenException, ConflictException } from './custom.exception';
import { HttpStatus } from '@nestjs/common';

describe('CustomException', () => {
  describe('CustomException', () => {
    it('should create custom exception with message', () => {
      const exception = new CustomException('Custom error message');
      
      expect(exception.message).toBe('Custom error message');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should create custom exception with message and status', () => {
      const exception = new CustomException('Custom error', HttpStatus.INTERNAL_SERVER_ERROR);
      
      expect(exception.message).toBe('Custom error');
      expect(exception.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should create custom exception with additional data', () => {
      const additionalData = { field: 'value' };
      const exception = new CustomException('Custom error', HttpStatus.BAD_REQUEST);
      
      expect(exception.message).toBe('Custom error');
      expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  describe('NotFoundException', () => {
    it('should create not found exception', () => {
      const exception = new NotFoundException('Resource not found');
      
      expect(exception.message).toBe('Resource not found');
      expect(exception.getStatus()).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe('UnauthorizedException', () => {
    it('should create unauthorized exception', () => {
      const exception = new UnauthorizedException('Unauthorized access');
      
      expect(exception.message).toBe('Unauthorized access');
      expect(exception.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('ForbiddenException', () => {
    it('should create forbidden exception', () => {
      const exception = new ForbiddenException('Access forbidden');
      
      expect(exception.message).toBe('Access forbidden');
      expect(exception.getStatus()).toBe(HttpStatus.FORBIDDEN);
    });
  });

  describe('ConflictException', () => {
    it('should create conflict exception', () => {
      const exception = new ConflictException('Resource conflict');
      
      expect(exception.message).toBe('Resource conflict');
      expect(exception.getStatus()).toBe(HttpStatus.CONFLICT);
    });
  });
});
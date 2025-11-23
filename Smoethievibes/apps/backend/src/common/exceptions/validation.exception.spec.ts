import { ValidationException } from './validation.exception';

describe('ValidationException', () => {
  it('should create validation exception with errors', () => {
    const mockErrors = [
      'email must be an email',
      'name must be longer than or equal to 3 characters',
    ];

    const exception = new ValidationException(mockErrors);
    const response = exception.getResponse() as any;
    
    expect(exception.message).toBe('Validation failed');
    expect(exception.getStatus()).toBe(400);
    expect(response.success).toBe(false);
    expect(response.errors).toHaveLength(2);
    expect(response.errors[0]).toBe('email must be an email');
    expect(response.errors[1]).toBe('name must be longer than or equal to 3 characters');
    expect(response.timestamp).toBeDefined();
  });

  it('should handle empty errors array', () => {
    const exception = new ValidationException([]);
    const response = exception.getResponse() as any;
    
    expect(exception.message).toBe('Validation failed');
    expect(response.errors).toHaveLength(0);
    expect(response.timestamp).toBeDefined();
  });

  it('should handle string errors properly', () => {
    const mockErrors = [
      'Field email is invalid',
      'Field name is required',
    ];

    const exception = new ValidationException(mockErrors);
    const response = exception.getResponse() as any;
    
    expect(response.errors).toHaveLength(2);
    expect(response.errors[0]).toBe('Field email is invalid');
    expect(response.errors[1]).toBe('Field name is required');
  });
});
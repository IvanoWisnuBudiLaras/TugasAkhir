import { ApiResponseDto, ErrorResponseDto } from './api-response.dto';

describe('ApiResponseDto', () => {
  it('should create success response', () => {
    const response = new ApiResponseDto();
    response.success = true;
    response.message = 'Operation successful';
    response.data = { id: 1, name: 'Test' };
    response.timestamp = new Date().toISOString();
    response.path = '/api/test';

    expect(response.success).toBe(true);
    expect(response.message).toBe('Operation successful');
    expect(response.data).toEqual({ id: 1, name: 'Test' });
    expect(response.timestamp).toBeDefined();
    expect(response.path).toBe('/api/test');
  });

  it('should have default values', () => {
    const response = new ApiResponseDto();
    
    expect(response.success).toBe(true);
    expect(response.message).toBe('Request successful');
    expect(response.data).toBeNull();
    expect(response.timestamp).toBeDefined();
    expect(response.path).toBe('');
  });
});

describe('ErrorResponseDto', () => {
  it('should create error response', () => {
    const response = new ErrorResponseDto();
    response.success = false;
    response.message = 'Validation failed';
    response.timestamp = new Date().toISOString();
    response.path = '/api/test';
    response.error = 'Bad request - code: 400, details: Invalid input';

    expect(response.success).toBe(false);
    expect(response.message).toBe('Validation failed');
    expect(response.timestamp).toBeDefined();
    expect(response.path).toBe('/api/test');
    expect(response.error).toBe('Bad request - code: 400, details: Invalid input');
  });

  it('should have default values', () => {
    const response = new ErrorResponseDto();
    
    expect(response.success).toBe(false);
    expect(response.message).toBe('An error occurred');
    expect(response.timestamp).toBeDefined();
    expect(response.path).toBe('');
    expect(response.error).toBeNull();
  });
});
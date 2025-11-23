import { LoggerMiddleware } from './logger.middleware';
import { Request, Response, NextFunction } from 'express';

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    middleware = new LoggerMiddleware();
    mockRequest = {
      method: 'GET',
      url: '/api/test',
      ip: '127.0.0.1',
      headers: {
        'user-agent': 'test-agent',
      },
    };
    mockResponse = {
      statusCode: 200,
      statusMessage: 'OK',
    };
    mockNext = jest.fn();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log request details', () => {
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
    
    const logOutput = consoleSpy.mock.calls[0][0];
    expect(logOutput).toContain('GET');
    expect(logOutput).toContain('/api/test');
    expect(logOutput).toContain('127.0.0.1');
  });

  it('should log different HTTP methods', () => {
    mockRequest.method = 'POST';
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    const logOutput = consoleSpy.mock.calls[0][0];
    expect(logOutput).toContain('POST');
  });

  it('should handle requests without IP', () => {
    const mockRequestWithoutIp = {
      ...mockRequest,
      ip: undefined,
    };
    
    middleware.use(mockRequestWithoutIp as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should handle requests without user-agent', () => {
    mockRequest.headers = {};
    
    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
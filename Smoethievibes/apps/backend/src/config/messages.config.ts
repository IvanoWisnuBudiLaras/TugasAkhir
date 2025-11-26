import { registerAs } from '@nestjs/config';

export default registerAs('messages', () => ({
  // Error messages
  errors: {
    // General errors
    internalServerError: process.env.ERROR_INTERNAL_SERVER || 'Internal server error',
    notFound: process.env.ERROR_NOT_FOUND || 'Not found',
    validationFailed: process.env.ERROR_VALIDATION_FAILED || 'Validation failed',
    unauthorized: process.env.ERROR_UNAUTHORIZED || 'Unauthorized',
    forbidden: process.env.ERROR_FORBIDDEN || 'Forbidden',
    
    // User errors
    userNotFound: process.env.ERROR_USER_NOT_FOUND || 'User not found',
    userExists: process.env.ERROR_USER_EXISTS || 'Email sudah terdaftar. Silakan gunakan email lain.',
    invalidCredentials: process.env.ERROR_INVALID_CREDENTIALS || 'Invalid credentials',
    
    // Product errors
    productNotFound: process.env.ERROR_PRODUCT_NOT_FOUND || 'Produk tidak ditemukan',
    
    // Order errors
    duplicateProductInOrder: process.env.ERROR_DUPLICATE_PRODUCT_ORDER || 'Produk yang sama tidak boleh muncul lebih dari sekali dalam satu order.',
    duplicateProductInOrderWithHelp: process.env.ERROR_DUPLICATE_PRODUCT_ORDER_HELP || 'Produk yang sama tidak boleh muncul lebih dari sekali dalam satu order. Silahkan update jumlah produk tersebut jika ingin menambah quantity.',
    productNotFoundInOrder: process.env.ERROR_PRODUCT_NOT_FOUND_ORDER || 'Produk dengan ID ${productId} tidak ditemukan',
  },
  
  // Success messages
  success: {
    created: process.env.SUCCESS_CREATED || 'Created successfully',
    updated: process.env.SUCCESS_UPDATED || 'Updated successfully',
    deleted: process.env.SUCCESS_DELETED || 'Deleted successfully',
  },
  
  // Info messages
  info: {
    serverStarted: process.env.INFO_SERVER_STARTED || '🚀 Backend running on http://localhost:${port}',
    apiDocs: process.env.INFO_API_DOCS || '📚 API Documentation: http://localhost:${port}/api',
    requestLog: process.env.INFO_REQUEST_LOG || '${method} ${url} ${statusCode} - ${delay}ms',
    errorLog: process.env.INFO_ERROR_LOG || 'Error: ${message}',
  }
}));
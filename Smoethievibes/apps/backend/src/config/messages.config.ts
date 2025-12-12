import { registerAs } from '@nestjs/config';

export default registerAs('messages', () => ({
  // Error messages
  errors: {
    // General errors
    internalServerError: process.env.ERROR_INTERNAL_SERVER || 'Internal server error',
    notFound: process.env.ERROR_NOT_FOUND || 'Resource not found',
    validationFailed: process.env.ERROR_VALIDATION_FAILED || 'Validation failed',
    unauthorized: process.env.ERROR_UNAUTHORIZED || 'Unauthorized access',
    forbidden: process.env.ERROR_FORBIDDEN || 'Access forbidden',
    badRequest: process.env.ERROR_BAD_REQUEST || 'Bad request',
    conflict: process.env.ERROR_CONFLICT || 'Resource conflict',
    
    // Authentication errors
    invalidToken: process.env.ERROR_INVALID_TOKEN || 'Invalid or expired token',
    tokenExpired: process.env.ERROR_TOKEN_EXPIRED || 'Token has expired',
    invalidCredentials: process.env.ERROR_INVALID_CREDENTIALS || 'Invalid email or password',
    accountNotActive: process.env.ERROR_ACCOUNT_NOT_ACTIVE || 'Account is not active',
    accountLocked: process.env.ERROR_ACCOUNT_LOCKED || 'Account is temporarily locked',
    
    // User errors
    userNotFound: process.env.ERROR_USER_NOT_FOUND || 'User not found',
    userExists: process.env.ERROR_USER_EXISTS || 'Email already registered. Please use a different email address.',
    invalidEmail: process.env.ERROR_INVALID_EMAIL || 'Invalid email format',
    invalidPassword: process.env.ERROR_INVALID_PASSWORD || 'Password must be at least 8 characters long',
    passwordMismatch: process.env.ERROR_PASSWORD_MISMATCH || 'Passwords do not match',
    
    // Product errors
    productNotFound: process.env.ERROR_PRODUCT_NOT_FOUND || 'Product not found',
    productOutOfStock: process.env.ERROR_PRODUCT_OUT_OF_STOCK || 'Product is out of stock',
    insufficientStock: process.env.ERROR_INSUFFICIENT_STOCK || 'Insufficient stock available',
    invalidProductPrice: process.env.ERROR_INVALID_PRODUCT_PRICE || 'Invalid product price',
    
    // Category errors
    categoryNotFound: process.env.ERROR_CATEGORY_NOT_FOUND || 'Category not found',
    categoryExists: process.env.ERROR_CATEGORY_EXISTS || 'Category already exists',
    
    // Order errors
    orderNotFound: process.env.ERROR_ORDER_NOT_FOUND || 'Order not found',
    invalidOrderStatus: process.env.ERROR_INVALID_ORDER_STATUS || 'Invalid order status',
    orderCannotBeModified: process.env.ERROR_ORDER_CANNOT_BE_MODIFIED || 'Order cannot be modified',
    duplicateProductInOrder: process.env.ERROR_DUPLICATE_PRODUCT_ORDER || 'Same product cannot appear more than once in an order',
    duplicateProductInOrderWithHelp: process.env.ERROR_DUPLICATE_PRODUCT_ORDER_HELP || 'Same product cannot appear more than once in an order. Please update the quantity of the existing product instead.',
    productNotFoundInOrder: process.env.ERROR_PRODUCT_NOT_FOUND_ORDER || 'Product with ID ${productId} not found',
    
    // Payment errors
    paymentNotFound: process.env.ERROR_PAYMENT_NOT_FOUND || 'Payment not found',
    paymentFailed: process.env.ERROR_PAYMENT_FAILED || 'Payment processing failed',
    invalidPaymentAmount: process.env.ERROR_INVALID_PAYMENT_AMOUNT || 'Invalid payment amount',
    paymentAlreadyProcessed: process.env.ERROR_PAYMENT_ALREADY_PROCESSED || 'Payment has already been processed',
    
    // OTP errors
    otpInvalid: process.env.ERROR_OTP_INVALID || 'Invalid OTP code',
    otpExpired: process.env.ERROR_OTP_EXPIRED || 'OTP code has expired',
    otpMaxAttempts: process.env.ERROR_OTP_MAX_ATTEMPTS || 'Maximum OTP attempts reached. Please request a new OTP.',
    
    // File upload errors
    fileTooLarge: process.env.ERROR_FILE_TOO_LARGE || 'File size too large',
    invalidFileType: process.env.ERROR_INVALID_FILE_TYPE || 'Invalid file type',
    uploadFailed: process.env.ERROR_UPLOAD_FAILED || 'File upload failed',
  },
  
  // Success messages
  success: {
    created: process.env.SUCCESS_CREATED || 'Resource created successfully',
    updated: process.env.SUCCESS_UPDATED || 'Resource updated successfully',
    deleted: process.env.SUCCESS_DELETED || 'Resource deleted successfully',
    login: process.env.SUCCESS_LOGIN || 'Login successful',
    logout: process.env.SUCCESS_LOGOUT || 'Logout successful',
    passwordReset: process.env.SUCCESS_PASSWORD_RESET || 'Password reset successful',
    emailSent: process.env.SUCCESS_EMAIL_SENT || 'Email sent successfully',
    otpSent: process.env.SUCCESS_OTP_SENT || 'OTP sent successfully',
    orderPlaced: process.env.SUCCESS_ORDER_PLACED || 'Order placed successfully',
    paymentProcessed: process.env.SUCCESS_PAYMENT_PROCESSED || 'Payment processed successfully',
    profileUpdated: process.env.SUCCESS_PROFILE_UPDATED || 'Profile updated successfully',
  },
  
  // Info messages
  info: {
    serverStarted: process.env.INFO_SERVER_STARTED || '🚀 Server running on http://localhost:${port}',
    apiDocs: process.env.INFO_API_DOCS || '📚 API Documentation: http://localhost:${port}/api',
    requestLog: process.env.INFO_REQUEST_LOG || '${method} ${url} ${statusCode} - ${delay}ms',
    errorLog: process.env.INFO_ERROR_LOG || 'Error: ${message}',
    databaseConnected: process.env.INFO_DATABASE_CONNECTED || '✅ Database connected successfully',
    cacheCleared: process.env.INFO_CACHE_CLEARED || 'Cache cleared successfully',
  }
}));
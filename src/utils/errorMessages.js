// utils/errorMessages.js
export const ERROR_MESSAGES = {
  REQUIRED_FIELDS: 'All fields are required.',
  INVALID_USERNAME: 'Username must be alphanumeric.',
  INVALID_EMAIL: 'Invalid email format.',
  INVALID_PASSWORD:
    'Password must be minimum 8 characters with uppercase, lowercase, number, and symbol.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  USER_EXISTS: 'Username or email already exists.',
  USER_NOT_FOUND: 'User not found.',
  ACCOUNT_NOT_ACTIVATED: 'Account is not activated.',
  INVALID_CREDENTIALS: 'Invalid credentials.',
  REFRESH_TOKEN_MISSING: 'Refresh token missing.',
  INVALID_REFRESH_TOKEN: 'Invalid refresh token.',
  REFRESH_TOKEN_NOT_RECOGNIZED: 'Refresh token not recognized.',
  NO_REFRESH_TOKEN_FOUND: 'No refresh token found.',
  INVALID_OR_EXPIRED_TOKEN: 'Invalid or expired token.',
  EMAIL_REQUIRED: 'Email is required.',
  USER_WITH_EMAIL_NOT_FOUND: 'User with that email does not exist.',
  PASSWORD_FIELDS_REQUIRED: 'Both password fields are required.',
  LOGGED_OUT_SUCCESSFULLY: 'Logged out successfully.',
  ACCOUNT_ACTIVATED: 'Account activated successfully.',
  REGISTRATION_SUCCESS:
    'Registration successful. Please check your email to activate your account.',
  PASSWORD_RESET_EMAIL_SENT: 'Password reset email sent.',
  PASSWORD_RESET_SUCCESS: 'Password reset successful.',
  SERVER_ERROR: 'Server error.',
};

import CryptoJS from 'crypto-js';

const ENCRYPTION_SECRET = process.env.VITE_ENCRYPTION_SECRET || 'sentinel-ai-default-secret-key-2024';

/**
 * Encrypt sensitive data
 */
export const encryptData = (data: any): string => {
  try {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_SECRET).toString();
  } catch (error) {
    console.error('Encryption failed:', error);
    return '';
  }
};

/**
 * Decrypt sensitive data
 */
export const decryptData = (encryptedData: string): any => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

/**
 * Hash a string (one-way)
 */
export const hashString = (str: string): string => {
  return CryptoJS.SHA256(str).toString();
};

/**
 * Generate a random token
 */
export const generateToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isStrong: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length < 8) feedback.push('Password must be at least 8 characters');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  else feedback.push('Add special characters');

  return {
    isStrong: score >= 5,
    score,
    feedback,
  };
};

/**
 * Sanitize HTML input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

/**
 * Get or create a session token
 */
export const getSessionToken = (): string => {
  let token = sessionStorage.getItem('session_token');
  if (!token) {
    token = generateToken();
    sessionStorage.setItem('session_token', token);
  }
  return token;
};

/**
 * Clear session token
 */
export const clearSessionToken = (): void => {
  sessionStorage.removeItem('session_token');
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (timestamp: string, expirationMinutes: number = 30): boolean => {
  try {
    const tokenTime = parseInt(timestamp);
    const currentTime = Date.now();
    const expirationTime = expirationMinutes * 60 * 1000;
    return currentTime - tokenTime > expirationTime;
  } catch {
    return true;
  }
};

/**
 * Get security headers for API calls
 */
export const getSecurityHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    ...(token && { Authorization: `Bearer ${token}` }),
    'X-Session-Token': getSessionToken(),
  };
};

/**
 * Rate limiting - check if action should be throttled
 */
export const isRateLimited = (
  key: string,
  maxAttempts: number = 5,
  timeWindowMs: number = 60000
): boolean => {
  const storageKey = `rate_limit_${key}`;
  const attempts = JSON.parse(sessionStorage.getItem(storageKey) || '[]') as number[];
  const now = Date.now();

  // Remove old attempts outside the time window
  const recentAttempts = attempts.filter((time) => now - time < timeWindowMs);

  if (recentAttempts.length >= maxAttempts) {
    return true;
  }

  recentAttempts.push(now);
  sessionStorage.setItem(storageKey, JSON.stringify(recentAttempts));
  return false;
};

/**
 * Create CSRF token
 */
export const createCSRFToken = (): string => {
  const token = generateToken(64);
  sessionStorage.setItem('csrf_token', token);
  return token;
};

/**
 * Verify CSRF token
 */
export const verifyCSRFToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrf_token');
  return token === storedToken;
};

/**
 * Clear sensitive data on logout
 */
export const clearSensitiveData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_timestamp');
  sessionStorage.removeItem('session_token');
  sessionStorage.removeItem('csrf_token');
  
  // Clear all rate limit keys
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith('rate_limit_')) {
      sessionStorage.removeItem(key);
    }
  });
};

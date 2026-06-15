import axios, { AxiosInstance, AxiosError } from 'axios';
import { getSecurityHeaders, isRateLimited, isTokenExpired } from './security';

class SecureAPIClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      withCredentials: true,
    });

    // Request interceptor - add security headers
    this.client.interceptors.request.use(
      (config) => {
        const headers = getSecurityHeaders();
        config.headers = { ...config.headers, ...headers };
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle authentication errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  public get<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<T> {
    // Check rate limiting
    if (isRateLimited(`get_${url}`, 100, 60000)) {
      throw new Error('Too many requests. Please try again later.');
    }

    return this.client
      .get<T>(url, { params })
      .then((response) => response.data);
  }

  /**
   * POST request
   */
  public post<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    // Check rate limiting
    if (isRateLimited(`post_${url}`, 50, 60000)) {
      throw new Error('Too many requests. Please try again later.');
    }

    return this.client
      .post<T>(url, data, config)
      .then((response) => response.data);
  }

  /**
   * PUT request
   */
  public put<T>(
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    // Check rate limiting
    if (isRateLimited(`put_${url}`, 50, 60000)) {
      throw new Error('Too many requests. Please try again later.');
    }

    return this.client
      .put<T>(url, data, config)
      .then((response) => response.data);
  }

  /**
   * DELETE request
   */
  public delete<T>(
    url: string,
    config?: any
  ): Promise<T> {
    // Check rate limiting
    if (isRateLimited(`delete_${url}`, 30, 60000)) {
      throw new Error('Too many requests. Please try again later.');
    }

    return this.client
      .delete<T>(url, config)
      .then((response) => response.data);
  }

  /**
   * Check if session token is expired
   */
  public isSessionExpired(): boolean {
    const timestamp = localStorage.getItem('auth_timestamp');
    if (!timestamp) return true;
    return isTokenExpired(timestamp, 30);
  }

  /**
   * Refresh session
   */
  public refreshSession(): void {
    localStorage.setItem('auth_timestamp', Date.now().toString());
  }
}

export const secureAPI = new SecureAPIClient();

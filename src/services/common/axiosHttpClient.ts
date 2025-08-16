import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { secureGetItem, secureRemoveItem } from '../../utils/secureStorage';
import { refreshAccessToken } from '../../utils/auth';

export class AxiosHttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = secureGetItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        
        // Handle common errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // 토큰 갱신 시도
            const newToken = await refreshAccessToken();
            
            if (newToken) {
              // 새로운 토큰으로 원래 요청 재시도
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client.request(originalRequest);
            } else {
              // 토큰 갱신 실패 시 로그인 페이지로 이동
              secureRemoveItem('token');
              secureRemoveItem('refreshToken');
              window.location.href = '/login';
            }
          } catch (refreshError) {
            // 토큰 갱신 중 오류 발생 시 로그인 페이지로 이동
            secureRemoveItem('token');
            secureRemoveItem('refreshToken');
            window.location.href = '/login';
          }
        } else if (error.response?.status === 403) {
          // Forbidden - 토큰 갱신으로도 해결되지 않는 경우
          secureRemoveItem('token');
          secureRemoveItem('refreshToken');
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      }
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<{ data: T }> {
    const response = await this.client.request<T>(config);
    return { data: response.data };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

// Create and export the axiosHttpClient instance
export const axiosHttpClient = new AxiosHttpClient(process.env.REACT_APP_API_URL || 'http://localhost:4000'); 
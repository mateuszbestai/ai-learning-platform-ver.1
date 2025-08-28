export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
  }
  
  export interface ApiError {
    status_code: number;
    detail: string;
    type?: string;
  }
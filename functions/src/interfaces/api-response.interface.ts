export interface ApiResponse<T = null> {
    message: string;
    data: T;
}

export interface ErrorResponse {
    message: string;
    error: Error | null;
}
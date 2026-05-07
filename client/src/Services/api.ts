const BASE_URL = 'http://localhost:5000/api';

export const apiFetch = async <T>(endpoint: string, options: RequestInit = {}, userId?: number | string): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (userId) {
    headers['x-user-id'] = userId.toString();
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'An unexpected error occurred');
  }

  return response.json();
};
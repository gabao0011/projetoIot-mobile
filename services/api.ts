import axios, { AxiosError } from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  console.warn(
    '[api] EXPO_PUBLIC_API_URL não configurada. Defina no arquivo .env'
  );
}

export const api = axios.create({
  baseURL: baseURL ?? '',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

export function normalizeError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<any>;
    if (ax.code === 'ECONNABORTED') {
      return new ApiError('Tempo de conexão esgotado. Tente novamente.');
    }
    if (!ax.response) {
      return new ApiError(
        'Não foi possível conectar ao servidor. Verifique a rede e a URL da API.'
      );
    }
    const status = ax.response.status;
    const data = ax.response.data;
    const msg =
      (data && (data.error || data.message || data.success)) ||
      `Erro HTTP ${status}`;
    return new ApiError(String(msg), status);
  }
  if (err instanceof ApiError) return err;
  return new ApiError('Erro inesperado. Tente novamente.');
}
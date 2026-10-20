import { api, ApiError, normalizeError } from './api';
import {
  Sensor,
  SensorDetailsResponse,
  SensorListResponse,
  SensorUpdateRequest,
  SensorUpdateResponse,
} from '../types/sensor';

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export async function listSensors(): Promise<Sensor[]> {
  try {
    const { data } = await api.get<SensorListResponse>(
      '/api/sensor/status/listar'
    );
    if (!isObject(data) || !Array.isArray((data as any).data)) {
      throw new ApiError('Resposta inválida ao listar sensores.');
    }
    return (data as SensorListResponse).data.filter(
      (s): s is Sensor =>
        isObject(s) && typeof (s as any).codigo === 'string'
    );
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function getSensorByCode(
  codigo: string
): Promise<SensorDetailsResponse> {
  if (!codigo || !codigo.trim()) {
    throw new ApiError('Informe o código do sensor.');
  }
  try {
    const { data } = await api.get<SensorDetailsResponse>(
      `/api/sensor/status/visualizar/${encodeURIComponent(codigo.trim())}`
    );
    if (!isObject(data) || typeof (data as any).status !== 'number') {
      throw new ApiError('Resposta inesperada ao consultar o sensor.');
    }
    return data as SensorDetailsResponse;
  } catch (err) {
    throw normalizeError(err);
  }
}

export interface UpdateResult {
  confirmed: boolean;
  message: string;
}

export async function updateSensorStatus(
  payload: SensorUpdateRequest
): Promise<UpdateResult> {
  try {
    const { data } = await api.put<SensorUpdateResponse>(
      '/api/sensor/status/atualizar',
      payload
    );

    if (!isObject(data)) {
      return {
        confirmed: false,
        message: 'Resposta não reconhecida. Reconsulte o sensor.',
      };
    }

    const d = data as SensorUpdateResponse;

    if (typeof d.error === 'string' && d.error.trim()) {
      return { confirmed: false, message: d.error };
    }

    if (typeof d.status === 'number' && d.status === payload.status) {
      return {
        confirmed: true,
        message: d.message?.trim() || 'Status atualizado com sucesso.',
      };
    }

    return {
      confirmed: false,
      message:
        d.message?.trim() ||
        'Não foi possível confirmar a atualização. Reconsulte o sensor.',
    };
  } catch (err) {
    throw normalizeError(err);
  }
}
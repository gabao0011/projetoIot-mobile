export type SensorStatusValue = 0 | 1;

export interface Sensor {
  codigo: string;
  tipo: string;
  status: number;
}

export interface SensorListResponse {
  success: string;
  data: Sensor[];
}

export interface SensorDetailsResponse {
  success: string;
  status: number;
}

export interface SensorUpdateRequest {
  codigo: string;
  status: SensorStatusValue;
}

export interface SensorUpdateResponse {
  status?: number;
  message?: string;
  error?: string;
}
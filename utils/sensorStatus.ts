import { SensorStatusValue } from '../types/sensor';

export type KnownStatus = 'active' | 'inactive' | 'unknown';

export function classifyStatus(status: unknown): KnownStatus {
  if (status === 1) return 'active';
  if (status === 0) return 'inactive';
  return 'unknown';
}

export function statusLabel(status: unknown): string {
  const c = classifyStatus(status);
  if (c === 'active') return 'Ativo';
  if (c === 'inactive') return 'Inativo';
  return 'Desconhecido';
}

export function toSensorStatusValue(status: unknown): SensorStatusValue | null {
  if (status === 1 || status === 0) return status;
  return null;
}
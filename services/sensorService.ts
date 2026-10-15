import { Sensor } from '../types/sensor';

export interface UpdateResult {
  confirmed: boolean;
  message: string;
}

// ⚠️ MODO DEMONSTRAÇÃO — dados fictícios apenas para visualização.
// Para voltar ao backend real, restaure a versão original.

const MOCK_SENSORS: Sensor[] = [
  { codigo: 'SENSOR001', tipo: 'temperatura', status: 1 },
  { codigo: 'SENSOR002', tipo: 'umidade', status: 0 },
  { codigo: 'SENSOR003', tipo: 'pressao', status: 1 },
  { codigo: 'SENSOR004', tipo: 'luminosidade', status: 0 },
  { codigo: 'SENSOR005', tipo: 'temperatura', status: 1 },
  { codigo: 'SENSOR006', tipo: 'umidade', status: 2 }, // status desconhecido, só pra mostrar o badge cinza
];

export async function listSensors(): Promise<Sensor[]> {
  await new Promise((r) => setTimeout(r, 600)); // simula delay de rede
  return MOCK_SENSORS;
}

export async function getSensorByCode(codigo: string) {
  await new Promise((r) => setTimeout(r, 500));
  const found = MOCK_SENSORS.find(
    (s) => s.codigo.toLowerCase() === codigo.toLowerCase()
  );
  if (!found) {
    throw new Error('sensor não encontrado');
  }
  return { success: 'Registro encontrado com sucesso', status: found.status };
}

export async function updateSensorStatus(payload: {
  codigo: string;
  status: 0 | 1;
}): Promise<UpdateResult> {
  await new Promise((r) => setTimeout(r, 700));
  const idx = MOCK_SENSORS.findIndex((s) => s.codigo === payload.codigo);
  if (idx >= 0) {
    MOCK_SENSORS[idx] = { ...MOCK_SENSORS[idx], status: payload.status };
  }
  return {
    confirmed: true,
    message: `Sensor ${payload.codigo} atualizado para status ${payload.status}.`,
  };
}
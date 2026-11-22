import type { ResourceRecord } from './explorer.models';

const speciesLabels: Record<string, string> = {
  Human: 'Humano',
  Alien: 'Extraterrestre',
  Humanoid: 'Humanoide',
  Animal: 'Animal',
  Disease: 'Enfermedad',
  Mythological: 'Mitológico',
  unknown: 'Desconocida',
};

const statusLabels = {
  Alive: 'Vivo',
  Dead: 'Muerto',
  unknown: 'Desconocido',
};

export interface ExplorerTableRow {
  name: string;
  summary: string;
  record: ResourceRecord;
  status?: string;
  origin?: string;
  code?: string;
  characterCount?: number;
  locationType?: string;
  residentCount?: number;
}

/** Prepara las columnas de la tabla y conserva el registro original para la ficha. */
export function toExplorerRow(record: ResourceRecord): ExplorerTableRow {
  const row = { name: record.name, record };

  if ('species' in record) {
    return {
      ...row,
      summary: speciesLabels[record.species] ?? record.species,
      status: statusLabels[record.status],
      origin: record.origin.name,
    };
  }

  if ('air_date' in record) {
    return {
      ...row,
      summary: record.air_date,
      code: record.episode,
      characterCount: record.characters.length,
    };
  }

  return {
    ...row,
    summary: record.dimension,
    locationType: record.type,
    residentCount: record.residents.length,
  };
}

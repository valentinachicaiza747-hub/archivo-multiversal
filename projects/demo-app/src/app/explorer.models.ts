interface ApiRecord {
  id: number;
  name: string;
  url: string;
  created: string;
}

export interface Character extends ApiRecord {
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
}

export interface Episode extends ApiRecord {
  air_date: string;
  episode: string;
  characters: string[];
}

export interface Location extends ApiRecord {
  type: string;
  dimension: string;
  residents: string[];
}

export type Resource = 'character' | 'episode' | 'location';
export type ResourceRecord = Character | Episode | Location;

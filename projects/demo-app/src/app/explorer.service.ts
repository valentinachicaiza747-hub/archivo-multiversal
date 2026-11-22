import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { finalize, type Subscription } from 'rxjs';
import type { Character, Episode, Location, Resource } from './explorer.models';

type ResourceRecord = Character | Episode | Location;
type CharacterStatus = 'alive' | 'dead' | 'unknown';

export interface ExplorerRow {
  name: string;
  summary: string;
  record: ResourceRecord;
}

interface ResourceResponse {
  results: ResourceRecord[];
}

@Injectable({ providedIn: 'root' })
export class ExplorerService {
  private readonly http = inject(HttpClient);
  private currentRequest?: Subscription;

  private readonly activeResource = signal<Resource>('character');
  private readonly activeStatus = signal<CharacterStatus | null>(null);
  private readonly resourceRows = signal<ExplorerRow[]>([]);
  private readonly requestLoading = signal(false);
  private readonly requestError = signal<string | null>(null);

  readonly resource = this.activeResource.asReadonly();
  readonly status = this.activeStatus.asReadonly();
  readonly rows = this.resourceRows.asReadonly();
  readonly loading = this.requestLoading.asReadonly();
  readonly errorMessage = this.requestError.asReadonly();

loadResource(resource: Resource, status: CharacterStatus | null = null): void {
  this.currentRequest?.unsubscribe();

  const filter = resource === 'character' ? status : null;
  this.activeResource.set(resource);
  this.activeStatus.set(filter);
  this.resourceRows.set([]);
  this.requestError.set(null);
  this.requestLoading.set(true);

  this.currentRequest = this.http
    .get<ResourceResponse>(`https://rickandmortyapi.com/api/${resource}`, {
      params: filter ? { status: filter } : {},
    })
    .pipe(finalize(() => this.requestLoading.set(false)))
    .subscribe({
      next: ({ results }) => {
        this.resourceRows.set(results.map((record) => this.toRow(record)));
      },
      error: (error: unknown) => {
        if (filter && error instanceof HttpErrorResponse && error.status === 404) {
          return;
        }
        this.requestError.set('No pudimos cargar los datos de este recurso.');
      },
    });
}
    removeRow(row: ExplorerRow): void {
    this.resourceRows.update((rows) => rows.filter((item) => item !== row));
  }
private toRow(record: ResourceRecord): ExplorerRow {
    let summary: string;

    if ('species' in record) {
      const speciesInSpanish: Record<string, string> = {
  Human: 'Humano',
  Alien: 'Extraterrestre',
  Humanoid: 'Humanoide',
  Animal: 'Animal',
  Disease: 'Enfermedad',
  Mythological: 'Mitológico',
  Robot: 'Robot',
  Cronenberg: 'Cronenberg',
  Poopybutthole: 'Poopybutthole',
  unknown: 'Desconocida',
};

summary = speciesInSpanish[record.species] ?? record.species;
    } else if ('air_date' in record) {
      summary = record.air_date;
    } else {
      summary = record.dimension;
    }

    return { name: record.name, summary, record };
  }
}
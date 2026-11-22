import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { finalize, type Subscription } from 'rxjs';
import type { Resource, ResourceRecord } from './explorer.models';

type CharacterStatus = 'alive' | 'dead' | 'unknown';

interface ResourceResponse {
  results: ResourceRecord[];
}

@Injectable({ providedIn: 'root' })
export class ExplorerService {
  private readonly http = inject(HttpClient);
  private currentRequest?: Subscription;

  private readonly activeResource = signal<Resource>('character');
  private readonly activeStatus = signal<CharacterStatus | null>(null);
  private readonly resourceRecords = signal<ResourceRecord[]>([]);
  private readonly requestLoading = signal(false);
  private readonly requestError = signal<string | null>(null);

  readonly resource = this.activeResource.asReadonly();
  readonly status = this.activeStatus.asReadonly();
  readonly records = this.resourceRecords.asReadonly();
  readonly loading = this.requestLoading.asReadonly();
  readonly errorMessage = this.requestError.asReadonly();

  /** Carga el recurso y aplica el filtro de estado a personajes. */
  loadResource(resource: Resource, status: CharacterStatus | null = null): void {
    this.currentRequest?.unsubscribe();

    const filter = resource === 'character' ? status : null;
    this.activeResource.set(resource);
    this.activeStatus.set(filter);
    this.resourceRecords.set([]);
    this.requestError.set(null);
    this.requestLoading.set(true);

    this.currentRequest = this.http
      .get<ResourceResponse>(`https://rickandmortyapi.com/api/${resource}`, {
        params: filter ? { status: filter } : {},
      })
      .pipe(finalize(() => this.requestLoading.set(false)))
      .subscribe({
        next: ({ results }) => this.resourceRecords.set(results),
        error: (error: unknown) => {
          if (filter && error instanceof HttpErrorResponse && error.status === 404) {
            return;
          }
          this.requestError.set('No pudimos cargar los datos de este recurso.');
        },
      });
  }

  /** Retira un registro de los resultados actuales. */
  removeRecord(record: ResourceRecord): void {
    this.resourceRecords.update((records) => records.filter((item) => item !== record));
  }
}

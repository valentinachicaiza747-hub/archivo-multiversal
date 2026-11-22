import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Button, Card, Select, Table, type TableAction, type TableColumn } from 'ui-lib';
import { ExplorerService, type ExplorerRow } from './explorer.service';
import type { Resource } from './explorer.models';

const columnsByResource: Record<Resource, TableColumn<ExplorerRow>[]> = {
  character: [
    { key: 'name', header: 'Nombre' },
    { key: 'summary', header: 'Especie' },
  ],
  episode: [
    { key: 'name', header: 'Episodio' },
    { key: 'summary', header: 'Fecha de emisión' },
  ],
  location: [
    { key: 'name', header: 'Ubicación' },
    { key: 'summary', header: 'Dimensión' },
  ],
};

@Component({
  selector: 'ui-root',
  imports: [Button, Card, Select, Table],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly explorer = inject(ExplorerService);
  protected readonly columns = computed(() => columnsByResource[this.explorer.resource()]);

  protected readonly lastTableAction = signal<TableAction<ExplorerRow> | null>(null);
    protected readonly detailFields = computed(() => {
    const record = this.lastTableAction()?.row.record;
    if (!record) return [];

    const labels: Record<string, string> = {
      id: 'ID',
      status: 'Estado',
      species: 'Especie',
      type: 'Tipo',
      gender: 'Género',
      origin: 'Origen',
      location: 'Ubicación',
      episode: 'Episodio',
      air_date: 'Fecha de emisión',
      characters: 'Personajes',
      dimension: 'Dimensión',
      residents: 'Residentes',
    };
    const translations: Record<string, string> = {
      Alive: 'Vivo',
      Dead: 'Muerto',
      unknown: 'Desconocido',
      Unknown: 'Desconocido',
      Human: 'Humano',
      Alien: 'Extraterrestre',
      Humanoid: 'Humanoide',
      Robot: 'Robot',
      Male: 'Masculino',
      Female: 'Femenino',
      Genderless: 'Sin género',
    };
    const entries: [string, unknown][] = Object.entries(record);

    return entries
      .filter(([name]) => name !== 'url' && name !== 'created')
      .map(([name, value]) => {
        if (Array.isArray(value)) {
          return {
            name,
            label: name === 'episode' ? 'Episodios' : labels[name] ?? name,
            text: String(value.length),
          };
        }

        if (value && typeof value === 'object' && 'name' in value && typeof value.name === 'string') {
          return { name, label: labels[name] ?? name, text: value.name };
        }

                const text = String(value ?? '—');
        const translate = name === 'status' || name === 'species' || name === 'gender';

        return {
          name,
          label: labels[name] ?? name,
          text: translate ? (translations[text] ?? text) : text,
        };
      });
  });

    protected readonly episodeLinks = computed(() => {
    const record = this.lastTableAction()?.row.record;
    if (!record || !('species' in record)) return [];

    return record.episode.map((url) => ({
      url,
      number: url.split('/').pop(),
    }));
  });
protected readonly rawDetail = computed(() =>
    JSON.stringify(this.lastTableAction()?.row.record ?? {}, null, 2),
  );
  protected readonly resourceOptions = [
    { label: 'Personajes', value: 'character' },
    { label: 'Episodios', value: 'episode' },
    { label: 'Ubicaciones', value: 'location' },
  ];

  protected readonly statusOptions = [
    { label: 'Vivo', value: 'alive' },
    { label: 'Muerto', value: 'dead' },
    { label: 'Desconocido', value: 'unknown' },
  ];

  constructor() {
    this.explorer.loadResource('character');
  }

  protected changeResource(value: string): void {
    if (value === 'character' || value === 'episode' || value === 'location') {
      this.lastTableAction.set(null);
      this.explorer.loadResource(value);
    }
  }

  protected changeStatus(value: string | null): void {
    if (this.explorer.resource() !== 'character') return;

    if (value === null || value === 'alive' || value === 'dead' || value === 'unknown') {
      this.lastTableAction.set(null);
      this.explorer.loadResource('character', value);
    }
  }

  protected openDetail(action: TableAction<ExplorerRow>, dialog: HTMLDialogElement): void {
    this.lastTableAction.set(action);
    dialog.showModal();
  }
}
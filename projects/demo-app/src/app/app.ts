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

    const entries: [string, unknown][] = Object.entries(record);

    return entries.map(([name, value]) => ({
      name,
      text: typeof value === 'object'
        ? JSON.stringify(value, null, 2)
        : String(value ?? '—'),
    }));
  });
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
 
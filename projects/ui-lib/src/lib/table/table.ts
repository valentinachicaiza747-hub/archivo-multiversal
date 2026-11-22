import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button } from '../button/button';

export interface TableColumn<T extends object> {
  key: Extract<keyof T, string>;
  header: string;
}

export interface TableAction<T extends object> {
  action: 'view' | 'delete';
  row: T;
}

@Component({
  selector: 'ui-table',
  imports: [Button],
  templateUrl: './table.html',
  styleUrl: './table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T extends object> {
  /** Columnas que la tabla debe mostrar. */
  readonly columns = input.required<TableColumn<T>[]>();

  /** Filas de datos que recibe la tabla. */
  readonly rows = input.required<T[]>();

  /** Mensaje que se muestra cuando no hay filas. */
  readonly emptyMessage = input('No hay resultados.');

  /** Mensaje que se muestra cuando falla la consulta. */
  readonly errorMessage = input<string | null>(null);

  /** Indica que la tabla está esperando los datos. */
  readonly loading = input(false);

  /** Envía la acción elegida y la fila correspondiente. */
  readonly actionTriggered = output<TableAction<T>>();

  protected readonly skeletonRows = [1, 2, 3];
}
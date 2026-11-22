import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'ui-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {
  /** Opciones que aparecerán en la lista. */
  readonly options = input<SelectOption[]>([]);

  /** Etiqueta que aparece encima del selector. */
  readonly label = input.required<string>();

  /** Texto que aparece cuando aún no hay una opción elegida. */
  readonly placeholder = input('Selecciona una opción');
  /** Permite regresar a la opción sin valor. */
  readonly allowClear = input(true);
  /** Bloquea el selector cuando no está disponible. */
  readonly disabled = input(false);

  /** Indica que las opciones se están cargando. */
  readonly loading = input(false);
  /** Valor seleccionado. Empieza sin selección. */
  readonly value = model<string | null>(null);
  /** Avisa qué opción se eligió, con su texto y su valor. */
  readonly selectionChange = output<SelectOption>();

  protected onSelectionChange(select: HTMLSelectElement): void {
    const option = this.options()[select.selectedIndex - 1];
    this.value.set(option?.value ?? null);

    if (option) {
      this.selectionChange.emit(option);
    }
  }
}

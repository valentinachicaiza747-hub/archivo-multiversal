import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  /** Título que se muestra en el encabezado de la tarjeta. */
  readonly title = input.required<string>();
  /** Subtítulo opcional que se muestra debajo del título. */
  readonly subtitle = input<string | null>(null);
  /** Estilo visual de la tarjeta. */
  readonly elevation = input<'flat' | 'raised' | 'outlined'>('flat');

  protected readonly elevationClasses = {
    flat: '',
    raised: 'shadow-lg',
    outlined: 'border border-slate-400',
  };
  /** Avisa cuando se pulsa el encabezado de la tarjeta. */
  readonly headerClicked = output<void>();
}

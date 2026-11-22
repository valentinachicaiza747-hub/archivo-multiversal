import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'ui-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  protected readonly variantClasses = {
    primary: 'bg-emerald-700 text-white hover:bg-emerald-800',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
    danger: 'bg-red-700 text-white hover:bg-red-800',
  };

  protected readonly sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  /** Texto visible del botón. */
  readonly label = input.required<string>();
  /** Estilo visual del botón. */
  readonly variant = input<'primary' | 'secondary' | 'danger'>('primary');

  /** Tamaño del botón. */
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  /** Bloquea el botón cuando no está disponible. */
  readonly disabled = input(false);

  /** Indica que hay una operación en curso. */
  readonly loading = input(false);
  /** Avisa a la app cuando se pulsa el botón habilitado. */
  readonly clicked = output<void>();

  protected onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}

import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;
  let button: HTMLButtonElement;
  let clicked: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('label', 'Guardar');

    clicked = jasmine.createSpy('clicked');
    fixture.componentInstance.clicked.subscribe(clicked);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    button = host.querySelector('button')!;
  });

  it('emite clicked cuando el botón está habilitado', () => {
    button.click();
    expect(clicked).toHaveBeenCalledTimes(1);
  });

  for (const state of ['disabled', 'loading'] as const) {
    it(`bloquea clicked cuando ${state} es true`, () => {
      fixture.componentRef.setInput(state, true);
      fixture.detectChanges();

      expect(button.disabled).toBeTrue();
      button.dispatchEvent(new MouseEvent('click'));
      expect(clicked).not.toHaveBeenCalled();
    });
  }
});

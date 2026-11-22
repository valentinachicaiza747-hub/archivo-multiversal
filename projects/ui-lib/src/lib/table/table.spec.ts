import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Table } from './table';

type TestRow = { name: string };

describe('Table', () => {
  it('muestra el encabezado y el nombre de la fila', async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    const fixture = TestBed.createComponent(Table<TestRow>);
    fixture.componentRef.setInput('columns', [{ key: 'name', header: 'Nombre' }]);
    fixture.componentRef.setInput('rows', [{ name: 'Rick Sanchez' }]);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('th')?.textContent).toContain('Nombre');
    expect(host.querySelector('td')?.textContent).toContain('Rick Sanchez');
  });
});
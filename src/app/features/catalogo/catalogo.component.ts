import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogoComponent {}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BarraCategoriasComponent } from '../../blocks/barra-categorias/barra-categorias';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [RouterOutlet, BarraCategoriasComponent],
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
})
export class PageLayoutComponent {}
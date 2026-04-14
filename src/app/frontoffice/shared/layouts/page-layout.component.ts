import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../components/navbar/navbar.component';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
})
export class PageLayoutComponent {}

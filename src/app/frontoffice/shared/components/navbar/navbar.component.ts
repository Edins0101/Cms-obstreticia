import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArticleCategory } from '../../../core/models/article.model';

interface NavLink {
  label: string;
  category: ArticleCategory | 'todos';
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  activeCategory = signal<string>('todos');

  navLinks: NavLink[] = [
    { label: 'Investigación', category: 'investigacion', route: '/categoria/investigacion' },
    { label: 'Tecnología',    category: 'tecnologia',    route: '/categoria/tecnologia' },
    { label: 'Cultura',       category: 'cultura',       route: '/categoria/cultura' },
    { label: 'Eventos',       category: 'eventos',       route: '/categoria/eventos' },
    { label: 'Proyectos',     category: 'proyectos',     route: '/categoria/proyectos' },
  ];

  setActive(category: string): void {
    this.activeCategory.set(category);
  }
}

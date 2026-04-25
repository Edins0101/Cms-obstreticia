/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ArticleCategory } from '../../../core/models/article.model';
import { FormsModule } from '@angular/forms';

interface NavLink {
  label: string;
  category: ArticleCategory | 'todos';
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  private router = inject(Router);

  activeCategory = signal<string>('todos');
  menuOpen = false;
  searchQuery = signal('');

  navLinks: NavLink[] = [
    { label: 'Investigación', category: 'investigacion', route: '/categoria/investigacion' },
    { label: 'Tecnología', category: 'tecnologia', route: '/categoria/tecnologia' },
    { label: 'Cultura', category: 'cultura', route: '/categoria/cultura' },
    { label: 'Eventos', category: 'eventos', route: '/categoria/eventos' },
    { label: 'Proyectos', category: 'proyectos', route: '/categoria/proyectos' },
  ];
  isDark = false;
  setActive(category: string): void {
    this.activeCategory.set(category);

    if (category === 'todos') {
      this.router.navigate(['/']);
    }
  }

  perfomSearch(): void {
    const query = this.searchQuery().trim();

    if (!query) return;

    this.router.navigate(['/search-results'], {
      queryParams: { q: query },
    });
    this.searchQuery.set('');

    this.menuOpen = false;
    this.closeMenu();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  ngOnInit(): void {
  this.applySystemTheme();

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      this.applySystemTheme();
    });
}

applySystemTheme(): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  document.body.classList.toggle('dark-theme', prefersDark);
  document.body.classList.toggle('light-theme', !prefersDark);
}
}

import { Component, signal, inject, ElementRef, HostListener } from '@angular/core';
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
  private elementRef = inject(ElementRef);

  activeCategory = signal<string>('todos');
  searchQuery = '';
  menuOpen = false;

  navLinks: NavLink[] = [
    { label: 'Investigación', category: 'investigacion', route: '/categoria/investigacion' },
    { label: 'Tecnología', category: 'tecnologia', route: '/categoria/tecnologia' },
    { label: 'Cultura', category: 'cultura', route: '/categoria/cultura' },
    { label: 'Eventos', category: 'eventos', route: '/categoria/eventos' },
    { label: 'Proyectos', category: 'proyectos', route: '/categoria/proyectos' },
  ];

  setActive(category: string): void {
    this.activeCategory.set(category);
    this.menuOpen = false;
    if (category === 'todos') {
      this.router.navigate(['/']);
    }
  }

  perfomSearch(): void {
    const query = this.searchQuery.trim();

    if (!query) return;

    this.router.navigate(['/explorar'], {
      queryParams: { q: query },
    });

    this.menuOpen = false;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.menuOpen = false;
    }
  }
}

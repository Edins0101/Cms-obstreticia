import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { CmsService } from '../../core/services/cms.service';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-explore-all',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent, RouterLink, FormsModule],
  templateUrl: './explore-all.html',
  styleUrl: './explore-all.scss'
})
export class ExploreAllComponent {
  private cmsService = inject(CmsService);

  allArticles = toSignal(this.cmsService.getArticles(), { initialValue: [] });
  
  selectedCategory = signal('Todos');
  selectedDateFilter = signal('todas');
  searchQuery = signal(''); 

  categories = ['Todos', 'Investigación', 'Tecnología', 'Cultura', 'Eventos', 'Proyectos'];

  displayArticles = computed(() => {
    let filtered = [...this.allArticles()]; 

    // 1. Filtro por Búsqueda
    const query = this.searchQuery().trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(a => a.title.toLowerCase().includes(query));
    }

    // 2. Filtro por Categoría (Súper compatible)
    const cat = this.selectedCategory();
    if (cat !== 'Todos') {
      filtered = filtered.filter(a => {
        // Normalizamos para ignorar tildes y mayúsculas
        const articleCat = a.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const targetCat = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return articleCat === targetCat;
      });
    }

    // 3. Ordenamiento
    const sort = this.selectedDateFilter();
    switch (sort) {
      case 'recientes':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'antiguas':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  });

  setCategory(cat: string) { 
    this.selectedCategory.set(cat); 
  }
  
  setDateFilter(filter: string) { 
    this.selectedDateFilter.set(filter); 
  }
  
  updateSearch(query: string) { 
    this.searchQuery.set(query); 
  }
}
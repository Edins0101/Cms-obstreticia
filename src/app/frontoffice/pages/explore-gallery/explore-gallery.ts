import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { CmsService } from '../../core/services/cms.service'; // Descomentar cuando este el servicio

@Component({
  selector: 'app-explore-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './explore-gallery.html',
  styleUrl: './explore-gallery.scss'
})
export class ExploreGalleryComponent {
  // private cmsService = inject(CmsService); // Listo para usar la API

  searchQuery = signal('');
  selectedSort = signal('todas'); 

  // Simulación de datos de API (Cámbialo por un toSignal(this.cmsService.getCategories()) después)
  allCategories = signal([
    { id: 1, name: 'Ciencias de la Vida', icon: '🧬', createdAt: '2024-01-10', gradient: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)' },
    { id: 2, name: 'Medio Ambiente', icon: '🌱', createdAt: '2024-02-15', gradient: 'linear-gradient(135deg, #edb5b5 0%, #e88e8e 100%)' },
    { id: 3, name: 'Datos y Estadística', icon: '📊', createdAt: '2024-03-01', gradient: 'linear-gradient(135deg, #90bede 0%, #6392b9 100%)' },
    { id: 4, name: 'Tecnología e Innovación', icon: '🚀', createdAt: '2023-12-20', gradient: 'linear-gradient(135deg, #ffd89b 0%, #19033e 100%)' },
    { id: 5, name: 'Historia y Cultura', icon: '🏛️', createdAt: '2024-01-05', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfd9 100%)' },
    { id: 6, name: 'Investigación Médica', icon: '🔬', createdAt: '2024-04-10', gradient: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)' }
  ]);

  filteredCategories = computed(() => {
    let result = [...this.allCategories()];
    const query = this.searchQuery().trim().toLowerCase();
    const sort = this.selectedSort();

    if (query) {
      result = result.filter(cat => cat.name.toLowerCase().includes(query));
    }

    switch (sort) {
      case 'az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'recientes':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'antiguas':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        break;
    }

    return result;
  });

  updateSearch(val: string) { this.searchQuery.set(val); }
  updateSort(val: string) { this.selectedSort.set(val); }
}
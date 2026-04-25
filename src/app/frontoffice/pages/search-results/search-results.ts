import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Article } from '../../core/models/article.model';
import { CmsService } from '../../core/services/cms.service';
import { ArticleCardComponent } from '../../shared/components/article-card/article-card.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterLink, ArticleCardComponent],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss',
})
export class SearchResultsComponent {
  private route = inject(ActivatedRoute);
  private cmsService = inject(CmsService);

  searchQuery = signal('');
  articles = signal<Article[]>([]);

  constructor() {
    this.cmsService.getArticles().subscribe((articles) => {
      this.articles.set(articles);
    });

    this.route.queryParams.subscribe((params) => {
      this.searchQuery.set(params['q'] || '');
    });
  }

  filteredArticles = computed(() => {
  const query = this.searchQuery().trim().toLowerCase();
  const sort = this.selectedSort();

  let result = [...this.articles()];

  if (query) {
    result = result.filter((article) => {
      const searchText = `
        ${article.title}
        ${article.category}
        ${article.excerpt || ''}
        ${(article.authors || []).join(' ')}
        ${(article.tags || []).join(' ')}
        ${article.views || ''}
      `.toLowerCase();

      return searchText.includes(query);
    });
  }

    switch (sort) {
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'views':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'readingTime':
        result.sort((a, b) => a.readingTime - b.readingTime);
        break;
    }
    return result;
  });
  
  selectedSort = signal('original');

  updateSearch(value: string): void {
    this.searchQuery.set(value);
  }

  updateSort(value: string): void {
    this.selectedSort.set(value);
  }
}
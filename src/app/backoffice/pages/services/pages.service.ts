import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Page, PageFormData } from '../models/page.model';
import { PageBlock } from '../../../frontoffice/core/models/block.model';
import { environment } from '../../../../environments/environment';
import { tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PagesService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private _pages = signal<Page[]>([]);
  readonly pages = this._pages.asReadonly();

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
  this.http
    .get<any>(`${this.api}/Articles/admin`, {
      params: { page: 1, pageSize: 100 }
    })
    .subscribe(response => {
      const articles = Array.isArray(response) ? response : (response.items ?? []);
      this._pages.set(articles.map((a: any) => this.mapArticleToPage(a)));
    });
}

  getById(id: string) {
    return computed(() => this._pages().find(p => p.id === id) ?? null);
  }

  create(data: PageFormData): Page {
    const body = {
      title: data.title,
      slug: data.slug,
      contentHtml: '<p></p>',
      excerpt: data.description ?? '',
      emoji: '📄',
      readingTime: 1,
      featured: false,
      categoryIds: []
    };

    this.http.post<any>(`${this.api}/Articles/admin`, body).subscribe(article => {
      this._pages.update(pages => [this.mapArticleToPage(article), ...pages]);
    });

    // Retorna temporal mientras se guarda
    const temp: Page = {
      id: Date.now().toString(),
      ...data,
      blocks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return temp;
  }

  update(id: string, data: Partial<PageFormData>): void {
    const current = this._pages().find(p => p.id === id);
    if (!current) return;

    const body = {
      title: data.title ?? current.title,
      slug: data.slug ?? current.slug,
      contentHtml: current.blocks.find(b => b.type === 'text')?.data?.['html'] ?? '<p></p>',
      excerpt: data.description ?? current.description ?? '',
      emoji: '📄',
      readingTime: 1,
      featured: false,
      categoryIds: []
    };

    this.http.put(`${this.api}/Articles/admin/${id}`, body).subscribe(() => {
      this._pages.update(pages =>
        pages.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date() } : p)
      );

      // Cambiar estado si es necesario
      if (data.status) {
        const statusId = data.status === 'published' ? 2 : 1;
        this.http.patch(`${this.api}/Articles/admin/${id}/status`, { statusId }).subscribe();
      }
    });
  }

  updateBlocks(id: string, blocks: PageBlock[]): void {
    const current = this._pages().find(p => p.id === id);
    if (!current) return;

    const textBlock = blocks.find(b => b.type === 'text');
    const contentHtml = textBlock?.data?.['html'] ?? '<p></p>';

    const body = {
      title: current.title,
      slug: current.slug,
      contentHtml,
      excerpt: current.description ?? '',
      emoji: '📄',
      readingTime: 1,
      featured: false,
      categoryIds: []
    };

    this.http.put(`${this.api}/Articles/admin/${id}`, body).subscribe(() => {
      this._pages.update(pages =>
        pages.map(p => p.id === id ? { ...p, blocks, updatedAt: new Date() } : p)
      );
    });
  }

  delete(id: string): void {
    this.http.delete(`${this.api}/Articles/admin/${id}`).subscribe(() => {
      this._pages.update(pages => pages.filter(p => p.id !== id));
    });
  }

  slugify(title: string): string {
    return (
      '/' +
      title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
    );
  }

  private mapArticleToPage(article: any): Page {
  const parseDate = (val: any) => val ? new Date(val) : new Date();

  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    status: article.statusName === 'Published' ? 'published' :
            article.statusName === 'Draft' ? 'draft' : 'archived',
    description: article.excerpt ?? '',
    blocks: article.contentHtml ? [
      {
        id: 'text-1',
        type: 'text' as const,
        visible: true,
        order: 1,
        data: { title: article.title, html: article.contentHtml, align: 'left' }
      }
    ] : [],
    createdAt: parseDate(article.createdAt),
    updatedAt: parseDate(article.updatedAt ?? article.createdAt)
  };
}
}

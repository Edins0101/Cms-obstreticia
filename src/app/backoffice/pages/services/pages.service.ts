import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Page, PageFormData } from '../models/page.model';
import { PageBlock } from '../../../frontoffice/core/models/block.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PagesService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;
  private _categories = signal<any[]>([]);

  private _pages = signal<Page[]>([]);
  readonly pages = this._pages.asReadonly();

  constructor() {
  this.http.get<any[]>(`${this.api}/Categories`).subscribe(cats => {
    this._categories.set(cats);
    this.loadAll(); // cargar páginas DESPUÉS de tener categorías
  });
}

  private loadAll(): void {
    this.http
      .get<any>(`${this.api}/Articles/admin`, { params: { page: 1, pageSize: 100 } })
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
      categoryIds: [] as number[]
    };

    this.http.post<any>(`${this.api}/Articles/admin`, body).subscribe(article => {
      this._pages.update(pages => [this.mapArticleToPage(article), ...pages]);
    });

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
      contentHtml: this.blocksToHtml(current.blocks),
      excerpt: data.description ?? current.description ?? '',
      emoji: '📄',
      readingTime: 1,
      featured: current.featured ?? false,          // ← usar valor actual
      categoryIds: current.categoryId ? [current.categoryId] : [] as number[]
    };

    this.http.put(`${this.api}/Articles/admin/${id}`, body).subscribe(() => {
      this._pages.update(pages =>
        pages.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date() } : p)
      );
      if (data.status) {
        const statusId = data.status === 'published' ? 2 : 1;
        this.http.patch(`${this.api}/Articles/admin/${id}/status`, { statusId }).subscribe();
      }
    });
  }

  updateBlocks(id: string, blocks: PageBlock[]): void {
  const current = this._pages().find(p => p.id === id);
  if (!current) return;

  const contentHtml = this.blocksToHtml(blocks);
  const blocksJson = JSON.stringify(blocks);

  const body = {
    title: current.title,
    slug: current.slug,
    contentHtml,
    blocksJson,
    excerpt: current.description ?? '',
    emoji: '📄',
    readingTime: 1,
    featured: current.featured ?? false,
    categoryIds: current.categoryId ? [current.categoryId] : [] as number[]
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

  blocksToHtml(blocks: any[]): string {
    return blocks
      .filter((b: any) => b.visible)
      .sort((a: any, b: any) => a.order - b.order)
      .map((b: any) => {
        const data = b.data;
        switch (b.type) {
          case 'text':
            return data.html ?? '';
          case 'video':
            const videoId = data.url?.match(
              /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/
            )?.[1];
            if (!videoId) return '';
            return `<div class="video-embed" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin:1rem 0">
              <iframe src="https://www.youtube.com/embed/${videoId}"
                style="position:absolute;top:0;left:0;width:100%;height:100%"
                frameborder="0" allowfullscreen></iframe>
            </div>`;
          case 'image':
            return `<figure style="margin:1rem 0">
              <img src="${data.src}" alt="${data.alt ?? ''}" style="max-width:100%;border-radius:8px" />
              ${data.caption ? `<figcaption>${data.caption}</figcaption>` : ''}
            </figure>`;
          case 'hero':
            return `<div style="position:relative;padding:4rem 2rem;border-radius:8px;margin-bottom:1rem;overflow:hidden;min-height:200px">
              ${data.backgroundImage ? `
                <img src="${data.backgroundImage}"
                  style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:0"
                  alt="hero background" />
                <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);z-index:1"></div>
              ` : ''}
              <div style="position:relative;z-index:2">
                <h1 style="color:white;text-shadow:0 2px 4px rgba(0,0,0,0.5)">${data.title ?? ''}</h1>
                ${data.subtitle ? `<p style="color:white;text-shadow:0 1px 3px rgba(0,0,0,0.5)">${data.subtitle}</p>` : ''}
              </div>
            </div>`;
          case 'cards-grid':
            return `<h2>${data.title ?? ''}</h2>
              <div style="display:grid;grid-template-columns:repeat(${data.columns ?? 3},1fr);gap:1rem;margin:1rem 0">
                ${(data.cards ?? []).map((c: any) => `
                  <div style="padding:1rem;border:1px solid #eee;border-radius:8px">
                    <strong>${c.title}</strong>
                    <p>${c.description}</p>
                  </div>`).join('')}
              </div>`;
          case 'cta':
            return `<div style="padding:2rem;text-align:center;background:#f0f4f8;border-radius:8px;margin:1rem 0">
              <h2>${data.title}</h2>
              ${data.description ? `<p>${data.description}</p>` : ''}
              <a href="${data.primaryRoute}" style="display:inline-block;padding:0.75rem 1.5rem;background:#1e5fa8;color:white;border-radius:6px;text-decoration:none">
                ${data.primaryLabel}
              </a>
            </div>`;
          default:
            return '';
        }
      })
      .join('\n');
  }

  private mapArticleToPage(article: any): Page {
  const parseDate = (val: any) => val ? new Date(val) : new Date();

  let blocks: PageBlock[] = [];

  if (article.blocksJson) {
    try {
      blocks = JSON.parse(article.blocksJson) as PageBlock[];
    } catch {
      blocks = [];
    }
  } else if (article.contentHtml) {
    blocks = [{
      id: 'text-1',
      type: 'text' as const,
      visible: true,
      order: 1,
      data: { title: article.title, html: article.contentHtml, align: 'left' }
    }];
  }
  // Resolver categoryId buscando por slug
  const matchedCat = this._categories().find(c => c.slug === article.category);
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    status: article.statusName === 'Published' ? 'published' :
            article.statusName === 'Draft' ? 'draft' : 'archived',
    description: article.excerpt ?? '',
     categoryId: matchedCat?.categoryId ?? null,
    featured: article.featured ?? false,  // ← agregar
    blocks,
    createdAt: parseDate(article.createdAt),
    updatedAt: parseDate(article.updatedAt ?? article.createdAt)
  };
}
}

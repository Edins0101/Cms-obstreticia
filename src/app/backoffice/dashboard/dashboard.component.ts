import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { environment } from '../../../environments/environment';
import { forkJoin } from 'rxjs';

export interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface RecentActivity {
  user: string;
  action: string;
  target: string;
  time: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  today = new Date();
  loading = signal(true);

  stats = signal<StatCard[]>([
    { label: 'Páginas publicadas',  value: '..', change: 'Cargando...', changeType: 'neutral', icon: 'pages',   color: 'blue'   },
    { label: 'Catálogos activos',   value: '..', change: 'Cargando...', changeType: 'neutral', icon: 'catalog', color: 'teal'   },
    { label: 'Artículos en borrador', value: '..', change: 'Cargando...', changeType: 'neutral', icon: 'users', color: 'purple' },
    { label: 'Total artículos',     value: '..', change: 'Cargando...', changeType: 'neutral', icon: 'media',   color: 'orange' },
  ]);

  recentActivity = signal<RecentActivity[]>([]);

  ngOnInit(): void {
    forkJoin({
  articles: this.http.get<any>(
    `${this.api}/Articles/admin`, { params: { page: 1, pageSize: 100 } }
  ),
  categories: this.http.get<any[]>(`${this.api}/Categories/admin`)
}).subscribe({
  next: ({ articles, categories }) => {
    const allArticles = Array.isArray(articles) ? articles : (articles.items ?? []);
    const published = allArticles.filter((a: any) => a.statusName === 'Published');
    const drafts = allArticles.filter((a: any) => a.statusName === 'Draft');
    const activeCategories = categories.filter(c => c.isPublicVisible);

        this.stats.set([
          {
            label: 'Páginas publicadas',
            value: published.length.toString(),
            change: `${allArticles.length} en total`,
            changeType: 'up',
            icon: 'pages',
            color: 'blue'
          },
          {
            label: 'Catálogos activos',
            value: activeCategories.length.toString(),
            change: `${categories.length} en total`,
            changeType: 'up',
            icon: 'catalog',
            color: 'teal'
          },
          {
            label: 'Artículos en borrador',
            value: drafts.length.toString(),
            change: 'Pendientes de publicar',
            changeType: drafts.length > 0 ? 'neutral' : 'up',
            icon: 'users',
            color: 'purple'
          },
          {
            label: 'Total artículos',
            value: allArticles.length.toString(),
            change: `${published.length} publicados`,
            changeType: 'up',
            icon: 'media',
            color: 'orange'
          },
        ]);

        // Actividad reciente basada en artículos
        this.recentActivity.set(
          published.slice(0, 5).map((a: any) => ({
            user: a.authorUsername ?? 'Admin',
            action: 'publicó el artículo',
            target: a.title,
            time: this.timeAgo(a.publishedAt ?? a.createdAt)
          }))
        );

        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    return `Hace ${Math.floor(diff / 86400)} días`;
  }
}

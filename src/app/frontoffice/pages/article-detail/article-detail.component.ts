import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CmsService } from '../../core/services/cms.service';
import { Article } from '../../core/models/article.model';
import { CategoryBadgeComponent } from '../../shared/components/category-badge/category-badge.component';
import { ReadingTimePipe } from '../../core/pipes/reading-time.pipe';
import { StatusBadgeComponent } from '../../../backoffice/shared/components/status-badge/status-badge';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner';
import { ArticleCardComponent } from "../../shared/components/article-card/article-card.component";

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CategoryBadgeComponent,
    ReadingTimePipe,
    StatusBadgeComponent,
    LoadingSpinnerComponent,
    ArticleCardComponent
],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
})
export class ArticleDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cms = inject(CmsService);
  article = signal<Article | undefined>(undefined);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.cms.getArticleById(id).subscribe((article) => {
      this.article.set(article);
      this.loading.set(false);
    });
  }

  allArticles = signal<Article[]>([]);
  // Por ahora getArticles() devuelve datos quemados.
// Cuando exista backend, solo se reemplaza la lógica interna del servicio.
  constructor() {
    this.cms.getArticles().subscribe((articles) => {
      this.allArticles.set(articles);
    });
  }

  relatedArticles = computed(() => {
  const current = this.article();

  if (!current) return [];

    return this.allArticles()
      .filter((item) => item.id !== current.id)
      .filter((item) => {
        const sameCategory = item.category === current.category;

        const hasCommonTag = (item.tags || []).some((tag) =>
          (current.tags || []).includes(tag)
        );

        return sameCategory || hasCommonTag;
      })
    .slice(0, 3);
  });
}

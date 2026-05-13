import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Block, HeroBlockData, CardsGridBlockData, GalleryBlockData, VideoBlockData } from '../../core/models/block.model';
import { HeroBlockComponent } from '../hero-block/hero-block.component';
import { CardsGridComponent } from '../cards-grid/cards-grid.component';
import { GalleryGridComponent } from '../gallery-grid/gallery-grid.component';

@Component({
  selector: 'app-block-renderer',
  standalone: true,
  imports: [
    CommonModule,
    HeroBlockComponent,
    CardsGridComponent,
    GalleryGridComponent,
  ],
  templateUrl: './block-renderer.component.html',
})
export class BlockRendererComponent implements OnChanges {
  @Input() block!: Block;

  private sanitizer = inject(DomSanitizer);

  heroData!: HeroBlockData;
  cardsData!: CardsGridBlockData;
  galleryData!: GalleryBlockData;
  videoUrl: SafeResourceUrl | null = null;
  videoTitle = '';

  ngOnChanges(): void {
    if (this.block.type === 'hero')         this.heroData    = this.block.data as HeroBlockData;
    if (this.block.type === 'cards-grid')   this.cardsData   = this.block.data as CardsGridBlockData;
    if (this.block.type === 'gallery-grid') this.galleryData = this.block.data as GalleryBlockData;
    if (this.block.type === 'video') {
      const data = this.block.data as VideoBlockData;
      this.videoUrl   = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.toEmbedUrl(data.url ?? '')
      );
      this.videoTitle = data.title ?? '';
    }
  }

  private toEmbedUrl(url: string): string {
    if (!url) return '';
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
    return url;
  }
}

import { Article } from './article.model';

export type BlockType = 'hero' | 'cards-grid' | 'gallery-grid' | 'text' | 'image' | 'cta';

export interface Block {
  id: string;
  type: BlockType;
  data: HeroBlockData | CardsGridBlockData | GalleryBlockData | TextBlockData | ImageBlockData | CtaBlockData;
}

export interface HeroBlockData {
  article: Article;
  tag?: string;
}

export interface CardsGridBlockData {
  title: string;
  articles: Article[];
}

export interface GalleryBlockData {
  title: string;
  items: GalleryItem[];
}

export interface GalleryItem {
  id: string;
  label: string;
  emoji: string;
  color: 'green' | 'pink' | 'blue' | 'amber';
}

export interface TextBlockData {
  content: string;
}

export interface ImageBlockData {
  src: string;
  alt: string;
  caption?: string;
}

export interface CtaBlockData {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

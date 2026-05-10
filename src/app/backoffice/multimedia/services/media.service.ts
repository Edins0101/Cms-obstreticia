import { Injectable, signal, computed } from '@angular/core';
import { MediaItem, CreateMediaItemDto, MediaFilters, MediaType } from '../models/media.model';

const STORAGE_KEY = 'backoffice_multimedia';

@Injectable({ providedIn: 'root' })
export class MediaService {

  private readonly _items   = signal<MediaItem[]>(this._load());
  private readonly _filters = signal<MediaFilters>({
    search:  '',
    type:    'all',
    sortBy:  'date',
    sortDir: 'desc',
    viewMode: 'grid',
  });

  readonly filters      = this._filters.asReadonly();
  readonly selectedItem = signal<MediaItem | null>(null);
  readonly totalItems   = computed(() => this._items().length);
  readonly filteredItems = computed(() => {
    const { search, type, sortBy, sortDir } = this._filters();
    let result = [...this._items()];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        i => i.name.toLowerCase().includes(q) ||
             i.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (type !== 'all') {
      result = result.filter(i => i.type === type);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
      if (sortBy === 'size') cmp = a.size - b.size;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  });

  // CRUD

  add(dto: CreateMediaItemDto): MediaItem {
    const item: MediaItem = {
      ...dto,
      id:        crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._items.update(list => [item, ...list]);
    this._save();
    return item;
  }

  update(id: string, patch: Partial<Pick<MediaItem, 'name' | 'tags'>>): void {
    this._items.update(list =>
      list.map(i => i.id === id ? { ...i, ...patch, updatedAt: new Date() } : i)
    );
    this._save();
    if (this.selectedItem()?.id === id) {
      this.selectedItem.update(i => i ? { ...i, ...patch, updatedAt: new Date() } : i);
    }
  }

  delete(id: string): void {
    this._items.update(list => list.filter(i => i.id !== id));
    this._save();
    if (this.selectedItem()?.id === id) this.selectedItem.set(null);
  }

  // Filtros

  setFilter<K extends keyof MediaFilters>(key: K, value: MediaFilters[K]): void {
    this._filters.update(f => ({ ...f, [key]: value }));
  }

  resetFilters(): void {
    this._filters.update(f => ({ ...f, search: '', type: 'all' }));
  }

  // ── File helpers ─────────────────────────────

  async fileToDto(file: File): Promise<CreateMediaItemDto> {
    const url  = await this._toBase64(file);
    const type = this._inferType(file.type);
    const dims = type === 'image' ? await this._imageDimensions(url) : {};
    return { name: file.name, type, mimeType: file.type, size: file.size, url, tags: [], ...dims };
  }

  // ── Privados ─────────────────────────────────

  private _inferType(mime: string): MediaType {
    if (mime.startsWith('image/svg')) return 'svg';
    if (mime.startsWith('image/'))   return 'image';
    if (mime.startsWith('video/'))   return 'video';
    return 'unknown';
  }

  private _toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private _imageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload  = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = src;
    });
  }

  private _load(): MediaItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: MediaItem[] = JSON.parse(raw);
      return parsed.map(i => ({
        ...i,
        createdAt: new Date(i.createdAt),
        updatedAt: new Date(i.updatedAt),
      }));
    } catch {
      return [];
    }
  }

  private _save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
  }
}
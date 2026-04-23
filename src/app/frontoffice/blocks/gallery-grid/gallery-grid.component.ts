import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryBlockData } from '../../core/models/block.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gallery-grid',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './gallery-grid.component.html',
  styleUrls: ['./gallery-grid.component.scss'],
})
export class GalleryGridComponent {
  @Input() data!: GalleryBlockData;
}

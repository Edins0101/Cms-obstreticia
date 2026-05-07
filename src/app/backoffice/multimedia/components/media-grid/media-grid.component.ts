import { Component, inject } from '@angular/core';
import { MediaService } from '../../services/media.service';
import { MediaCardComponent } from '../media-card/media-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-media-grid',
  standalone: true,
  imports: [RouterLink,MediaCardComponent],
  templateUrl: './media-grid.component.html',
  styleUrl: './media-grid.component.scss',
})
export class MediaGridComponent {
  protected readonly media = inject(MediaService);

}

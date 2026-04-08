import { AsyncPipe, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { ToursDataService } from '../../core/data-access/tours-data.service';
import { Tour } from '../../core/models/tour.model';

const FALLBACK_IMAGE = '/images/ImagenNull.png';

@Component({
  selector: 'app-detalle-tour',
  templateUrl: './detalle-tour.component.html',
  styleUrl: './detalle-tour.component.css',
  imports: [AsyncPipe, CurrencyPipe, NgOptimizedImage, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleTourComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly toursDataService = inject(ToursDataService);

  readonly fallbackImage = FALLBACK_IMAGE;

  readonly tourView$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => (Number.isFinite(id) ? this.toursDataService.getTourWithDetailById(id) : of(undefined))),
    map((result) => {
      if (!result) {
        return undefined;
      }

      return {
        tour: result.tour,
        detail: result.detail,
        galleryImages: this.buildGalleryImages(result.tour.imagenes),
        resenas: result.tour.totalResenas ?? this.getReviewsCount(result.tour)
      };
    })
  );

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;

    if (!target) {
      return;
    }

    if (target.src.includes(this.fallbackImage)) {
      return;
    }

    target.src = this.fallbackImage;
  }

  private buildGalleryImages(imagenes: string[]): string[] {
    const rutasValidas = imagenes
      .map((imagen) => imagen.trim())
      .filter((imagen) => imagen.length > 0);

    if (rutasValidas.length === 0) {
      return [
        this.fallbackImage,
        this.fallbackImage,
        this.fallbackImage,
        this.fallbackImage
      ];
    }

    return [
      rutasValidas[0] ?? this.fallbackImage,
      rutasValidas[1] ?? rutasValidas[0] ?? this.fallbackImage,
      rutasValidas[2] ?? rutasValidas[0] ?? this.fallbackImage,
      rutasValidas[3] ?? rutasValidas[0] ?? this.fallbackImage
    ];
  }

  private getReviewsCount(tour: Tour): number {
    return Math.max(32, Math.round(tour.puntuacion * 37 + tour.id * 14));
  }
}

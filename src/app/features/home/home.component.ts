import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ToursDataService } from '../../core/data-access/tours-data.service';
import { Tour } from '../../core/models/tour.model';

interface VerticalItem {
  titulo: string;
  descripcion: string;
  icono: string;
}

interface FeaturedTour {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private readonly toursDataService = inject(ToursDataService);

  readonly fallbackImage = '/images/ImagenNull.png';

  readonly verticales: VerticalItem[] = [
    {
      titulo: 'Educativo',
      descripcion: 'Programas culturales con aprendizaje en terreno y experiencias guiadas.',
      icono: 'ED'
    },
    {
      titulo: 'Tech',
      descripcion: 'Rutas de innovacion, hubs digitales y visitas a ecosistemas tecnologicos.',
      icono: 'TX'
    },
    {
      titulo: 'Turismo',
      descripcion: 'Exploraciones inmersivas para descubrir destinos emblematicos y ocultos.',
      icono: 'TR'
    },
    {
      titulo: 'Comercial',
      descripcion: 'Viajes orientados a networking, ferias y oportunidades de expansion.',
      icono: 'CM'
    }
  ];

  readonly featuredTours = toSignal(
    this.toursDataService.getTours().pipe(
      map((tours) => tours.slice(0, 3).map((tour) => this.toFeaturedTour(tour)))
    ),
    { initialValue: [] as FeaturedTour[] }
  );

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement | null;

    if (!target || target.src.includes(this.fallbackImage)) {
      return;
    }

    target.src = this.fallbackImage;
  }

  private toFeaturedTour(tour: Tour): FeaturedTour {
    return {
      id: tour.id,
      nombre: tour.nombre,
      descripcion: this.buildIntro(tour.descripcion),
      imagen: this.getFirstImage(tour.imagenes)
    };
  }

  private getFirstImage(imagenes: string[]): string {
    const primeraValida = imagenes
      .map((imagen) => imagen.trim())
      .find((imagen) => imagen.length > 0);

    return primeraValida ?? this.fallbackImage;
  }

  private buildIntro(descripcion: string): string {
    const maxLength = 88;

    if (descripcion.length <= maxLength) {
      return descripcion;
    }

    return `${descripcion.slice(0, maxLength).trimEnd()}...`;
  }
}

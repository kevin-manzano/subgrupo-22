import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ToursDataService } from '../../core/data-access/tours-data.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
  imports: [CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogoComponent {
  private readonly toursDataService = inject(ToursDataService);
  private readonly fallbackImage = '/images/ImagenNull.png';
  readonly starIndexes = [1, 2, 3, 4, 5] as const;

  readonly tours = toSignal(this.toursDataService.getTours(), { initialValue: [] as Tour[] });

  readonly precioMaximoCatalogo = computed(() => {
    const precios = this.tours().map((tour) => tour.precio);
    return precios.length > 0 ? Math.max(...precios) : 0;
  });

  readonly precioMaxFiltro = signal(1500);
  readonly continenteFiltro = signal('todos');
  readonly duracionFiltro = signal('todas');

  readonly continentesDisponibles = computed(() => {
    const continentes = this.tours().map((tour) => tour.continente);
    return [...new Set(continentes)].sort((a, b) => a.localeCompare(b));
  });

  readonly toursFiltrados = computed(() =>
    this.tours().filter((tour) => {
      const cumplePrecio = tour.precio <= this.precioMaxFiltro();
      const cumpleContinente =
        this.continenteFiltro() === 'todos' || tour.continente === this.continenteFiltro();
      const cumpleDuracion = this.coincideConDuracion(tour.duracion, this.duracionFiltro());

      return cumplePrecio && cumpleContinente && cumpleDuracion;
    })
  );

  onPrecioInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const valor = input ? Number(input.value) : NaN;
    if (Number.isFinite(valor)) {
      this.precioMaxFiltro.set(valor);
    }
  }

  onContinenteChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (select) {
      this.continenteFiltro.set(select.value);
    }
  }

  onDuracionChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (select) {
      this.duracionFiltro.set(select.value);
    }
  }

  getImagenPrincipal(tour: Tour): string {
    const primeraImagen = tour.imagenes[0];
    return primeraImagen && primeraImagen.trim().length > 0 ? primeraImagen : this.fallbackImage;
  }

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement | null;
    if (image) {
      image.src = this.fallbackImage;
    }
  }

  getPuntuacionRedondeada(puntuacion: number): number {
    return Math.round(puntuacion);
  }

  private coincideConDuracion(duracionTour: string, filtro: string): boolean {
    if (filtro === 'todas') {
      return true;
    }

    const dias = this.extraerDias(duracionTour);
    if (!Number.isFinite(dias)) {
      return false;
    }

    if (filtro === '1-2') {
      return dias >= 1 && dias <= 2;
    }

    if (filtro === '3-5') {
      return dias >= 3 && dias <= 5;
    }

    return dias >= 6;
  }

  private extraerDias(textoDuracion: string): number {
    const coincidencia = textoDuracion.match(/\d+/);
    return coincidencia ? Number(coincidencia[0]) : NaN;
  }
}

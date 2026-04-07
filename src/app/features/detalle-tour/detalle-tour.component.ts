import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { ToursDataService } from '../../core/data-access/tours-data.service';

@Component({
  selector: 'app-detalle-tour',
  templateUrl: './detalle-tour.component.html',
  styleUrl: './detalle-tour.component.css',
  imports: [AsyncPipe, CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleTourComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly toursDataService = inject(ToursDataService);

  readonly tour$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => (Number.isFinite(id) ? this.toursDataService.getTourById(id) : of(undefined)))
  );
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map, Observable, of, switchMap } from 'rxjs';
import { Tour, TourDetail, TourWithDetail } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class ToursDataService {
  private readonly http = inject(HttpClient);
  private readonly toursPath = '/data/tours.json';
  private readonly detailsPath = '/data/tour-details.json';
  private readonly toursFavoritasCacheSubject = new BehaviorSubject<Map<number, boolean>>(new Map());

  readonly toursFavoritasCache$ = this.toursFavoritasCacheSubject.asObservable();

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(this.toursPath);
  }

  getTourDetails(): Observable<TourDetail[]> {
    return this.http.get<TourDetail[]>(this.detailsPath);
  }

  getTourById(id: number): Observable<Tour | undefined> {
    return this.getTours().pipe(
      map((tours) => tours.find((tour) => tour.id === id))
    );
  }

  getTourDetailByTourId(tourId: number): Observable<TourDetail | undefined> {
    return this.getTourDetails().pipe(
      map((details) => details.find((detail) => detail.tourId === tourId))
    );
  }

  getTourWithDetailById(id: number): Observable<TourWithDetail | undefined> {
    return this.getTourById(id).pipe(
      switchMap((tour) => {
        if (!tour) {
          return of(undefined);
        }

        return this.getTourDetailByTourId(tour.id).pipe(
          map((detail) => {
            if (!detail) {
              return undefined;
            }

            return { tour, detail };
          })
        );
      })
    );
  }

  toggleFavorito(tourId: number, nuevoEstado: boolean): void {
    const cache = this.toursFavoritasCacheSubject.value;
    cache.set(tourId, nuevoEstado);
    this.toursFavoritasCacheSubject.next(new Map(cache));
  }

  isFavorito(tourId: number): boolean {
    return this.toursFavoritasCacheSubject.value.get(tourId) ?? false;
  }
}

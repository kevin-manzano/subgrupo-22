import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Tour } from '../models/tour.model';

@Injectable({
  providedIn: 'root'
})
export class ToursDataService {
  private readonly http = inject(HttpClient);
  private readonly basePath = '/data/tours.json';

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(this.basePath);
  }

  getTourById(id: number): Observable<Tour | undefined> {
    return this.getTours().pipe(
      map((tours) => tours.find((tour) => tour.id === id))
    );
  }
}

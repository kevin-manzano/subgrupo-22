import { RenderMode, ServerRoute } from '@angular/ssr';
import toursData from '../../public/data/tours.json';
import { Tour } from './core/models/tour.model';

const tours = toursData as Tour[];

export const serverRoutes: ServerRoute[] = [
  {
    path: 'tour/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return tours.map((tour) => ({ id: String(tour.id) }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];

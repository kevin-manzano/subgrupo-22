import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./features/home/home.component').then((m) => m.HomeComponent)
	},
	{
		path: 'catalogo',
		loadComponent: () =>
			import('./features/catalogo/catalogo.component').then((m) => m.CatalogoComponent)
	},
	{
		path: 'tour/:id',
		loadComponent: () =>
			import('./features/detalle-tour/detalle-tour.component').then((m) => m.DetalleTourComponent)
	},
	{
		path: 'contacto',
		loadComponent: () =>
			import('./features/contacto/contacto.component').then((m) => m.ContactoComponent)
	},
	{
		path: '**',
		redirectTo: ''
	}
];

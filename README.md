# Aplicacion de Turismo - Estructura Base

Proyecto Angular con arquitectura base limpia y escalable para una aplicacion de turismo.

## Tecnologias

- Angular 21
- TypeScript estricto
- Router con carga perezosa por vista
- HttpClient para acceso a datos mock

## Estructura del proyecto

```text
src/
	app/
		core/
			data-access/
				tours-data.service.ts
			models/
				tour.model.ts
		shared/
			components/
				navbar/
				footer/
		features/
			home/
			catalogo/
			detalle-tour/
			contacto/
public/
	data/
		tours.json
```

## Vistas principales

- Home
- Catalogo
- Detalle de tour
- Contacto

Cada vista contiene solo su titulo para mantener la base simple y lista para escalar.

## Componentes compartidos

- Navbar
- Footer

Ambos componentes estan montados en el layout global y aparecen en todas las vistas.

## Capa de datos mock

El mock de tours se encuentra en `public/data/tours.json`.

La capa de acceso a datos esta en:

- `src/app/core/models/tour.model.ts`
- `src/app/core/data-access/tours-data.service.ts`

`ToursDataService` centraliza la lectura del JSON para que las vistas no accedan al archivo directamente.

## Como levantar el proyecto

```bash
npm install
npm start
```

App local:

`http://localhost:4200/`

## Ejemplo: llamado de datos en una vista

Ejemplo para `catalogo.component.ts` usando signals:

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToursDataService } from '../../core/data-access/tours-data.service';

@Component({
	selector: 'app-catalogo',
	template: `
		<section>
			<h1>Catalogo</h1>

			@for (tour of tours(); track tour.id) {
				<p>{{ tour.nombre }} - {{ tour.destino }}</p>
			}
		</section>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogoComponent {
	private readonly toursService = inject(ToursDataService);
	readonly tours = toSignal(this.toursService.getTours(), { initialValue: [] });
}
```

## Notas

- Esta base no incluye logica de negocio compleja.
- No incluye estilos personalizados, solo estructura.
- La capa `core` esta preparada para crecer con mas servicios y modelos.

export interface Tour {
  id: number;
  nombre: string;
  descripcion: string;
  pais: string;
  continente: string;
  destino: string;
  duracion: string;
  precio: number;
  puntuacion: number;
  totalResenas?: number;
  esFavorito: boolean;
  imagenes: string[];
  categorias?: string[];
  imagenRuta?: string;
}

export interface ItinerarioItem {
  dias: string;
  titulo: string;
  descripcion: string;
}

export interface Testimonio {
  texto: string;
  nombre: string;
  profesion: string;
  iniciales: string;
}

export interface TourDetail {
  tourId: number;
  itinerario: ItinerarioItem[];
  detallesTecnicos: string[];
  testimonios: Testimonio[];
}

export interface TourWithDetail {
  tour: Tour;
  detail: TourDetail;
}

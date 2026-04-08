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
  esFavorito: boolean;
  imagenes: string[];
}

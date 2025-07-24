import { Injectable, signal } from '@angular/core';
import { Movie } from '../interface/movie.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private movies = signal<Movie[]>([
    {
      id: 1,
      title: 'El Padrino',
      plot: 'La historia épica de una familia de la mafia italiana en Nueva York, centrada en la transformación de Michael Corleone de héroe de guerra a despiadado jefe de la mafia.',
      genre: 'Drama/Crimen',
      year: 1972,
      director: 'Francis Ford Coppola',
      poster: '/images/el-padrino.jpg', // Imagen local
      rating: 9.2,
      duration: 175,
      releaseDate: '1972-03-24'
    },
    {
      id: 2,
      title: 'Forrest Gump',
      plot: 'Las presidencias de Kennedy y Johnson, Vietnam, Watergate y otros eventos históricos se desarrollan desde la perspectiva de un hombre de Alabama con un coeficiente intelectual de 75.',
      genre: 'Drama/Romance',
      year: 1994,
      director: 'Robert Zemeckis',
      poster: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
      rating: 8.8,
      duration: 142,
      releaseDate: '1994-07-06'
    },
    {
      id: 3,
      title: 'Inception',
      plot: 'Un ladrón que roba secretos corporativos a través del uso de tecnología de intercambio de sueños recibe la tarea inversa de plantar una idea en la mente de un CEO.',
      genre: 'Ciencia Ficción/Acción',
      year: 2010,
      director: 'Christopher Nolan',
      poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      rating: 8.7,
      duration: 148,
      releaseDate: '2010-07-16'
    },
    {
      id: 4,
      title: 'Pulp Fiction',
      plot: 'Las vidas de dos sicarios, un boxeador, la esposa de un gángster y un par de bandidos se entrelazan en cuatro historias de violencia y redención.',
      genre: 'Crimen/Drama',
      year: 1994,
      director: 'Quentin Tarantino',
      poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      rating: 8.9,
      duration: 154,
      releaseDate: '1994-10-14'
    },
    {
      id: 5,
      title: 'El Señor de los Anillos: El Retorno del Rey',
      plot: 'Gandalf y Aragorn lideran el Mundo de los Hombres contra el ejército de Sauron para alejar su atención de Frodo y Sam cuando se acercan al Monte del Destino con el Anillo Único.',
      genre: 'Fantasía/Aventura',
      year: 2003,
      director: 'Peter Jackson',
      poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
      rating: 9.0,
      duration: 201,
      releaseDate: '2003-12-17'
    },
    {
      id: 6,
      title: 'Interstellar',
      plot: 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento de asegurar la supervivencia de la humanidad.',
      genre: 'Ciencia Ficción/Drama',
      year: 2014,
      director: 'Christopher Nolan',
      poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      rating: 8.6,
      duration: 169,
      releaseDate: '2014-11-07'
    }
  ]);

  getAllMovies() {
    return this.movies();
  }

  getMovieById(id: number) {
    return this.movies().find(movie => movie.id === id);
  }

  getMoviesByGenre(genre: string) {
    return this.movies().filter(movie => 
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  searchMovies(searchTerm: string) {
    return this.movies().filter(movie => 
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  getTopRatedMovies() {
    return this.movies().filter(movie => movie.rating >= 8.5);
  }

  getRecentMovies() {
    return this.movies().filter(movie => movie.year >= 2010);
  }
}

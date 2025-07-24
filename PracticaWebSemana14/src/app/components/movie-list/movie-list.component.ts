import { Component, computed, signal, inject } from '@angular/core';
import { MovieComponent } from '../movie/movie.components';
import { MovieService } from '../../Servicios/movie.service';
import { Movie } from '../../interface/movie.interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [MovieComponent, FormsModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent {
  private movieService = inject(MovieService);
  
  searchTerm = signal('');
  selectedGenre = signal('all');
  selectedFilter = signal('all');

  allMovies = computed(() => this.movieService.getAllMovies());
  
  filteredMovies = computed(() => {
    let movies = this.allMovies();
    
    // Filtrar por término de búsqueda
    if (this.searchTerm()) {
      movies = this.movieService.searchMovies(this.searchTerm());
    }
    
    // Filtrar por género
    if (this.selectedGenre() !== 'all') {
      movies = movies.filter(movie => 
        movie.genre.toLowerCase().includes(this.selectedGenre().toLowerCase())
      );
    }
    
    // Filtrar por otros criterios
    switch (this.selectedFilter()) {
      case 'top-rated':
        movies = movies.filter(movie => movie.rating >= 8.5);
        break;
      case 'recent':
        movies = movies.filter(movie => movie.year >= 2010);
        break;
      case 'classic':
        movies = movies.filter(movie => movie.year < 2000);
        break;
    }
    
    return movies;
  });

  genres = computed(() => {
    const allGenres = this.allMovies().map(movie => movie.genre);
    const uniqueGenres = Array.from(new Set(allGenres));
    return uniqueGenres;
  });

  selectedMovie = signal<Movie | null>(null);

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onGenreChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedGenre.set(target.value);
  }

  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedFilter.set(target.value);
  }

  onViewDetails(movie: Movie) {
    this.selectedMovie.set(movie);
  }

  onAddToWatchlist(movie: Movie) {
    alert(`¡"${movie.title}" ha sido agregada a tu lista de seguimiento!`);
  }

  closeModal() {
    this.selectedMovie.set(null);
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  onImageError(event: any) {
    // Imagen de placeholder en caso de error
    const movieTitle = this.selectedMovie()?.title || 'Movie';
    event.target.src = 'https://via.placeholder.com/300x450/cccccc/666666?text=' + encodeURIComponent(movieTitle);
  }
}

import { Component, input, output } from "@angular/core";
import { Movie } from "../../interface/movie.interface";

@Component({
    selector: 'app-movie',
    imports: [],
    standalone: true,
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.css']
})
export class MovieComponent {
    movie = input.required<Movie>();
    viewDetails = output<Movie>();
    addToWatchlist = output<Movie>();

    formatDuration(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    onViewDetails() {
        this.viewDetails.emit(this.movie());
    }

    onAddToWatchlist() {
        this.addToWatchlist.emit(this.movie());
    }

    onImageError(event: any) {
        // Imagen de placeholder en caso de error
        event.target.src = 'https://via.placeholder.com/300x450/cccccc/666666?text=' + encodeURIComponent(this.movie().title);
    }
}
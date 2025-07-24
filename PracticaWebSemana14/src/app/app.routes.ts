import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { ArtistaComponent } from './components/artista/artista.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { TransaccionComponent } from './components/transaccion/transaccion.component';

export const routes: Routes = [
  { path: '', redirectTo: '/peliculas', pathMatch: 'full' },
  { path: 'peliculas', component: MovieListComponent },
  { path: 'artistas', component: ArtistaComponent },
  { path: 'usuarios', component: UsuarioComponent },
  { path: 'transacciones', component: TransaccionComponent },
  { path: '**', redirectTo: '/peliculas' } // Ruta wildcard para páginas no encontradas
];

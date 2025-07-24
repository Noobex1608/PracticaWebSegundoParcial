import { Injectable, signal } from '@angular/core';
import { Artista } from '../interface/artista.interface';

@Injectable({
  providedIn: 'root'
})
export class ArtistaService {
  private artistas = signal<Artista[]>([
    {
      id: 1,
      nombre: 'Leonardo DiCaprio',
      genero: 'Drama/Acción',
      edad: 49
    },
    {
      id: 2,
      nombre: 'Scarlett Johansson',
      genero: 'Acción/Drama',
      edad: 40
    },
    {
      id: 3,
      nombre: 'Robert Downey Jr.',
      genero: 'Acción/Comedia',
      edad: 59
    },
    {
      id: 4,
      nombre: 'Margot Robbie',
      genero: 'Comedia/Drama',
      edad: 34
    },
    {
      id: 5,
      nombre: 'Tom Hanks',
      genero: 'Drama/Comedia',
      edad: 68
    }
  ]);

  private nextId = signal(6);

  // CREATE - Crear nuevo artista
  createArtista(artista: Omit<Artista, 'id'>): Artista {
    const newArtista: Artista = {
      ...artista,
      id: this.nextId()
    };
    
    this.artistas.update(current => [...current, newArtista]);
    this.nextId.update(id => id + 1);
    
    return newArtista;
  }

  // READ - Obtener todos los artistas
  getAllArtistas(): Artista[] {
    return this.artistas();
  }

  // READ - Obtener artista por ID
  getArtistaById(id: number): Artista | undefined {
    return this.artistas().find(artista => artista.id === id);
  }

  // READ - Buscar artistas por nombre
  searchArtistasByNombre(nombre: string): Artista[] {
    return this.artistas().filter(artista => 
      artista.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  // READ - Filtrar artistas por género
  getArtistasByGenero(genero: string): Artista[] {
    return this.artistas().filter(artista => 
      artista.genero.toLowerCase().includes(genero.toLowerCase())
    );
  }

  // READ - Filtrar artistas por rango de edad
  getArtistasByEdadRange(minEdad: number, maxEdad: number): Artista[] {
    return this.artistas().filter(artista => 
      artista.edad >= minEdad && artista.edad <= maxEdad
    );
  }

  // UPDATE - Actualizar artista
  updateArtista(id: number, artistaData: Partial<Omit<Artista, 'id'>>): Artista | null {
    const artistaIndex = this.artistas().findIndex(artista => artista.id === id);
    
    if (artistaIndex === -1) {
      return null;
    }

    const updatedArtista = {
      ...this.artistas()[artistaIndex],
      ...artistaData
    };

    this.artistas.update(current => 
      current.map(artista => artista.id === id ? updatedArtista : artista)
    );

    return updatedArtista;
  }

  // DELETE - Eliminar artista
  deleteArtista(id: number): boolean {
    const initialLength = this.artistas().length;
    
    this.artistas.update(current => 
      current.filter(artista => artista.id !== id)
    );

    return this.artistas().length < initialLength;
  }

  // UTILITY - Obtener estadísticas
  getArtistasStats() {
    const artistas = this.artistas();
    const totalArtistas = artistas.length;
    const edadPromedio = artistas.reduce((sum, artista) => sum + artista.edad, 0) / totalArtistas;
    
    const generos = artistas.map(artista => artista.genero);
    const generosUnicos = [...new Set(generos)];

    return {
      total: totalArtistas,
      edadPromedio: Math.round(edadPromedio * 100) / 100,
      generosUnicos: generosUnicos,
      edadMayor: Math.max(...artistas.map(a => a.edad)),
      edadMenor: Math.min(...artistas.map(a => a.edad))
    };
  }
}

import { Component, computed, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArtistaService } from '../../Servicios/artista.service';
import { Artista } from '../../interface/artista.interface';

@Component({
  selector: 'app-artista',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './artista.component.html',
  styleUrls: ['./artista.component.css']
})
export class ArtistaComponent {
  private artistaService = inject(ArtistaService);

  // Signals para el estado del componente
  artistas = computed(() => this.artistaService.getAllArtistas());
  editingArtista = signal<Artista | null>(null);
  showForm = signal(false);
  searchTerm = signal('');
  selectedGenero = signal('');

  // Signals para el formulario
  formData = signal({
    nombre: '',
    genero: '',
    edad: 0
  });

  // Computed para artistas filtrados
  filteredArtistas = computed(() => {
    let artistas = this.artistas();
    
    // Filtrar por término de búsqueda
    if (this.searchTerm()) {
      artistas = artistas.filter(artista => 
        artista.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        artista.genero.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }
    
    // Filtrar por género
    if (this.selectedGenero()) {
      artistas = artistas.filter(artista => 
        artista.genero.toLowerCase().includes(this.selectedGenero().toLowerCase())
      );
    }
    
    return artistas;
  });

  // Géneros únicos para el filtro
  generos = computed(() => {
    const allGeneros = this.artistas().map(artista => artista.genero);
    return [...new Set(allGeneros)];
  });

  // Estadísticas
  stats = computed(() => this.artistaService.getArtistasStats());

  // Métodos de formulario
  openCreateForm() {
    this.editingArtista.set(null);
    this.formData.set({
      nombre: '',
      genero: '',
      edad: 0
    });
    this.showForm.set(true);
  }

  openEditForm(artista: Artista) {
    this.editingArtista.set(artista);
    this.formData.set({
      nombre: artista.nombre,
      genero: artista.genero,
      edad: artista.edad
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingArtista.set(null);
    this.resetForm();
  }

  resetForm() {
    this.formData.set({
      nombre: '',
      genero: '',
      edad: 0
    });
  }

  onSubmit() {
    const data = this.formData();
    
    if (!data.nombre.trim() || !data.genero.trim() || data.edad <= 0) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    if (this.editingArtista()) {
      // Actualizar artista existente
      const result = this.artistaService.updateArtista(this.editingArtista()!.id, data);
      if (result) {
        alert('Artista actualizado correctamente');
        this.closeForm();
      } else {
        alert('Error al actualizar el artista');
      }
    } else {
      // Crear nuevo artista
      this.artistaService.createArtista(data);
      alert('Artista creado correctamente');
      this.closeForm();
    }
  }

  deleteArtista(artista: Artista) {
    if (confirm(`¿Está seguro de que desea eliminar al artista "${artista.nombre}"?`)) {
      const success = this.artistaService.deleteArtista(artista.id);
      if (success) {
        alert('Artista eliminado correctamente');
      } else {
        alert('Error al eliminar el artista');
      }
    }
  }

  // Métodos de búsqueda y filtrado
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onGeneroFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedGenero.set(target.value);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedGenero.set('');
  }

  // Métodos de utilidad
  updateFormField(field: keyof ReturnType<typeof this.formData>, value: any) {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
  }
}

import { Component, computed, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../Servicios/usuario.service';
import { usuario } from '../../interface/usuario.interface';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  private usuarioService = inject(UsuarioService);

  // Signals para el estado del componente
  usuarios = computed(() => this.usuarioService.getAllUsuarios());
  editingUsuario = signal<usuario | null>(null);
  showForm = signal(false);
  searchTerm = signal('');

  // Signals para el formulario
  formData = signal({
    nombre: '',
    email: '',
    fechaRegistro: new Date()
  });

  // Computed para usuarios filtrados
  filteredUsuarios = computed(() => {
    let usuarios = this.usuarios();
    
    // Filtrar por término de búsqueda
    if (this.searchTerm()) {
      usuarios = usuarios.filter(usuario => 
        usuario.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }
    
    return usuarios;
  });

  // Estadísticas
  stats = computed(() => this.usuarioService.getUsuariosStats());

  // Método para acceder a Object.keys en el template
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Métodos de formulario
  openCreateForm() {
    this.editingUsuario.set(null);
    this.formData.set({
      nombre: '',
      email: '',
      fechaRegistro: new Date()
    });
    this.showForm.set(true);
  }

  openEditForm(usuario: usuario) {
    this.editingUsuario.set(usuario);
    this.formData.set({
      nombre: usuario.nombre,
      email: usuario.email,
      fechaRegistro: new Date(usuario.fechaRegistro)
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingUsuario.set(null);
    this.resetForm();
  }

  resetForm() {
    this.formData.set({
      nombre: '',
      email: '',
      fechaRegistro: new Date()
    });
  }

  onSubmit() {
    const data = this.formData();
    
    if (!data.nombre.trim() || !data.email.trim()) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      alert('Por favor, ingrese un email válido.');
      return;
    }

    if (this.editingUsuario()) {
      // Verificar que el email no esté en uso por otro usuario
      if (this.usuarioService.emailExists(data.email, this.editingUsuario()!.id)) {
        alert('Este email ya está en uso por otro usuario.');
        return;
      }
      
      // Actualizar usuario existente
      const result = this.usuarioService.updateUsuario(this.editingUsuario()!.id, data);
      if (result) {
        alert('Usuario actualizado correctamente');
        this.closeForm();
      } else {
        alert('Error al actualizar el usuario');
      }
    } else {
      // Verificar que el email no esté en uso
      if (this.usuarioService.emailExists(data.email)) {
        alert('Este email ya está en uso.');
        return;
      }
      
      // Crear nuevo usuario
      this.usuarioService.createUsuario(data);
      alert('Usuario creado correctamente');
      this.closeForm();
    }
  }

  deleteUsuario(usuario: usuario) {
    if (confirm(`¿Está seguro de que desea eliminar al usuario "${usuario.nombre}"?`)) {
      const success = this.usuarioService.deleteUsuario(usuario.id);
      if (success) {
        alert('Usuario eliminado correctamente');
      } else {
        alert('Error al eliminar el usuario');
      }
    }
  }

  // Métodos de búsqueda
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  clearSearch() {
    this.searchTerm.set('');
  }

  // Métodos de utilidad
  updateFormField(field: keyof ReturnType<typeof this.formData>, value: any) {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES');
  }

  getTimeSinceRegistration(date: Date): string {
    const now = new Date();
    const registrationDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - registrationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 día';
    if (diffDays < 30) return `${diffDays} días`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} años`;
  }
}

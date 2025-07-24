import { Component, computed, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransaccionService } from '../../Servicios/transaccion.service';
import { UsuarioService } from '../../Servicios/usuario.service';
import { transaccion } from '../../interface/transaccion.interface';

@Component({
  selector: 'app-transaccion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transaccion.component.html',
  styleUrls: ['./transaccion.component.css']
})
export class TransaccionComponent {
  private transaccionService = inject(TransaccionService);
  private usuarioService = inject(UsuarioService);

  // Signals para el estado del componente
  transacciones = computed(() => this.transaccionService.getAllTransacciones());
  usuarios = computed(() => this.usuarioService.getAllUsuarios());
  editingTransaccion = signal<transaccion | null>(null);
  showForm = signal(false);
  searchTerm = signal('');
  selectedTipo = signal('');
  selectedEstado = signal('');

  // Signals para el formulario
  formData = signal({
    usuarioId: 0,
    tipo: 'compra' as 'compra' | 'venta',
    cantidad: 1,
    fecha: new Date(),
    montoTotal: 0,
    estado: 'pendiente' as 'pendiente' | 'completada' | 'cancelada'
  });

  // Computed para transacciones filtradas
  filteredTransacciones = computed(() => {
    let transacciones = this.transacciones();
    
    // Filtrar por término de búsqueda
    if (this.searchTerm()) {
      const searchLower = this.searchTerm().toLowerCase();
      transacciones = transacciones.filter(transaccion => {
        const usuario = this.usuarios().find(u => u.id === transaccion.usuarioId);
        return usuario?.nombre.toLowerCase().includes(searchLower) ||
               transaccion.id.toString().includes(searchLower) ||
               transaccion.montoTotal.toString().includes(searchLower);
      });
    }
    
    // Filtrar por tipo
    if (this.selectedTipo()) {
      transacciones = transacciones.filter(transaccion => 
        transaccion.tipo === this.selectedTipo()
      );
    }
    
    // Filtrar por estado
    if (this.selectedEstado()) {
      transacciones = transacciones.filter(transaccion => 
        transaccion.estado === this.selectedEstado()
      );
    }
    
    return transacciones.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  });

  // Estadísticas
  stats = computed(() => this.transaccionService.getTransaccionesStats());

  // Métodos de formulario
  openCreateForm() {
    this.editingTransaccion.set(null);
    this.formData.set({
      usuarioId: 0,
      tipo: 'compra',
      cantidad: 1,
      fecha: new Date(),
      montoTotal: 0,
      estado: 'pendiente'
    });
    this.showForm.set(true);
  }

  openEditForm(transaccion: transaccion) {
    this.editingTransaccion.set(transaccion);
    this.formData.set({
      usuarioId: transaccion.usuarioId,
      tipo: transaccion.tipo,
      cantidad: transaccion.cantidad,
      fecha: new Date(transaccion.fecha),
      montoTotal: transaccion.montoTotal,
      estado: transaccion.estado
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingTransaccion.set(null);
    this.resetForm();
  }

  resetForm() {
    this.formData.set({
      usuarioId: 0,
      tipo: 'compra',
      cantidad: 1,
      fecha: new Date(),
      montoTotal: 0,
      estado: 'pendiente'
    });
  }

  onSubmit() {
    const data = this.formData();
    
    if (data.usuarioId === 0 || data.cantidad <= 0 || data.montoTotal <= 0) {
      alert('Por favor, complete todos los campos correctamente.');
      return;
    }

    if (this.editingTransaccion()) {
      // Actualizar transacción existente
      const result = this.transaccionService.updateTransaccion(this.editingTransaccion()!.id, data);
      if (result) {
        alert('Transacción actualizada correctamente');
        this.closeForm();
      } else {
        alert('Error al actualizar la transacción');
      }
    } else {
      // Crear nueva transacción
      this.transaccionService.createTransaccion(data);
      alert('Transacción creada correctamente');
      this.closeForm();
    }
  }

  deleteTransaccion(transaccion: transaccion) {
    const usuario = this.usuarios().find(u => u.id === transaccion.usuarioId);
    const userName = usuario ? usuario.nombre : `Usuario ${transaccion.usuarioId}`;
    
    if (confirm(`¿Está seguro de que desea eliminar la transacción #${transaccion.id} de ${userName}?`)) {
      const success = this.transaccionService.deleteTransaccion(transaccion.id);
      if (success) {
        alert('Transacción eliminada correctamente');
      } else {
        alert('Error al eliminar la transacción');
      }
    }
  }

  // Métodos de búsqueda y filtrado
  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onTipoFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedTipo.set(target.value);
  }

  onEstadoFilter(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedEstado.set(target.value);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.selectedTipo.set('');
    this.selectedEstado.set('');
  }

  // Métodos de utilidad
  updateFormField(field: keyof ReturnType<typeof this.formData>, value: any) {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
  }

  getUserName(usuarioId: number): string {
    const usuario = this.usuarios().find(u => u.id === usuarioId);
    return usuario ? usuario.nombre : `Usuario ${usuarioId}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'completada': return 'estado-completada';
      case 'pendiente': return 'estado-pendiente';
      case 'cancelada': return 'estado-cancelada';
      default: return '';
    }
  }

  getTipoClass(tipo: string): string {
    return tipo === 'compra' ? 'tipo-compra' : 'tipo-venta';
  }

  updateEstado(transaccion: transaccion, nuevoEstado: 'pendiente' | 'completada' | 'cancelada') {
    const result = this.transaccionService.updateEstadoTransaccion(transaccion.id, nuevoEstado);
    if (result) {
      alert(`Estado actualizado a "${nuevoEstado}"`);
    } else {
      alert('Error al actualizar el estado');
    }
  }
}

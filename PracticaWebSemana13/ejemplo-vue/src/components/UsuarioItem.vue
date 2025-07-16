<script setup lang="ts">
import type { Usuario } from '../types/usuario'


interface Props {
  usuario: Usuario
}

const props = defineProps<Props>()


const emit = defineEmits<{
  'editar': [usuario: Usuario]
  'eliminar': [usuarioId: number]
  'toggle-activo': [usuarioId: number]
}>()


const handleEditar = () => {
  emit('editar', props.usuario)
}

const handleEliminar = () => {
  emit('eliminar', props.usuario.id)
}

const handleToggleActivo = () => {
  emit('toggle-activo', props.usuario.id)
}


const formatearFecha = (fecha: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(fecha))
}
</script>

<template>
  <div 
    class="usuario-item"
    :class="{ 'inactivo': !props.usuario.activo }"
  >

    <div class="usuario-content">
      <div class="usuario-avatar">
        {{ props.usuario.nombre.charAt(0).toUpperCase() }}
      </div>
      
      <div class="usuario-info">
        <h3 class="usuario-nombre">{{ props.usuario.nombre }}</h3>
        <p class="usuario-email">{{ props.usuario.email }}</p>
        <p class="usuario-fecha">
          Registro: {{ formatearFecha(props.usuario.fechaRegistro) }}
        </p>
      </div>
      
      <div class="usuario-estado">
        <span 
          class="badge"
          :class="{ 'activo': props.usuario.activo, 'inactivo': !props.usuario.activo }"
        >
          {{ props.usuario.activo ? 'Activo' : 'Inactivo' }}
        </span>
      </div>
    </div>
    

    <div class="usuario-actions">
      <button
        @click="handleToggleActivo"
        class="btn btn-toggle"
        :class="{ 'activar': !props.usuario.activo, 'desactivar': props.usuario.activo }"
        :title="props.usuario.activo ? 'Desactivar usuario' : 'Activar usuario'"
      >
        {{ props.usuario.activo ? '🔒' : '🔓' }}
      </button>
      
      <button
        @click="handleEditar"
        class="btn btn-edit"
        title="Editar usuario"
      >
        ✏️
      </button>
      
      <button
        @click="handleEliminar"
        class="btn btn-delete"
        title="Eliminar usuario"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<style scoped>
.usuario-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background-color: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease-out;
}

.usuario-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.usuario-item.inactivo {
  opacity: 0.6;
  background-color: #f8f9fa;
}

.usuario-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.usuario-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.usuario-info {
  flex: 1;
}

.usuario-nombre {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.usuario-email {
  margin: 0 0 0.25rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.usuario-fecha {
  margin: 0;
  color: #95a5a6;
  font-size: 0.8rem;
}

.usuario-estado {
  margin-right: 1rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.badge.activo {
  background-color: #d4edda;
  color: #155724;
}

.badge.inactivo {
  background-color: #f8d7da;
  color: #721c24;
}

.usuario-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-toggle.activar {
  background-color: #28a745;
  color: white;
}

.btn-toggle.activar:hover {
  background-color: #218838;
  transform: scale(1.1);
}

.btn-toggle.desactivar {
  background-color: #ffc107;
  color: white;
}

.btn-toggle.desactivar:hover {
  background-color: #e0a800;
  transform: scale(1.1);
}

.btn-edit {
  background-color: #17a2b8;
  color: white;
}

.btn-edit:hover {
  background-color: #138496;
  transform: scale(1.1);
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover {
  background-color: #c82333;
  transform: scale(1.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .usuario-item {
    padding: 1rem;
  }
  
  .usuario-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .usuario-avatar {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .usuario-actions {
    align-self: flex-end;
  }
}
</style>

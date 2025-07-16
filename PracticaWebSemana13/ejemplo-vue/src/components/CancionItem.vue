<script setup lang="ts">
import type { Cancion } from '../types/cancion'


interface Props {
  cancion: Cancion
}

const props = defineProps<Props>()


const emit = defineEmits<{
  'editar': [cancion: Cancion]
  'eliminar': [cancionId: number]
  'toggle-disponible': [cancionId: number]
}>()


const handleEditar = () => {
  emit('editar', props.cancion)
}

const handleEliminar = () => {
  emit('eliminar', props.cancion.id)
}

const handleToggleDisponible = () => {
  emit('toggle-disponible', props.cancion.id)
}

const formatearDuracion = (segundos: number) => {
  const mins = Math.floor(segundos / 60)
  const secs = segundos % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}


const formatearAño = (fecha: Date) => {
  return new Date(fecha).getFullYear()
}
</script>

<template>
  <div 
    class="cancion-item"
    :class="{ 'no-disponible': !props.cancion.disponible }"
  >
    <div class="cancion-content">
      <div class="cancion-cover">
        🎵
      </div>
      
      <div class="cancion-info">
        <h3 class="cancion-nombre">{{ props.cancion.nombre }}</h3>
        <p class="cancion-artista">{{ props.cancion.artista }}</p>
        <p class="cancion-album">{{ props.cancion.album }} ({{ formatearAño(props.cancion.fechaLanzamiento) }})</p>
        <div class="cancion-detalles">
          <span class="cancion-duracion">{{ formatearDuracion(props.cancion.duracion) }}</span>
          <span class="cancion-genero">{{ props.cancion.genero }}</span>
        </div>
      </div>
      
      <div class="cancion-estado">
        <span 
          class="badge"
          :class="{ 'disponible': props.cancion.disponible, 'no-disponible': !props.cancion.disponible }"
        >
          {{ props.cancion.disponible ? 'Disponible' : 'No disponible' }}
        </span>
      </div>
    </div>
    
    <div class="cancion-actions">
      <button
        @click="handleToggleDisponible"
        class="btn btn-toggle"
        :class="{ 'hacer-disponible': !props.cancion.disponible, 'hacer-no-disponible': props.cancion.disponible }"
        :title="props.cancion.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'"
      >
        {{ props.cancion.disponible ? '🔒' : '🔓' }}
      </button>
      
      <button
        @click="handleEditar"
        class="btn btn-edit"
        title="Editar canción"
      >
        ✏️
      </button>
      
      <button
        @click="handleEliminar"
        class="btn btn-delete"
        title="Eliminar canción"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<style scoped>
.cancion-item {
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

.cancion-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.cancion-item.no-disponible {
  opacity: 0.6;
  background-color: #f8f9fa;
}

.cancion-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.cancion-cover {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.cancion-info {
  flex: 1;
}

.cancion-nombre {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.cancion-artista {
  margin: 0 0 0.25rem 0;
  color: #7f8c8d;
  font-size: 0.95rem;
  font-weight: 500;
}

.cancion-album {
  margin: 0 0 0.5rem 0;
  color: #95a5a6;
  font-size: 0.85rem;
}

.cancion-detalles {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cancion-duracion {
  color: #34495e;
  font-size: 0.9rem;
  font-weight: 500;
}

.cancion-genero {
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.cancion-estado {
  margin-right: 1rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.badge.disponible {
  background-color: #d4edda;
  color: #155724;
}

.badge.no-disponible {
  background-color: #f8d7da;
  color: #721c24;
}

.cancion-actions {
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

.btn-toggle.hacer-disponible {
  background-color: #28a745;
  color: white;
}

.btn-toggle.hacer-disponible:hover {
  background-color: #218838;
  transform: scale(1.1);
}

.btn-toggle.hacer-no-disponible {
  background-color: #ffc107;
  color: white;
}

.btn-toggle.hacer-no-disponible:hover {
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
  .cancion-item {
    padding: 1rem;
  }
  
  .cancion-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .cancion-cover {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .cancion-detalles {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .cancion-actions {
    align-self: flex-end;
  }
}
</style>

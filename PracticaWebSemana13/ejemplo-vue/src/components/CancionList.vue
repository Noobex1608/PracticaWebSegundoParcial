<script setup lang="ts">
import type { Cancion } from '../types/cancion'
import CancionItem from './CancionItem.vue'


interface Props {
  canciones: Cancion[]
  cargando?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cargando: false
})


const emit = defineEmits<{
  'editar': [cancion: Cancion]
  'eliminar': [cancionId: number]
  'toggle-disponible': [cancionId: number]
}>()


const handleEditar = (cancion: Cancion) => {
  emit('editar', cancion)
}

const handleEliminar = (cancionId: number) => {
  emit('eliminar', cancionId)
}

const handleToggleDisponible = (cancionId: number) => {
  emit('toggle-disponible', cancionId)
}
</script>

<template>
  <div class="cancion-list">
    <div v-if="cargando" class="loading">
      <div class="spinner"></div>
      <p>Cargando canciones...</p>
    </div>
    
    <div v-else-if="canciones.length === 0" class="empty-state">
      <div class="empty-icon">🎵</div>
      <h3>No hay canciones disponibles</h3>
      <p>Haz clic en "Nueva Canción" para agregar la primera canción al catálogo.</p>
    </div>
    
    <div v-else class="canciones-grid">
      <CancionItem
        v-for="cancion in canciones"
        :key="cancion.id"
        :cancion="cancion"
        @editar="handleEditar"
        @eliminar="handleEliminar"
        @toggle-disponible="handleToggleDisponible"
      />
    </div>
  </div>
</template>

<style scoped>
.cancion-list {
  min-height: 400px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6c757d;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #e74c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 1rem;
  color: #495057;
}

.empty-state p {
  font-size: 1.1rem;
  max-width: 400px;
  margin: 0 auto;
}

.canciones-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/**
 * ANIMACIONES DE ENTRADA
 */
.canciones-grid {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/**
 * RESPONSIVE DESIGN
 */
@media (max-width: 768px) {
  .cancion-list {
    min-height: 300px;
  }
  
  .loading,
  .empty-state {
    padding: 2rem;
  }
  
  .empty-icon {
    font-size: 3rem;
  }
}
</style>

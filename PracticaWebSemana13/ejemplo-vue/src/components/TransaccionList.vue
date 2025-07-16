<script setup lang="ts">
import type { Transaccion } from '../types/transaccion'
import TransaccionItem from './TransaccionItem.vue'


interface Props {
  transacciones: Transaccion[]
  cargando?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cargando: false
})


const emit = defineEmits<{
  'editar': [transaccion: Transaccion]
  'eliminar': [transaccionId: number]
  'cambiar-estado': [transaccionId: number, nuevoEstado: Transaccion['estado']]
}>()


const handleEditar = (transaccion: Transaccion) => {
  emit('editar', transaccion)
}

const handleEliminar = (transaccionId: number) => {
  emit('eliminar', transaccionId)
}

const handleCambiarEstado = (transaccionId: number, nuevoEstado: Transaccion['estado']) => {
  emit('cambiar-estado', transaccionId, nuevoEstado)
}
</script>

<template>
  <div class="transaccion-list">

    <div v-if="cargando" class="loading">
      <div class="spinner"></div>
      <p>Cargando transacciones...</p>
    </div>
    

    <div v-else-if="transacciones.length === 0" class="empty-state">
      <div class="empty-icon">💳</div>
      <h3>No hay transacciones registradas</h3>
      <p>Haz clic en "Nueva Transacción" para agregar la primera transacción al sistema.</p>
    </div>
    

    <div v-else class="transacciones-grid">
      <TransaccionItem
        v-for="transaccion in transacciones"
        :key="transaccion.id"
        :transaccion="transaccion"
        @editar="handleEditar"
        @eliminar="handleEliminar"
        @cambiar-estado="handleCambiarEstado"
      />
    </div>
  </div>
</template>

<style scoped>
.transaccion-list {
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
  border-top: 4px solid #27ae60;
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

.transacciones-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/**
 * ANIMACIONES DE ENTRADA
 */
.transacciones-grid {
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
  .transaccion-list {
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

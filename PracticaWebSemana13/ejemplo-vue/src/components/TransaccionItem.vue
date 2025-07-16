<script setup lang="ts">
import type { Transaccion } from '../types/transaccion'

interface Props {
  transaccion: Transaccion
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'editar': [transaccion: Transaccion]
  'eliminar': [transaccionId: number]
  'cambiar-estado': [transaccionId: number, nuevoEstado: Transaccion['estado']]
}>()


const handleEditar = () => {
  emit('editar', props.transaccion)
}

const handleEliminar = () => {
  emit('eliminar', props.transaccion.id)
}

const handleCambiarEstado = (nuevoEstado: Transaccion['estado']) => {
  emit('cambiar-estado', props.transaccion.id, nuevoEstado)
}


const formatearMonto = (monto: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(monto)
}


const formatearFecha = (fecha: Date) => {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(fecha))
}


const obtenerIconoTipo = (tipo: Transaccion['tipo']) => {
  const iconos = {
    'compra': '🛒',
    'venta': '💰',
    'suscripcion': '🔄',
    'reembolso': '↩️'
  }
  return iconos[tipo] || '💳'
}


const obtenerColorEstado = (estado: Transaccion['estado']) => {
  const colores = {
    'completada': '#28a745',
    'pendiente': '#ffc107',
    'fallida': '#dc3545',
    'cancelada': '#6c757d'
  }
  return colores[estado] || '#6c757d'
}
</script>

<template>
  <div 
    class="transaccion-item"
    :class="[`estado-${props.transaccion.estado}`, `tipo-${props.transaccion.tipo}`]"
  >
    <div class="transaccion-content">
      <div class="transaccion-icono">
        {{ obtenerIconoTipo(props.transaccion.tipo) }}
      </div>
      
      <div class="transaccion-info">
        <h3 class="transaccion-descripcion">{{ props.transaccion.descripcion }}</h3>
        <div class="transaccion-detalles">
          <span class="transaccion-monto">{{ formatearMonto(props.transaccion.monto) }}</span>
          <span class="transaccion-tipo">{{ props.transaccion.tipo.charAt(0).toUpperCase() + props.transaccion.tipo.slice(1) }}</span>
        </div>
        <div class="transaccion-meta">
          <span class="transaccion-fecha">{{ formatearFecha(props.transaccion.fechaTransaccion) }}</span>
          <span class="transaccion-metodo">{{ props.transaccion.metodoPago }}</span>
        </div>
      </div>
      
      <div class="transaccion-estado">
        <span 
          class="badge"
          :style="{ backgroundColor: obtenerColorEstado(props.transaccion.estado) }"
        >
          {{ props.transaccion.estado.charAt(0).toUpperCase() + props.transaccion.estado.slice(1) }}
        </span>
        
        <select 
          v-if="props.transaccion.estado !== 'completada'"
          @change="handleCambiarEstado(($event.target as HTMLSelectElement).value as Transaccion['estado'])"
          class="estado-selector"
          title="Cambiar estado"
        >
          <option :value="props.transaccion.estado" selected>Cambiar a...</option>
          <option v-if="props.transaccion.estado !== ('completada' as Transaccion['estado'])" value="completada">Completada</option>
          <option v-if="props.transaccion.estado !== 'pendiente'" value="pendiente">Pendiente</option>
          <option v-if="props.transaccion.estado !== 'fallida'" value="fallida">Fallida</option>
          <option v-if="props.transaccion.estado !== 'cancelada'" value="cancelada">Cancelada</option>
        </select>
      </div>
    </div>
    
    <div class="transaccion-actions">
      <button
        @click="handleEditar"
        class="btn btn-edit"
        title="Editar transacción"
      >
        ✏️
      </button>
      
      <button
        @click="handleEliminar"
        class="btn btn-delete"
        title="Eliminar transacción"
      >
        🗑️
      </button>
    </div>
  </div>
</template>

<style scoped>
.transaccion-item {
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

.transaccion-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.transaccion-item.estado-completada {
  border-left: 4px solid #28a745;
}

.transaccion-item.estado-pendiente {
  border-left: 4px solid #ffc107;
}

.transaccion-item.estado-fallida {
  border-left: 4px solid #dc3545;
}

.transaccion-item.estado-cancelada {
  border-left: 4px solid #6c757d;
  opacity: 0.8;
}

.transaccion-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.transaccion-icono {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.tipo-compra .transaccion-icono {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.tipo-venta .transaccion-icono {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.tipo-suscripcion .transaccion-icono {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.tipo-reembolso .transaccion-icono {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.transaccion-info {
  flex: 1;
}

.transaccion-descripcion {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
}

.transaccion-detalles {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.transaccion-monto {
  font-size: 1.2rem;
  font-weight: 700;
  color: #27ae60;
}

.transaccion-tipo {
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
}

.transaccion-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.transaccion-fecha {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.transaccion-metodo {
  color: #95a5a6;
  font-size: 0.9rem;
}

.transaccion-estado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  color: white;
}

.estado-selector {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 0.8rem;
  background: white;
  cursor: pointer;
}

.transaccion-actions {
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
  .transaccion-item {
    padding: 1rem;
  }
  
  .transaccion-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .transaccion-icono {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .transaccion-detalles {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .transaccion-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .transaccion-estado {
    flex-direction: row;
    align-items: center;
  }
  
  .transaccion-actions {
    align-self: flex-end;
  }
}
</style>

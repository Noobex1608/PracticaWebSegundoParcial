<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Transaccion } from '../types/transaccion'
import TransaccionList from '../components/TransaccionList.vue'
import TransaccionForm from '../components/TransaccionForm.vue'


const transacciones = ref<Transaccion[]>([])
const mostrarFormulario = ref(false)
const transaccionEditando = ref<Transaccion | null>(null)
const filtroTipo = ref('')
const filtroEstado = ref('')

const transaccionesEjemplo: Transaccion[] = [
  {
    id: 1,
    usuarioId: 1,
    monto: 29.99,
    tipo: 'compra',
    descripcion: 'Compra de álbum: Thriller',
    fechaTransaccion: new Date('2024-01-15'),
    estado: 'completada',
    metodoPago: 'Tarjeta de crédito'
  },
  {
    id: 2,
    usuarioId: 2,
    monto: 9.99,
    tipo: 'suscripcion',
    descripcion: 'Suscripción mensual Premium',
    fechaTransaccion: new Date('2024-02-01'),
    estado: 'completada',
    metodoPago: 'PayPal'
  },
  {
    id: 3,
    usuarioId: 1,
    monto: 1.99,
    tipo: 'compra',
    descripcion: 'Compra de canción: Bohemian Rhapsody',
    fechaTransaccion: new Date('2024-02-15'),
    estado: 'pendiente',
    metodoPago: 'Tarjeta de débito'
  },
  {
    id: 4,
    usuarioId: 3,
    monto: 15.50,
    tipo: 'reembolso',
    descripcion: 'Reembolso por cancelación',
    fechaTransaccion: new Date('2024-02-20'),
    estado: 'completada',
    metodoPago: 'Tarjeta de crédito'
  }
]


onMounted(() => {
  cargarTransacciones()
})


const cargarTransacciones = () => {
  transacciones.value = [...transaccionesEjemplo]
}


const agregarTransaccion = (nuevaTransaccion: Omit<Transaccion, 'id'>) => {
  const transaccion: Transaccion = {
    ...nuevaTransaccion,
    id: Date.now(),
    fechaTransaccion: new Date()
  }
  
  transacciones.value.push(transaccion)
  cerrarFormulario()
}


const actualizarTransaccion = (transaccionActualizada: Transaccion) => {
  const index = transacciones.value.findIndex(t => t.id === transaccionActualizada.id)
  if (index !== -1) {
    transacciones.value[index] = transaccionActualizada
  }
  cerrarFormulario()
}

const eliminarTransaccion = (transaccionId: number) => {
  transacciones.value = transacciones.value.filter(t => t.id !== transaccionId)
}


const cambiarEstadoTransaccion = (transaccionId: number, nuevoEstado: Transaccion['estado']) => {
  const transaccion = transacciones.value.find(t => t.id === transaccionId)
  if (transaccion) {
    transaccion.estado = nuevoEstado
  }
}


const abrirFormularioNuevo = () => {
  transaccionEditando.value = null
  mostrarFormulario.value = true
}


const abrirFormularioEditar = (transaccion: Transaccion) => {
  transaccionEditando.value = { ...transaccion }
  mostrarFormulario.value = true
}


const cerrarFormulario = () => {
  mostrarFormulario.value = false
  transaccionEditando.value = null
}


const manejarEnvioFormulario = (transaccion: Transaccion | Omit<Transaccion, 'id'>) => {
  if ('id' in transaccion) {
    actualizarTransaccion(transaccion)
  } else {
    agregarTransaccion(transaccion)
  }
}


const formatearMonto = (monto: number) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(monto)
}

const transaccionesFiltradas = computed(() => {
  let resultado = transacciones.value
  
  if (filtroTipo.value) {
    resultado = resultado.filter(t => t.tipo === filtroTipo.value)
  }
  
  if (filtroEstado.value) {
    resultado = resultado.filter(t => t.estado === filtroEstado.value)
  }
  
  return resultado.sort((a, b) => new Date(b.fechaTransaccion).getTime() - new Date(a.fechaTransaccion).getTime())
})


const estadisticas = computed(() => {
  const total = transacciones.value.length
  const completadas = transacciones.value.filter(t => t.estado === 'completada').length
  const pendientes = transacciones.value.filter(t => t.estado === 'pendiente').length
  const montoTotal = transacciones.value
    .filter(t => t.estado === 'completada')
    .reduce((acc, t) => acc + t.monto, 0)
  
  return {
    total,
    completadas,
    pendientes,
    montoTotal
  }
})


const tiposUnicos = computed(() => {
  const tipos = new Set(transacciones.value.map(t => t.tipo))
  return Array.from(tipos)
})


const estadosUnicos = computed(() => {
  const estados = new Set(transacciones.value.map(t => t.estado))
  return Array.from(estados)
})
</script>

<template>
  <div class="transacciones-view">
    <div class="header">
      <h1>Gestión de Transacciones</h1>
      <button 
        @click="abrirFormularioNuevo"
        class="btn btn-primary"
      >
        💳 Nueva Transacción
      </button>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label>Filtrar por tipo:</label>
        <select v-model="filtroTipo">
          <option value="">Todos los tipos</option>
          <option v-for="tipo in tiposUnicos" :key="tipo" :value="tipo">
            {{ tipo.charAt(0).toUpperCase() + tipo.slice(1) }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Filtrar por estado:</label>
        <select v-model="filtroEstado">
          <option value="">Todos los estados</option>
          <option v-for="estado in estadosUnicos" :key="estado" :value="estado">
            {{ estado.charAt(0).toUpperCase() + estado.slice(1) }}
          </option>
        </select>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>Total Transacciones</h3>
        <p>{{ estadisticas.total }}</p>
      </div>
      <div class="stat-card">
        <h3>Completadas</h3>
        <p>{{ estadisticas.completadas }}</p>
      </div>
      <div class="stat-card">
        <h3>Pendientes</h3>
        <p>{{ estadisticas.pendientes }}</p>
      </div>
      <div class="stat-card">
        <h3>Monto Total</h3>
        <p>{{ formatearMonto(estadisticas.montoTotal) }}</p>
      </div>
    </div>

    <div v-if="mostrarFormulario" class="modal-overlay">
      <div class="modal-content">
        <TransaccionForm
          :transaccion="transaccionEditando"
          @enviar="manejarEnvioFormulario"
          @cancelar="cerrarFormulario"
        />
      </div>
    </div>

    <TransaccionList
      :transacciones="transaccionesFiltradas"
      @eliminar="eliminarTransaccion"
      @editar="abrirFormularioEditar"
      @cambiar-estado="cambiarEstadoTransaccion"
    />
  </div>
</template>

<style scoped>
.transacciones-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #27ae60;
  color: white;
}

.btn-primary:hover {
  background-color: #219a52;
}

.filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: #495057;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #495057;
  font-size: 1rem;
}

.stat-card p {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .transacciones-view {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

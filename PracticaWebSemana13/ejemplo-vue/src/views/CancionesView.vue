<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Cancion } from '../types/cancion'
import CancionList from '../components/CancionList.vue'
import CancionForm from '../components/CancionForm.vue'


const canciones = ref<Cancion[]>([])
const mostrarFormulario = ref(false)
const cancionEditando = ref<Cancion | null>(null)
const filtroGenero = ref('')
const filtroDisponible = ref<boolean | null>(null)

const cancionesEjemplo: Cancion[] = [
  {
    id: 1,
    nombre: 'Bohemian Rhapsody',
    artista: 'Queen',
    album: 'A Night at the Opera',
    duracion: 355,
    genero: 'Rock',
    fechaLanzamiento: new Date('1975-10-31'),
    usuarioId: 1,
    disponible: true
  },
  {
    id: 2,
    nombre: 'Imagine',
    artista: 'John Lennon',
    album: 'Imagine',
    duracion: 183,
    genero: 'Pop',
    fechaLanzamiento: new Date('1971-09-09'),
    usuarioId: 1,
    disponible: true
  },
  {
    id: 3,
    nombre: 'Billie Jean',
    artista: 'Michael Jackson',
    album: 'Thriller',
    duracion: 294,
    genero: 'Pop',
    fechaLanzamiento: new Date('1983-01-02'),
    usuarioId: 2,
    disponible: false
  }
]


onMounted(() => {
  cargarCanciones()
})


const cargarCanciones = () => {
  canciones.value = [...cancionesEjemplo]
}


const agregarCancion = (nuevaCancion: Omit<Cancion, 'id'>) => {
  const cancion: Cancion = {
    ...nuevaCancion,
    id: Date.now()
  }
  
  canciones.value.push(cancion)
  cerrarFormulario()
}


const actualizarCancion = (cancionActualizada: Cancion) => {
  const index = canciones.value.findIndex(c => c.id === cancionActualizada.id)
  if (index !== -1) {
    canciones.value[index] = cancionActualizada
  }
  cerrarFormulario()
}

const eliminarCancion = (cancionId: number) => {
  canciones.value = canciones.value.filter(c => c.id !== cancionId)
}


const toggleCancionDisponible = (cancionId: number) => {
  const cancion = canciones.value.find(c => c.id === cancionId)
  if (cancion) {
    cancion.disponible = !cancion.disponible
  }
}


const abrirFormularioNuevo = () => {
  cancionEditando.value = null
  mostrarFormulario.value = true
}


const abrirFormularioEditar = (cancion: Cancion) => {
  cancionEditando.value = { ...cancion }
  mostrarFormulario.value = true
}


const cerrarFormulario = () => {
  mostrarFormulario.value = false
  cancionEditando.value = null
}


const manejarEnvioFormulario = (cancion: Cancion | Omit<Cancion, 'id'>) => {
  if ('id' in cancion) {
    actualizarCancion(cancion)
  } else {
    agregarCancion(cancion)
  }
}


const formatearDuracion = (segundos: number) => {
  const mins = Math.floor(segundos / 60)
  const secs = segundos % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}


const cancionesFiltradas = computed(() => {
  let resultado = canciones.value
  
  if (filtroGenero.value) {
    resultado = resultado.filter(c => c.genero.toLowerCase().includes(filtroGenero.value.toLowerCase()))
  }
  
  if (filtroDisponible.value !== null) {
    resultado = resultado.filter(c => c.disponible === filtroDisponible.value)
  }
  
  return resultado
})


const generosUnicos = computed(() => {
  const generos = new Set(canciones.value.map(c => c.genero))
  return Array.from(generos)
})
</script>

<template>
  <div class="canciones-view">
    <div class="header">
      <h1>Gestión de Canciones</h1>
      <button 
        @click="abrirFormularioNuevo"
        class="btn btn-primary"
      >
        🎵 Nueva Canción
      </button>
    </div>

    <div class="filters">
      <div class="filter-group">
        <label>Filtrar por género:</label>
        <select v-model="filtroGenero">
          <option value="">Todos los géneros</option>
          <option v-for="genero in generosUnicos" :key="genero" :value="genero">
            {{ genero }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Disponibilidad:</label>
        <select v-model="filtroDisponible">
          <option :value="null">Todas</option>
          <option :value="true">Disponibles</option>
          <option :value="false">No disponibles</option>
        </select>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>Total Canciones</h3>
        <p>{{ canciones.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Disponibles</h3>
        <p>{{ canciones.filter(c => c.disponible).length }}</p>
      </div>
      <div class="stat-card">
        <h3>Géneros</h3>
        <p>{{ generosUnicos.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Duración Total</h3>
        <p>{{ formatearDuracion(canciones.reduce((acc, c) => acc + c.duracion, 0)) }}</p>
      </div>
    </div>

    <div v-if="mostrarFormulario" class="modal-overlay">
      <div class="modal-content">
        <CancionForm
          :cancion="cancionEditando"
          @enviar="manejarEnvioFormulario"
          @cancelar="cerrarFormulario"
        />
      </div>
    </div>

    <!-- LISTA DE CANCIONES -->
    <CancionList
      :canciones="cancionesFiltradas"
      @eliminar="eliminarCancion"
      @editar="abrirFormularioEditar"
      @toggle-disponible="toggleCancionDisponible"
    />
  </div>
</template>

<style scoped>
.canciones-view {
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
  background-color: #e74c3c;
  color: white;
}

.btn-primary:hover {
  background-color: #c0392b;
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
  color: #e74c3c;
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
  .canciones-view {
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

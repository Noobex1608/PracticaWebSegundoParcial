<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Cancion } from '../types/cancion'


interface Props {
  cancion?: Cancion | null
}

const props = defineProps<Props>()


const emit = defineEmits<{
  'enviar': [cancion: Cancion | Omit<Cancion, 'id'>]
  'cancelar': []
}>()


const formulario = reactive({
  nombre: '',
  artista: '',
  album: '',
  duracion: 0,
  genero: '',
  fechaLanzamiento: '',
  usuarioId: 1,
  disponible: true
})

const errores = ref<Record<string, string>>({})
const enviando = ref(false)


const generosDisponibles = [
  'Pop', 'Rock', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 
  'Country', 'Blues', 'Reggae', 'Folk', 'R&B', 'Punk', 'Metal'
]


const inicializarFormulario = () => {
  if (props.cancion) {
    formulario.nombre = props.cancion.nombre
    formulario.artista = props.cancion.artista
    formulario.album = props.cancion.album
    formulario.duracion = props.cancion.duracion
    formulario.genero = props.cancion.genero
    formulario.fechaLanzamiento = new Date(props.cancion.fechaLanzamiento).toISOString().split('T')[0]
    formulario.usuarioId = props.cancion.usuarioId
    formulario.disponible = props.cancion.disponible
  } else {
    formulario.nombre = ''
    formulario.artista = ''
    formulario.album = ''
    formulario.duracion = 0
    formulario.genero = ''
    formulario.fechaLanzamiento = ''
    formulario.usuarioId = 1
    formulario.disponible = true
  }
  errores.value = {}
}

inicializarFormulario()

watch(() => props.cancion, inicializarFormulario, { immediate: true })


const esEdicion = computed(() => !!props.cancion)

const tituloFormulario = computed(() => 
  esEdicion.value ? 'Editar Canción' : 'Nueva Canción'
)

const textoBotonEnviar = computed(() => 
  esEdicion.value ? 'Actualizar' : 'Crear'
)

const duracionFormateada = computed(() => {
  if (formulario.duracion <= 0) return '0:00'
  const mins = Math.floor(formulario.duracion / 60)
  const secs = formulario.duracion % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
})


const validarFormulario = () => {
  errores.value = {}
  
  if (!formulario.nombre.trim()) {
    errores.value.nombre = 'El nombre de la canción es requerido'
  }
  
  if (!formulario.artista.trim()) {
    errores.value.artista = 'El nombre del artista es requerido'
  }
  
  if (!formulario.album.trim()) {
    errores.value.album = 'El nombre del álbum es requerido'
  }
  
  if (formulario.duracion <= 0) {
    errores.value.duracion = 'La duración debe ser mayor a 0 segundos'
  } else if (formulario.duracion > 3600) {
    errores.value.duracion = 'La duración no puede ser mayor a 1 hora'
  }
  
  if (!formulario.genero) {
    errores.value.genero = 'El género es requerido'
  }
  
  if (!formulario.fechaLanzamiento) {
    errores.value.fechaLanzamiento = 'La fecha de lanzamiento es requerida'
  } else {
    const fechaLanzamiento = new Date(formulario.fechaLanzamiento)
    const fechaActual = new Date()
    if (fechaLanzamiento > fechaActual) {
      errores.value.fechaLanzamiento = 'La fecha de lanzamiento no puede ser futura'
    }
  }
  
  return Object.keys(errores.value).length === 0
}


const handleEnviar = async () => {
  if (!validarFormulario()) {
    return
  }
  
  enviando.value = true
  
  try {
    const datosCancion = {
      nombre: formulario.nombre.trim(),
      artista: formulario.artista.trim(),
      album: formulario.album.trim(),
      duracion: formulario.duracion,
      genero: formulario.genero,
      fechaLanzamiento: new Date(formulario.fechaLanzamiento),
      usuarioId: formulario.usuarioId,
      disponible: formulario.disponible
    }
    
    if (esEdicion.value && props.cancion) {
      emit('enviar', {
        ...datosCancion,
        id: props.cancion.id
      })
    } else {
      emit('enviar', datosCancion)
    }
  } finally {
    enviando.value = false
  }
}

const handleCancelar = () => {
  emit('cancelar')
}

const handleReset = () => {
  inicializarFormulario()
}


const convertirTiempoASegundos = (minutos: number, segundos: number) => {
  return (minutos * 60) + segundos
}


const handleTiempoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const [minutos, segundos] = target.value.split(':').map(Number)
  formulario.duracion = convertirTiempoASegundos(minutos || 0, segundos || 0)
}


const formatearDuracionParaInput = () => {
  const mins = Math.floor(formulario.duracion / 60)
  const secs = formulario.duracion % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="cancion-form">
    <div class="form-header">
      <h2>{{ tituloFormulario }}</h2>
    </div>
    
    <form @submit.prevent="handleEnviar" class="form-content">
      <div class="form-group">
        <label for="nombre">Nombre de la canción *</label>
        <input
          id="nombre"
          v-model="formulario.nombre"
          type="text"
          placeholder="Ingresa el nombre de la canción"
          :class="{ 'error': errores.nombre }"
          :disabled="enviando"
          maxlength="100"
        />
        <span v-if="errores.nombre" class="error-message">
          {{ errores.nombre }}
        </span>
      </div>
      
      <div class="form-group">
        <label for="artista">Artista *</label>
        <input
          id="artista"
          v-model="formulario.artista"
          type="text"
          placeholder="Nombre del artista"
          :class="{ 'error': errores.artista }"
          :disabled="enviando"
          maxlength="100"
        />
        <span v-if="errores.artista" class="error-message">
          {{ errores.artista }}
        </span>
      </div>
      
      <div class="form-group">
        <label for="album">Álbum *</label>
        <input
          id="album"
          v-model="formulario.album"
          type="text"
          placeholder="Nombre del álbum"
          :class="{ 'error': errores.album }"
          :disabled="enviando"
          maxlength="100"
        />
        <span v-if="errores.album" class="error-message">
          {{ errores.album }}
        </span>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="duracion">Duración *</label>
          <input
            id="duracion"
            :value="formatearDuracionParaInput()"
            @input="handleTiempoChange"
            type="time"
            step="1"
            :class="{ 'error': errores.duracion }"
            :disabled="enviando"
          />
          <small class="help-text">{{ duracionFormateada }}</small>
          <span v-if="errores.duracion" class="error-message">
            {{ errores.duracion }}
          </span>
        </div>
        
        <div class="form-group">
          <label for="genero">Género *</label>
          <select
            id="genero"
            v-model="formulario.genero"
            :class="{ 'error': errores.genero }"
            :disabled="enviando"
          >
            <option value="">Seleccionar género</option>
            <option v-for="genero in generosDisponibles" :key="genero" :value="genero">
              {{ genero }}
            </option>
          </select>
          <span v-if="errores.genero" class="error-message">
            {{ errores.genero }}
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="fechaLanzamiento">Fecha de lanzamiento *</label>
        <input
          id="fechaLanzamiento"
          v-model="formulario.fechaLanzamiento"
          type="date"
          :class="{ 'error': errores.fechaLanzamiento }"
          :disabled="enviando"
          :max="new Date().toISOString().split('T')[0]"
        />
        <span v-if="errores.fechaLanzamiento" class="error-message">
          {{ errores.fechaLanzamiento }}
        </span>
      </div>
      
      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="formulario.disponible"
            type="checkbox"
            :disabled="enviando"
          />
          <span class="checkbox-text">Canción disponible</span>
        </label>
      </div>
      
      <div class="form-actions">
        <button
          type="button"
          @click="handleCancelar"
          class="btn btn-secondary"
          :disabled="enviando"
        >
          Cancelar
        </button>
        
        <button
          type="button"
          @click="handleReset"
          class="btn btn-outline"
          :disabled="enviando"
        >
          Limpiar
        </button>
        
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="enviando"
        >
          <span v-if="enviando" class="spinner-sm"></span>
          {{ textoBotonEnviar }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.cancion-form {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-header {
  background: #e74c3c;
  color: white;
  padding: 1.5rem;
  text-align: center;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.form-content {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #e74c3c;
  box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
}

.form-group input.error,
.form-group select.error {
  border-color: #e74c3c;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.help-text {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  display: block;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.checkbox-text {
  font-weight: 500;
  color: #2c3e50;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #e74c3c;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #c0392b;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #7f8c8d;
}

.btn-outline {
  background-color: transparent;
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.btn-outline:hover:not(:disabled) {
  background-color: #e74c3c;
  color: white;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .form-content {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

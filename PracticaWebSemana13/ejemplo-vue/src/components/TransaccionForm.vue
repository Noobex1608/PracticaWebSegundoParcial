<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Transaccion } from '../types/transaccion'


interface Props {
  transaccion?: Transaccion | null
}

const props = defineProps<Props>()


const emit = defineEmits<{
  'enviar': [transaccion: Transaccion | Omit<Transaccion, 'id'>]
  'cancelar': []
}>()


const formulario = reactive({
  usuarioId: 1,
  monto: 0,
  tipo: '' as Transaccion['tipo'],
  descripcion: '',
  estado: 'pendiente' as Transaccion['estado'],
  metodoPago: ''
})

const errores = ref<Record<string, string>>({})
const enviando = ref(false)


const tiposTransaccion: Transaccion['tipo'][] = ['compra', 'venta', 'suscripcion', 'reembolso']
const estadosTransaccion: Transaccion['estado'][] = ['pendiente', 'completada', 'fallida', 'cancelada']
const metodosPago = [
  'Tarjeta de crédito',
  'Tarjeta de débito',
  'PayPal',
  'Transferencia bancaria',
  'Efectivo',
  'Criptomoneda'
]


const inicializarFormulario = () => {
  if (props.transaccion) {
    formulario.usuarioId = props.transaccion.usuarioId
    formulario.monto = props.transaccion.monto
    formulario.tipo = props.transaccion.tipo
    formulario.descripcion = props.transaccion.descripcion
    formulario.estado = props.transaccion.estado
    formulario.metodoPago = props.transaccion.metodoPago
  } else {
    formulario.usuarioId = 1
    formulario.monto = 0
    formulario.tipo = '' as Transaccion['tipo']
    formulario.descripcion = ''
    formulario.estado = 'pendiente'
    formulario.metodoPago = ''
  }
  errores.value = {}
}

inicializarFormulario()

watch(() => props.transaccion, inicializarFormulario, { immediate: true })


const esEdicion = computed(() => !!props.transaccion)

const tituloFormulario = computed(() => 
  esEdicion.value ? 'Editar Transacción' : 'Nueva Transacción'
)

const textoBotonEnviar = computed(() => 
  esEdicion.value ? 'Actualizar' : 'Crear'
)

const montoFormateado = computed(() => {
  if (formulario.monto <= 0) return '0,00 €'
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(formulario.monto)
})


const validarFormulario = () => {
  errores.value = {}
  
  if (formulario.monto <= 0) {
    errores.value.monto = 'El monto debe ser mayor a 0'
  } else if (formulario.monto > 1000000) {
    errores.value.monto = 'El monto no puede ser mayor a 1.000.000 €'
  }
  
  if (!formulario.tipo) {
    errores.value.tipo = 'El tipo de transacción es requerido'
  }
  
  if (!formulario.descripcion.trim()) {
    errores.value.descripcion = 'La descripción es requerida'
  } else if (formulario.descripcion.length > 200) {
    errores.value.descripcion = 'La descripción no puede exceder 200 caracteres'
  }
  
  if (!formulario.estado) {
    errores.value.estado = 'El estado es requerido'
  }
  
  if (!formulario.metodoPago) {
    errores.value.metodoPago = 'El método de pago es requerido'
  }
  
  return Object.keys(errores.value).length === 0
}


const handleEnviar = async () => {
  if (!validarFormulario()) {
    return
  }
  
  enviando.value = true
  
  try {
    const datosTransaccion = {
      usuarioId: formulario.usuarioId,
      monto: formulario.monto,
      tipo: formulario.tipo,
      descripcion: formulario.descripcion.trim(),
      estado: formulario.estado,
      metodoPago: formulario.metodoPago,
      fechaTransaccion: new Date()
    }
    
    if (esEdicion.value && props.transaccion) {
      emit('enviar', {
        ...datosTransaccion,
        id: props.transaccion.id,
        fechaTransaccion: props.transaccion.fechaTransaccion
      })
    } else {
      emit('enviar', datosTransaccion)
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


const obtenerEmojiTipo = (tipo: Transaccion['tipo']) => {
  const emojis = {
    'compra': '🛒',
    'venta': '💰',
    'suscripcion': '🔄',
    'reembolso': '↩️'
  }
  return emojis[tipo] || '💳'
}
</script>

<template>
  <div class="transaccion-form">
    <div class="form-header">
      <h2>{{ tituloFormulario }}</h2>
    </div>
    
    <form @submit.prevent="handleEnviar" class="form-content">
      <div class="form-group">
        <label for="monto">Monto * <span class="help-text">{{ montoFormateado }}</span></label>
        <input
          id="monto"
          v-model.number="formulario.monto"
          type="number"
          step="0.01"
          min="0"
          max="1000000"
          placeholder="0.00"
          :class="{ 'error': errores.monto }"
          :disabled="enviando"
        />
        <span v-if="errores.monto" class="error-message">
          {{ errores.monto }}
        </span>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="tipo">Tipo de transacción *</label>
          <select
            id="tipo"
            v-model="formulario.tipo"
            :class="{ 'error': errores.tipo }"
            :disabled="enviando"
          >
            <option value="">Seleccionar tipo</option>
            <option v-for="tipo in tiposTransaccion" :key="tipo" :value="tipo">
              {{ obtenerEmojiTipo(tipo) }} {{ tipo.charAt(0).toUpperCase() + tipo.slice(1) }}
            </option>
          </select>
          <span v-if="errores.tipo" class="error-message">
            {{ errores.tipo }}
          </span>
        </div>
        
        <div class="form-group">
          <label for="estado">Estado *</label>
          <select
            id="estado"
            v-model="formulario.estado"
            :class="{ 'error': errores.estado }"
            :disabled="enviando"
          >
            <option v-for="estado in estadosTransaccion" :key="estado" :value="estado">
              {{ estado.charAt(0).toUpperCase() + estado.slice(1) }}
            </option>
          </select>
          <span v-if="errores.estado" class="error-message">
            {{ errores.estado }}
          </span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="descripcion">Descripción *</label>
        <textarea
          id="descripcion"
          v-model="formulario.descripcion"
          placeholder="Describe la transacción..."
          :class="{ 'error': errores.descripcion }"
          :disabled="enviando"
          maxlength="200"
          rows="3"
        ></textarea>
        <small class="character-count">
          {{ formulario.descripcion.length }}/200 caracteres
        </small>
        <span v-if="errores.descripcion" class="error-message">
          {{ errores.descripcion }}
        </span>
      </div>
      
      <div class="form-group">
        <label for="metodoPago">Método de pago *</label>
        <select
          id="metodoPago"
          v-model="formulario.metodoPago"
          :class="{ 'error': errores.metodoPago }"
          :disabled="enviando"
        >
          <option value="">Seleccionar método</option>
          <option v-for="metodo in metodosPago" :key="metodo" :value="metodo">
            {{ metodo }}
          </option>
        </select>
        <span v-if="errores.metodoPago" class="error-message">
          {{ errores.metodoPago }}
        </span>
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
.transaccion-form {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-header {
  background: #27ae60;
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

.help-text {
  color: #27ae60;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #27ae60;
  box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #e74c3c;
}

.form-group input:disabled,
.form-group select:disabled,
.form-group textarea:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.character-count {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  display: block;
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
  background-color: #27ae60;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #219a52;
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
  color: #27ae60;
  border: 1px solid #27ae60;
}

.btn-outline:hover:not(:disabled) {
  background-color: #27ae60;
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

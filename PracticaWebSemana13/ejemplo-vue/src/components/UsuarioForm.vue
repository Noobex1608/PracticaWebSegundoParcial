<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { Usuario } from '../types/usuario'


interface Props {
  usuario?: Usuario | null
}

const props = defineProps<Props>()


const emit = defineEmits<{
  'enviar': [usuario: Usuario | Omit<Usuario, 'id'>]
  'cancelar': []
}>()


const formulario = reactive({
  nombre: '',
  email: '',
  contraseña: '',
  activo: true
})

const errores = ref<Record<string, string>>({})
const enviando = ref(false)


const inicializarFormulario = () => {
  if (props.usuario) {
    formulario.nombre = props.usuario.nombre
    formulario.email = props.usuario.email
    formulario.contraseña = props.usuario.contraseña
    formulario.activo = props.usuario.activo
  } else {
    formulario.nombre = ''
    formulario.email = ''
    formulario.contraseña = ''
    formulario.activo = true
  }
  errores.value = {}
}


inicializarFormulario()


watch(() => props.usuario, inicializarFormulario, { immediate: true })


const esEdicion = computed(() => !!props.usuario)

const tituloFormulario = computed(() => 
  esEdicion.value ? 'Editar Usuario' : 'Nuevo Usuario'
)

const textoBotonEnviar = computed(() => 
  esEdicion.value ? 'Actualizar' : 'Crear'
)

const validarFormulario = () => {
  errores.value = {}
  
  if (!formulario.nombre.trim()) {
    errores.value.nombre = 'El nombre es requerido'
  }
  
  if (!formulario.email.trim()) {
    errores.value.email = 'El email es requerido'
  } else if (!esEmailValido(formulario.email)) {
    errores.value.email = 'El email no tiene un formato válido'
  }
  
  if (!formulario.contraseña.trim()) {
    errores.value.contraseña = 'La contraseña es requerida'
  } else if (formulario.contraseña.length < 6) {
    errores.value.contraseña = 'La contraseña debe tener al menos 6 caracteres'
  }
  
  return Object.keys(errores.value).length === 0
}

const esEmailValido = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}


const handleEnviar = async () => {
  if (!validarFormulario()) {
    return
  }
  
  enviando.value = true
  
  try {
    const datosUsuario = {
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      contraseña: formulario.contraseña,
      activo: formulario.activo,
      fechaRegistro: new Date()
    }
    
    if (esEdicion.value && props.usuario) {
      emit('enviar', {
        ...datosUsuario,
        id: props.usuario.id,
        fechaRegistro: props.usuario.fechaRegistro
      })
    } else {
      emit('enviar', datosUsuario)
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
</script>

<template>
  <div class="usuario-form">
    <div class="form-header">
      <h2>{{ tituloFormulario }}</h2>
    </div>
    
    <form @submit.prevent="handleEnviar" class="form-content">

      <div class="form-group">
        <label for="nombre">Nombre completo *</label>
        <input
          id="nombre"
          v-model="formulario.nombre"
          type="text"
          placeholder="Ingresa el nombre completo"
          :class="{ 'error': errores.nombre }"
          :disabled="enviando"
          maxlength="100"
        />
        <span v-if="errores.nombre" class="error-message">
          {{ errores.nombre }}
        </span>
      </div>
      

      <div class="form-group">
        <label for="email">Email *</label>
        <input
          id="email"
          v-model="formulario.email"
          type="email"
          placeholder="ejemplo@correo.com"
          :class="{ 'error': errores.email }"
          :disabled="enviando"
          maxlength="100"
        />
        <span v-if="errores.email" class="error-message">
          {{ errores.email }}
        </span>
      </div>
      

      <div class="form-group">
        <label for="contraseña">Contraseña *</label>
        <input
          id="contraseña"
          v-model="formulario.contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          :class="{ 'error': errores.contraseña }"
          :disabled="enviando"
          maxlength="50"
        />
        <span v-if="errores.contraseña" class="error-message">
          {{ errores.contraseña }}
        </span>
      </div>
      

      <div class="form-group">
        <label class="checkbox-label">
          <input
            v-model="formulario.activo"
            type="checkbox"
            :disabled="enviando"
          />
          <span class="checkbox-text">Usuario activo</span>
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
.usuario-form {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-header {
  background: #3498db;
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

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.form-group input.error {
  border-color: #e74c3c;
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
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
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
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
  color: #3498db;
  border: 1px solid #3498db;
}

.btn-outline:hover:not(:disabled) {
  background-color: #3498db;
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

@media (max-width: 480px) {
  .form-content {
    padding: 1rem;
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

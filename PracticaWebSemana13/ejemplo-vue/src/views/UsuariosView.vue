<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Usuario } from '../types/usuario'
import UsuarioList from '../components/UsuarioList.vue'
import UsuarioForm from '../components/UsuarioForm.vue'


const usuarios = ref<Usuario[]>([])
const mostrarFormulario = ref(false)
const usuarioEditando = ref<Usuario | null>(null)

const usuariosEjemplo: Usuario[] = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    contraseña: 'password123',
    fechaRegistro: new Date('2024-01-15'),
    activo: true
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria@ejemplo.com',
    contraseña: 'password456',
    fechaRegistro: new Date('2024-02-20'),
    activo: true
  },
  {
    id: 3,
    nombre: 'Carlos López',
    email: 'carlos@ejemplo.com',
    contraseña: 'password789',
    fechaRegistro: new Date('2024-03-10'),
    activo: false
  }
]



onMounted(() => {
  cargarUsuarios()
})

const cargarUsuarios = () => {
  usuarios.value = [...usuariosEjemplo]
}


const agregarUsuario = (nuevoUsuario: Omit<Usuario, 'id'>) => {
  const usuario: Usuario = {
    ...nuevoUsuario,
    id: Date.now(), 
    fechaRegistro: new Date()
  }
  
  usuarios.value.push(usuario)
  cerrarFormulario()
}


const actualizarUsuario = (usuarioActualizado: Usuario) => {
  const index = usuarios.value.findIndex(u => u.id === usuarioActualizado.id)
  if (index !== -1) {
    usuarios.value[index] = usuarioActualizado
  }
  cerrarFormulario()
}


const eliminarUsuario = (usuarioId: number) => {
  usuarios.value = usuarios.value.filter(u => u.id !== usuarioId)
}


const toggleUsuarioActivo = (usuarioId: number) => {
  const usuario = usuarios.value.find(u => u.id === usuarioId)
  if (usuario) {
    usuario.activo = !usuario.activo
  }
}


const abrirFormularioNuevo = () => {
  usuarioEditando.value = null
  mostrarFormulario.value = true
}

const abrirFormularioEditar = (usuario: Usuario) => {
  usuarioEditando.value = { ...usuario }
  mostrarFormulario.value = true
}


const cerrarFormulario = () => {
  mostrarFormulario.value = false
  usuarioEditando.value = null
}


const manejarEnvioFormulario = (usuario: Usuario | Omit<Usuario, 'id'>) => {
  if ('id' in usuario) {
    actualizarUsuario(usuario)
  } else {
    agregarUsuario(usuario)
  }
}
</script>

<template>
  <div class="usuarios-view">
    <div class="header">
      <h1>Gestión de Usuarios</h1>
      <button 
        @click="abrirFormularioNuevo"
        class="btn btn-primary"
      >
        ➕ Nuevo Usuario
      </button>
    </div>

    <div class="stats">
      <div class="stat-card">
        <h3>Total Usuarios</h3>
        <p>{{ usuarios.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Usuarios Activos</h3>
        <p>{{ usuarios.filter(u => u.activo).length }}</p>
      </div>
      <div class="stat-card">
        <h3>Usuarios Inactivos</h3>
        <p>{{ usuarios.filter(u => !u.activo).length }}</p>
      </div>
    </div>

    <div v-if="mostrarFormulario" class="modal-overlay">
      <div class="modal-content">
        <UsuarioForm
          :usuario="usuarioEditando"
          @enviar="manejarEnvioFormulario"
          @cancelar="cerrarFormulario"
        />
      </div>
    </div>

    <UsuarioList
      :usuarios="usuarios"
      @eliminar="eliminarUsuario"
      @editar="abrirFormularioEditar"
      @toggle-activo="toggleUsuarioActivo"
    />
  </div>
</template>

<style scoped>
.usuarios-view {
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
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
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
  color: #3498db;
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
  .usuarios-view {
    padding: 1rem;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>

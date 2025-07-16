<script setup lang="ts">
import type { Usuario } from '../types/usuario'
import UsuarioItem from './UsuarioItem.vue'

/**
 * COMPONENTE DE PRESENTACIÓN CONTENEDOR ("TONTO") - LISTA DE USUARIOS
 * 
 * Este componente es responsable ÚNICAMENTE de:
 * 1. Recibir una lista de usuarios vía props
 * 2. Renderizar cada usuario usando UsuarioItem
 * 3. Manejar estados de carga y vacío
 * 4. Reenviar eventos de los componentes hijos al padre
 * 
 * LO QUE NO HACE (y no debe hacer):
 * - No modifica directamente los usuarios
 * - No contiene lógica de negocio
 * - No sabe cómo se almacenan o manejan los usuarios
 */

/**
 * PROPS QUE RECIBE ESTE COMPONENTE
 */
interface Props {
  usuarios: Usuario[]
  cargando?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cargando: false
})

/**
 * EVENTOS QUE ESTE COMPONENTE PUEDE EMITIR
 * Reenvía todos los eventos de UsuarioItem al componente padre
 */
const emit = defineEmits<{
  'editar': [usuario: Usuario]
  'eliminar': [usuarioId: number]
  'toggle-activo': [usuarioId: number]
}>()

/**
 * MÉTODOS DE REENVÍO DE EVENTOS
 */
const handleEditar = (usuario: Usuario) => {
  emit('editar', usuario)
}

const handleEliminar = (usuarioId: number) => {
  emit('eliminar', usuarioId)
}

const handleToggleActivo = (usuarioId: number) => {
  emit('toggle-activo', usuarioId)
}
</script>

<template>
  <div class="usuario-list">
    <!-- ESTADO DE CARGA -->
    <div v-if="cargando" class="loading">
      <div class="spinner"></div>
      <p>Cargando usuarios...</p>
    </div>
    
    <!-- LISTA VACÍA -->
    <div v-else-if="usuarios.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>No hay usuarios registrados</h3>
      <p>Haz clic en "Nuevo Usuario" para agregar el primer usuario al sistema.</p>
    </div>
    
    <!-- LISTA DE USUARIOS -->
    <div v-else class="usuarios-grid">
      <UsuarioItem
        v-for="usuario in usuarios"
        :key="usuario.id"
        :usuario="usuario"
        @editar="handleEditar"
        @eliminar="handleEliminar"
        @toggle-activo="handleToggleActivo"
      />
    </div>
  </div>
</template>

<style scoped>
.usuario-list {
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
  border-top: 4px solid #3498db;
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

.usuarios-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/**
 * ANIMACIONES DE ENTRADA
 */
.usuarios-grid {
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
  .usuario-list {
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

<script setup lang="ts">
import type { Task } from '../types/Task'

/**
 * COMPONENTE DE PRESENTACIÓN MÁS ESPECÍFICO ("TONTO")
 * 
 * Este componente es responsable ÚNICAMENTE de:
 * 1. Recibir UNA tarea vía props
 * 2. Mostrar la información de esa tarea
 * 3. Aplicar estilos visuales según el estado de la tarea
 * 4. Emitir eventos cuando el usuario interactúa con la tarea
 * 
 * LO QUE NO HACE (y no debe hacer):
 * - No modifica directamente la tarea
 * - No conoce otras tareas
 * - No contiene lógica de negocio
 * - No sabe cómo se almacenan o manejan las tareas
 */

/**
 * PROPS QUE RECIBE ESTE COMPONENTE
 * Recibe una única tarea desde TaskList
 */
interface Props {
  task: Task
}

const props = defineProps<Props>()

/**
 * EVENTOS QUE ESTE COMPONENTE PUEDE EMITIR
 * Comunica las acciones del usuario al componente padre
 */
const emit = defineEmits<{
  'toggle-complete': [taskId: number]
  'remove-task': [taskId: number]
}>()

/**
 * MÉTODOS DE INTERACCIÓN
 * Estos métodos emiten eventos con el ID de la tarea
 */

/**
 * Maneja el clic en el checkbox o en el texto de la tarea
 * Emite evento para cambiar el estado de completado
 */
const handleToggleComplete = () => {
  /**
   * COMUNICACIÓN CON EL COMPONENTE PADRE:
   * No cambiamos la tarea directamente, solo emitimos el evento con el ID
   * El componente padre decidirá qué hacer con esta información
   */
  emit('toggle-complete', props.task.id)
}

/**
 * Maneja el clic en el botón de eliminar
 * Emite evento para eliminar la tarea
 */
const handleRemove = () => {
  /**
   * COMUNICACIÓN CON EL COMPONENTE PADRE:
   * Emitimos el evento con el ID para que el padre elimine la tarea
   */
  emit('remove-task', props.task.id)
}
</script>

<template>
  <div 
    class="task-item"
    :class="{ 'completed': props.task.completed }"
  >
    <!-- Contenedor principal de la tarea -->
    <div class="task-content">
      <!-- 
        CHECKBOX PARA MARCAR COMO COMPLETADA
        - Está enlazado al estado de completed de la tarea
        - Al cambiar, emite el evento toggle-complete
      -->
      <input
        type="checkbox"
        :checked="props.task.completed"
        @change="handleToggleComplete"
        class="task-checkbox"
        :id="`task-${props.task.id}`"
        :aria-label="`Marcar tarea '${props.task.text}' como ${props.task.completed ? 'pendiente' : 'completada'}`"
      />
      
      <!-- 
        TEXTO DE LA TAREA
        - También se puede hacer clic para toggle
        - Cambia de estilo si está completada
      -->
      <label 
        :for="`task-${props.task.id}`"
        class="task-text"
        @click="handleToggleComplete"
      >
        {{ props.task.text }}
      </label>
    </div>
    
    <!-- 
      BOTÓN DE ELIMINAR
      - Siempre visible
      - Emite evento remove-task al hacer clic
    -->
    <button
      @click="handleRemove"
      class="remove-button"
      :aria-label="`Eliminar tarea '${props.task.text}'`"
      title="Eliminar tarea"
    >
      🗑️
    </button>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.task-item:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
}

/**
 * ESTILOS PARA TAREAS COMPLETADAS
 * Cambia la apariencia visual cuando la tarea está marcada como completada
 */
.task-item.completed {
  background-color: #d4edda;
  border-color: #c3e6cb;
  opacity: 0.8;
}

.task-item.completed:hover {
  background-color: #c3e6cb;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  cursor: pointer;
}

.task-checkbox {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}

.task-text {
  flex: 1;
  font-size: 1rem;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

/**
 * ESTILOS ESPECÍFICOS PARA TEXTO DE TAREAS COMPLETADAS
 */
.task-item.completed .task-text {
  text-decoration: line-through;
  color: #6c757d;
  font-style: italic;
}

.remove-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.remove-button:hover {
  opacity: 1;
  background-color: #dc3545;
  transform: scale(1.1);
}

.remove-button:focus {
  outline: 2px solid #dc3545;
  outline-offset: 2px;
}

/**
 * ANIMACIONES Y MICROINTERACCIONES
 */
.task-item {
  animation: slideIn 0.3s ease-out;
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

/**
 * RESPONSIVE DESIGN
 */
@media (max-width: 480px) {
  .task-item {
    padding: 0.75rem;
  }
  
  .task-text {
    font-size: 0.9rem;
  }
  
  .remove-button {
    font-size: 1rem;
  }
}
</style> 
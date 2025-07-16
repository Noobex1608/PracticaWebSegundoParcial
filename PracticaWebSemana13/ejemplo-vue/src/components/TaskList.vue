<script setup lang="ts">
import type { Task } from '../types/Task'
import TaskItem from './TaskItem.vue'

/**
 * COMPONENTE DE PRESENTACIÓN ("TONTO")
 * 
 * Este componente es responsable ÚNICAMENTE de:
 * 1. Recibir la lista de tareas vía props
 * 2. Renderizar un TaskItem por cada tarea usando v-for
 * 3. Propagar los eventos de TaskItem hacia el componente padre
 * 
 * LO QUE NO HACE (y no debe hacer):
 * - No modifica las tareas
 * - No contiene lógica de negocio
 * - No maneja el estado de las tareas
 * - Solo actúa como intermediario entre TodoView y TaskItem
 */

/**
 * PROPS QUE RECIBE ESTE COMPONENTE
 * Recibe la lista completa de tareas desde el componente padre (TodoView)
 */
interface Props {
  tasks: Task[]
}

const props = defineProps<Props>()

/**
 * EVENTOS QUE ESTE COMPONENTE PUEDE EMITIR
 * Estos eventos son propagados desde TaskItem hacia TodoView
 */
const emit = defineEmits<{
  'toggle-complete': [taskId: number]
  'remove-task': [taskId: number]
}>()

/**
 * MÉTODOS DE PROPAGACIÓN DE EVENTOS
 * Estos métodos simplemente pasan los eventos de TaskItem hacia arriba
 */

/**
 * Propaga el evento de completar/descompletar tarea
 * Recibe el evento de TaskItem y lo reenvía a TodoView
 */
const handleToggleComplete = (taskId: number) => {
  emit('toggle-complete', taskId)
}

/**
 * Propaga el evento de eliminar tarea
 * Recibe el evento de TaskItem y lo reenvía a TodoView
 */
const handleRemoveTask = (taskId: number) => {
  emit('remove-task', taskId)
}
</script>

<template>
  <div class="task-list">
    <h2>Lista de Tareas</h2>
    
    <!-- 
      Renderizado condicional: solo muestra la lista si hay tareas
    -->
    <div v-if="props.tasks.length > 0" class="tasks-container">
      <!--
        BUCLE v-for QUE RENDERIZA UN TaskItem POR CADA TAREA
        
        Puntos importantes:
        1. :key="task.id" para el rendimiento de Vue
        2. :task="task" pasa la tarea como prop a TaskItem
        3. @toggle-complete="handleToggleComplete" escucha el evento de TaskItem
        4. @remove-task="handleRemoveTask" escucha el evento de TaskItem
        
        FLUJO DE DATOS:
        TodoView → (props) → TaskList → (props) → TaskItem
        TaskItem → (emit) → TaskList → (emit) → TodoView
      -->
      <TaskItem
        v-for="task in props.tasks"
        :key="task.id"
        :task="task"
        @toggle-complete="handleToggleComplete"
        @remove-task="handleRemoveTask"
      />
    </div>
    
    <!-- 
      Estado vacío: se muestra cuando no hay tareas
      Esto es opcional ya que TodoView también maneja este caso
    -->
    <div v-else class="empty-list">
      <p>No hay tareas en la lista</p>
    </div>
  </div>
</template>

<style scoped>
.task-list {
  margin-top: 1.5rem;
}

.task-list h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-list {
  text-align: center;
  color: #95a5a6;
  font-style: italic;
  padding: 2rem 0;
}

.empty-list p {
  margin: 0;
  font-size: 1rem;
}

/**
 * SEPARACIÓN VISUAL ENTRE TAREAS COMPLETADAS Y PENDIENTES
 * Esta es una mejora opcional que se puede agregar
 */
</style> 
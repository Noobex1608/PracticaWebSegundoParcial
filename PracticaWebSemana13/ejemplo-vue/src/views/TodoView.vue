<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task } from '../types/Task'
import AddTaskForm from '../components/AddTaskForm.vue'
import TaskList from '../components/TaskList.vue'

/**
 * COMPONENTE CONTENEDOR ("INTELIGENTE")
 * 
 * Este componente es responsable de:
 * 1. Manejar todo el estado de la aplicación (lista de tareas)
 * 2. Contener toda la lógica de negocio (agregar, eliminar, completar tareas)
 * 3. Coordinar la comunicación entre los componentes de presentación
 * 4. Pasar datos a componentes hijos vía props
 * 5. Escuchar eventos de componentes hijos vía emits
 */

// Estado principal de la aplicación
const tasks = ref<Task[]>([
  { id: 1, text: 'Aprender Vue 3', completed: false },
  { id: 2, text: 'Dominar Composition API', completed: true },
  { id: 3, text: 'Crear una app de tareas', completed: false }
])

// Variable para generar IDs únicos
const nextId = ref(4)

/**
 * Computed que calcula cuántas tareas quedan pendientes
 * Se actualiza automáticamente cuando cambia el estado de las tareas
 */
const pendingTasksCount = computed(() => {
  return tasks.value.filter(task => !task.completed).length
})

/**
 * MÉTODOS DE LÓGICA DE NEGOCIO
 * Estos métodos contienen toda la lógica para manipular las tareas
 */

/**
 * Agrega una nueva tarea a la lista
 * Se ejecuta cuando el componente AddTaskForm emite el evento 'add-task'
 */
const addTask = (taskText: string) => {
  const newTask: Task = {
    id: nextId.value++,
    text: taskText,
    completed: false
  }
  tasks.value.push(newTask)
}

/**
 * Cambia el estado de completado de una tarea
 * Se ejecuta cuando el componente TaskItem emite el evento 'toggle-complete'
 */
const toggleTask = (taskId: number) => {
  const task = tasks.value.find(t => t.id === taskId)
  if (task) {
    task.completed = !task.completed
  }
}

/**
 * Elimina una tarea de la lista
 * Se ejecuta cuando el componente TaskItem emite el evento 'remove-task'
 */
const removeTask = (taskId: number) => {
  const index = tasks.value.findIndex(t => t.id === taskId)
  if (index !== -1) {
    tasks.value.splice(index, 1)
  }
}
</script>

<template>
  <div class="todo-app">
    <header class="header">
      <h1>📝 Lista de Tareas</h1>
      <p class="subtitle">
        Una demostración de separación de responsabilidades en Vue 3
      </p>
    </header>

    <main class="main-content">
      <!-- 
        COMPONENTE DE PRESENTACIÓN: AddTaskForm
        - Recibe: nada (no necesita props)
        - Emite: 'add-task' con el texto de la nueva tarea
        - El contenedor escucha el evento y ejecuta la lógica addTask()
      -->
      <AddTaskForm @add-task="addTask" />

      <!-- Contador de tareas pendientes -->
      <div class="task-counter">
        <p v-if="pendingTasksCount === 0" class="no-pending">
          🎉 ¡No tienes tareas pendientes!
        </p>
        <p v-else class="pending-count">
          📋 Tienes {{ pendingTasksCount }} tarea{{ pendingTasksCount !== 1 ? 's' : '' }} pendiente{{ pendingTasksCount !== 1 ? 's' : '' }}
        </p>
      </div>

      <!-- 
        COMPONENTE DE PRESENTACIÓN: TaskList
        - Recibe: lista de tareas vía props
        - Emite: 'toggle-complete' y 'remove-task' (propagados desde TaskItem)
        - El contenedor escucha los eventos y ejecuta la lógica correspondiente
      -->
      <TaskList 
        :tasks="tasks"
        @toggle-complete="toggleTask"
        @remove-task="removeTask"
      />

      <!-- Mensaje cuando no hay tareas -->
      <div v-if="tasks.length === 0" class="empty-state">
        <p>No hay tareas aún. ¡Agrega tu primera tarea! 🚀</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0;
}

.main-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.task-counter {
  margin: 1.5rem 0;
  text-align: center;
}

.no-pending {
  color: #27ae60;
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0;
}

.pending-count {
  color: #e67e22;
  font-weight: 500;
  margin: 0;
}

.empty-state {
  text-align: center;
  color: #95a5a6;
  font-style: italic;
  margin-top: 2rem;
}

.empty-state p {
  margin: 0;
  font-size: 1.1rem;
}
</style> 
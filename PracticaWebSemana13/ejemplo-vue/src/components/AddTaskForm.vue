<script setup lang="ts">
import { ref } from 'vue'

/**
 * COMPONENTE DE PRESENTACIÓN ("TONTO")
 * 
 * Este componente es responsable ÚNICAMENTE de:
 * 1. Renderizar el formulario de entrada
 * 2. Manejar su propio estado local (el texto del input)
 * 3. Emitir eventos cuando el usuario quiere agregar una tarea
 * 
 * LO QUE NO HACE (y no debe hacer):
 * - No sabe qué hacer con la tarea una vez creada
 * - No maneja la lista de tareas
 * - No tiene lógica de negocio
 * - No sabe cómo se almacenan las tareas
 */

// Estado local del componente: solo el texto del input
const newTaskText = ref('')

/**
 * DEFINICIÓN DE EVENTOS QUE ESTE COMPONENTE PUEDE EMITIR
 * Este componente puede emitir un evento 'add-task' con un string
 */
const emit = defineEmits<{
  'add-task': [taskText: string]
}>()

/**
 * Maneja el envío del formulario
 * Valida que el texto no esté vacío y emite el evento
 */
const handleSubmit = () => {
  const trimmedText = newTaskText.value.trim()
  
  // Validación simple: no permitir tareas vacías
  if (trimmedText === '') {
    return
  }
  
  /**
   * COMUNICACIÓN CON EL COMPONENTE PADRE:
   * En lugar de agregar la tarea directamente, emitimos un evento
   * El componente padre (TodoView) escuchará este evento y ejecutará su lógica
   */
  emit('add-task', trimmedText)
  
  // Limpiar el formulario después de emitir el evento
  newTaskText.value = ''
}

/**
 * Maneja la tecla Enter en el input
 */
const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSubmit()
  }
}
</script>

<template>
  <div class="add-task-form">
    <h2>Agregar Nueva Tarea</h2>
    
    <div class="form-container">
      <!-- 
        Input controlado por el estado local del componente
        Nota: v-model.trim automáticamente elimina espacios al inicio y final
      -->
      <input
        v-model.trim="newTaskText"
        type="text"
        placeholder="Escribe tu tarea aquí..."
        class="task-input"
        @keypress="handleKeyPress"
        aria-label="Nueva tarea"
      />
      
      <!-- 
        Botón deshabilitado cuando el input está vacío
        Al hacer clic, ejecuta handleSubmit que emite el evento
      -->
      <button
        @click="handleSubmit"
        :disabled="newTaskText.trim() === ''"
        class="add-button"
        type="button"
      >
        ➕ Agregar
      </button>
    </div>
    
    <!-- Instrucción visual para el usuario -->
    <p class="hint">
      💡 Presiona Enter o haz clic en "Agregar" para crear la tarea
    </p>
  </div>
</template>

<style scoped>
.add-task-form {
  margin-bottom: 2rem;
}

.add-task-form h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.form-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.task-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.task-input:focus {
  outline: none;
  border-color: #3498db;
}

.task-input::placeholder {
  color: #bdc3c7;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-button:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.add-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.hint {
  color: #7f8c8d;
  font-size: 0.85rem;
  margin: 0;
  font-style: italic;
}

/* Responsive design para pantallas pequeñas */
@media (max-width: 480px) {
  .form-container {
    flex-direction: column;
  }
  
  .add-button {
    width: 100%;
  }
}
</style> 
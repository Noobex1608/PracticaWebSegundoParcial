# 📝 Lista de Tareas - Tutorial Vue 3 + TypeScript

Una aplicación completa de Lista de Tareas construida con **Vue 3**, **Composition API**, **`<script setup>`** y **TypeScript**. Este proyecto demuestra la **separación de responsabilidades** entre componentes "inteligentes" (contenedores) y componentes "tontos" (presentación).

## 🎯 Objetivos de Aprendizaje

- Entender la arquitectura de separación de responsabilidades
- Dominar Vue 3 Composition API con `<script setup>`
- Implementar comunicación entre componentes (props + emits)
- Trabajar con TypeScript en Vue
- Crear una estructura de proyecto escalable

## 🚀 Pasos para Crear la Aplicación desde Cero

### 1. Crear el Proyecto Base

```bash
# Crear proyecto Vue 3 + TypeScript
npm create vue@latest ejemplo-vue

# Configuración recomendada:
# ✓ TypeScript
# ✓ otros según preferencia

# Navegar al proyecto
cd ejemplo-vue

# Instalar dependencias
npm install
```

### 2. Estructura de Archivos a Crear

```
src/
├── types/
│   └── Task.ts                 # Interface TypeScript
├── views/
│   └── TodoView.vue           # Componente contenedor
├── components/
│   ├── AddTaskForm.vue        # Formulario de agregar
│   ├── TaskList.vue           # Lista de tareas
│   └── TaskItem.vue           # Item individual
└── App.vue                    # Componente principal
```

### 3. Paso 1: Crear la Interface Task

**📁 `src/types/Task.ts`**

```typescript
/**
 * Interface que define la estructura de una tarea en la aplicación
 * Esta es la única responsabilidad de este archivo: definir el tipo de datos Task
 */
export interface Task {
  id: number;
  text: string;
  completed: boolean;
}
```

### 4. Paso 2: Crear el Componente Contenedor

**📁 `src/views/TodoView.vue`**

```vue
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
```

### 5. Paso 3: Crear el Formulario de Agregar Tareas

**📁 `src/components/AddTaskForm.vue`**

```vue
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
```

### 6. Paso 4: Crear la Lista de Tareas

**📁 `src/components/TaskList.vue`**

```vue
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
</style>
```

### 7. Paso 5: Crear el Item Individual

**📁 `src/components/TaskItem.vue`**

```vue
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
```

### 8. Paso 6: Actualizar App.vue

**📁 `src/App.vue`**

```vue
<script setup lang="ts">
import TodoView from './views/TodoView.vue'
</script>

<template>
  <div id="app">
    <!-- 
      COMPONENTE PRINCIPAL DE LA APLICACIÓN
      TodoView es nuestro componente contenedor que maneja toda la lógica
    -->
    <TodoView />
  </div>
</template>

<style>
/* Reset y estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 1rem;
}

#app {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2rem;
}

/* Estilos globales para mejorar la accesibilidad */
button:focus,
input:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* Transiciones suaves para todos los elementos interactivos */
button,
input,
.task-item {
  transition: all 0.3s ease;
}
</style>
```

### 9. Paso 7: Crear las Carpetas Necesarias

```bash
# Crear estructura de carpetas
mkdir src/types
mkdir src/views
```

### 10. Paso 8: Eliminar Archivos Innecesarios

```bash
# Eliminar el componente de ejemplo
rm src/components/HelloWorld.vue
```

## 🏃‍♂️ Ejecutar la Aplicación

```bash
# Instalar dependencias (si no se hizo antes)
npm install

# Ejecutar servidor de desarrollo
npm run dev

# La aplicación estará disponible en: http://localhost:5173
```

## 🏗️ Arquitectura de la Aplicación

### 📊 Flujo de Datos

```
TodoView (Contenedor)
    ↓ props
AddTaskForm (Presentación) → emit → TodoView
    ↓ props                          ↑ emit
TaskList (Presentación) → emit → ────┘
    ↓ props        ↑ emit
TaskItem (Presentación)
```

### 🧩 Separación de Responsabilidades

#### **Componentes Inteligentes (Contenedores):**
- `TodoView.vue`: Maneja estado y lógica de negocio

#### **Componentes Tontos (Presentación):**
- `AddTaskForm.vue`: Solo renderiza y emite eventos
- `TaskList.vue`: Solo renderiza y propaga eventos
- `TaskItem.vue`: Solo renderiza y emite eventos

### 🔄 Comunicación entre Componentes

#### **Props (Datos hacia abajo):**
```typescript
TodoView → TaskList → TaskItem
```

#### **Events (Eventos hacia arriba):**
```typescript
TaskItem → TaskList → TodoView
AddTaskForm → TodoView
```

## 📚 Conceptos Clave Demostrados

1. **Vue 3 Composition API**: `ref`, `computed`, `defineProps`, `defineEmits`
2. **TypeScript**: Interfaces, tipado de props y eventos
3. **Separación de Responsabilidades**: Contenedores vs Presentación
4. **Comunicación Unidireccional**: Props + Events
5. **Estado Local vs Global**: Cada componente maneja su responsabilidad
6. **Reactividad**: Los datos se actualizan automáticamente
7. **Accesibilidad**: aria-labels, navegación por teclado
8. **Responsive Design**: Adaptable a diferentes tamaños de pantalla

## ✨ Características de la Aplicación

- ➕ Agregar nuevas tareas
- ✅ Marcar tareas como completadas
- 🗑️ Eliminar tareas
- 📊 Contador de tareas pendientes
- 📱 Diseño responsive
- ♿ Accesible
- 🎨 Interfaz moderna

## 🎓 Para Estudiantes

Este proyecto es ideal para aprender:
- Cómo estructurar una aplicación Vue escalable
- La importancia de la separación de responsabilidades
- Comunicación efectiva entre componentes
- Buenas prácticas de TypeScript en Vue
- Técnicas de UX/UI modernas

¡Feliz codificación! 🚀

# 📝 Lista de Tareas - Tutorial Vue 3 + TypeScript

Una aplicación de gestion de canciones con transacciones y usuarios, simulados en una lista reactiva

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


### 🧩 Separación de Responsabilidades

#### **Componentes Inteligentes (Contenedores):**
- `TodoView.vue`: Maneja estado y lógica de negocio
- `Transacciones.vue`: Maneja transacciones crud
- `Usuarios.vue`: Maneja los usuarios un crud
- `CancionesView.vue`: Maneja las canciones crud

#### **Componentes Tontos (Presentación):**
- `AddTaskForm.vue`: Solo renderiza y emite eventos
- `TaskList.vue`: Solo renderiza y propaga eventos
- `TaskItem.vue`: Solo renderiza y emite eventos
- `CancionForm.vue`: Solo renderiza el formulario de canciones 
- `CancionItem.vue`: Solo renderiza una cancion a la vez
- `CancionList.vue`: Solo renderiza la lista de canciones
- `TransaccionForm.vue`: Solo renderiza el formulario de transacciones
- `TransaccionItem.vue`: Solo renderiza un item de transacciones a la vez
- `TransaccionList.vue`: Solo renderiza una lista de transacciones
- `UsuarioForm.vue`: Solo renderiza el formulario de usuarios
- `UsuarioItem.vue`: Solo renderiza un item de los usuarios a la vez
- `UsuarioList.vue`: Solo renderiza una list de usuarios



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

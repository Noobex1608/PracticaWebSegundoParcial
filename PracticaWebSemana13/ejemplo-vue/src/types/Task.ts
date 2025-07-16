/**
 * Interface que define la estructura de una tarea en la aplicación
 * Esta es la única responsabilidad de este archivo: definir el tipo de datos Task
 */
export interface Task {
  id: number;
  text: string;
  completed: boolean;
} 
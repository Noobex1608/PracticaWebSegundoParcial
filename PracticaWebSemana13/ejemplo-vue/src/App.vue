<script setup lang="ts">
import { ref } from 'vue'
import UsuariosView from './views/UsuariosView.vue'
import CancionesView from './views/CancionesView.vue'
import TransaccionesView from './views/TransaccionesView.vue'




type VistaActiva = 'usuarios' | 'canciones' | 'transacciones'


const vistaActiva = ref<VistaActiva>('usuarios')


const vistas = {
  usuarios: {
    componente: UsuariosView,
    titulo: 'Gestión de Usuarios',
    icono: '👥',
    descripcion: 'Administra usuarios del sistema'
  },
  canciones: {
    componente: CancionesView,
    titulo: 'Gestión de Canciones',
    icono: '🎵',
    descripcion: 'Administra el catálogo musical'
  },
  transacciones: {
    componente: TransaccionesView,
    titulo: 'Gestión de Transacciones',
    icono: '💳',
    descripcion: 'Administra transacciones financieras'
  }
}

const cambiarVista = (nuevaVista: VistaActiva) => {
  vistaActiva.value = nuevaVista
}


const obtenerVistaConfig = () => {
  return vistas[vistaActiva.value]
}
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>🎪 Sistema de Gestión</h1>
          <p>Administración completa de datos</p>
        </div>
        
        <div class="nav-menu">
          <button
            v-for="(vista, key) in vistas"
            :key="key"
            @click="cambiarVista(key as VistaActiva)"
            class="nav-button"
            :class="{ 'active': vistaActiva === key }"
            :title="vista.descripcion"
          >
            <span class="nav-icon">{{ vista.icono }}</span>
            <span class="nav-text">{{ vista.titulo }}</span>
          </button>
        </div>
        
        <div class="nav-indicator">
          <span class="current-view">
            {{ obtenerVistaConfig().icono }} {{ obtenerVistaConfig().titulo }}
          </span>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <header class="view-header">
        <h2>{{ obtenerVistaConfig().titulo }}</h2>
        <p>{{ obtenerVistaConfig().descripcion }}</p>
      </header>
      
      <div class="view-container">
        <UsuariosView v-if="vistaActiva === 'usuarios'" />
        <CancionesView v-else-if="vistaActiva === 'canciones'" />
        <TransaccionesView v-else-if="vistaActiva === 'transacciones'" />
      </div>
    </main>
  </div>
</template>

<style>

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
  margin: 0;
  padding: 0;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ESTILOS DE LA BARRA DE NAVEGACIÓN */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.nav-brand h1 {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.nav-brand p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 50px;
  background: transparent;
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s ease;
}

.nav-button:hover::before {
  left: 100%;
}

.nav-button:hover {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  transform: translateY(-2px);
}

.nav-button.active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.nav-button.active:hover {
  background: linear-gradient(135deg, #2980b9, #3498db);
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 1.2rem;
}

.nav-text {
  font-weight: 600;
}

.nav-indicator {
  display: flex;
  align-items: center;
}

.current-view {
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(127, 140, 141, 0.1);
  border-radius: 20px;
}

/* ESTILOS DEL CONTENIDO PRINCIPAL */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.view-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.view-header h2 {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.view-header p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
}

.view-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeIn 0.5s ease-out;
}

/* ANIMACIONES */
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

/* ESTILOS GLOBALES PARA MEJORAR LA ACCESIBILIDAD */
button:focus,
input:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* TRANSICIONES SUAVES PARA TODOS LOS ELEMENTOS INTERACTIVOS */
button,
input {
  transition: all 0.3s ease;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .nav-indicator {
    display: none;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .view-header h2 {
    font-size: 2rem;
  }
  
  .view-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-brand h1 {
    font-size: 1.2rem;
  }
  
  .nav-brand p {
    font-size: 0.8rem;
  }
  
  .nav-button {
    padding: 0.5rem;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    justify-content: center;
  }
  
  .nav-icon {
    font-size: 1.5rem;
  }
  
  .view-header {
    padding: 1rem;
  }
  
  .view-header h2 {
    font-size: 1.8rem;
  }
  
  .view-header p {
    font-size: 1rem;
  }
}

/* EFECTOS ESPECIALES */
.nav-button:active {
  transform: scale(0.95);
}

.view-container {
  position: relative;
  overflow: hidden;
}

.view-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(52, 152, 219, 0.05) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* SCROLLBAR PERSONALIZADA */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2980b9, #3498db);
}
</style>

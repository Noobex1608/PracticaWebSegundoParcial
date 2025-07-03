import { useState } from 'react';
import Navigation from './components/Navigation';
import ArtistasPage from './pages/ArtistasPage';
import UsuariosPage from './pages/UsuariosPage';
import MembresiasPage from './pages/MembresiasPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('artistas');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'artistas':
        return <ArtistasPage />;
      case 'usuarios':
        return <UsuariosPage />;
      case 'membresias':
        return <MembresiasPage />;
      default:
        return <ArtistasPage />;
    }
  };

  return (
    <div className="App">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />
      
      <main style={{ minHeight: 'calc(100vh - 120px)' }}>
        {renderCurrentPage()}
      </main>
      
      <footer style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '2rem', 
        textAlign: 'center',
        borderTop: '1px solid #ddd',
        marginTop: '2rem'
      }}>
        <p style={{ margin: 0, color: '#666' }}>
          🎵 Sistema de Gestión Musical - Desarrollado con React + TypeScript + Supabase
        </p>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#888' }}>
          CRUD completo para Artistas, Usuarios y Membresías
        </p>
      </footer>
    </div>
  );
}

export default App;

import React from 'react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const pages = [
    { id: 'artistas', label: '🎨 Artistas', description: 'Gestionar artistas musicales' },
    { id: 'usuarios', label: '👥 Usuarios', description: 'Gestionar usuarios del sistema' },
    { id: 'membresias', label: '🎫 Membresías', description: 'Gestionar membresías de usuarios' }
  ];

  return (
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: '1rem 2rem',
      borderBottom: '1px solid #ddd',
      marginBottom: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 1rem 0', color: '#333' }}>
          🎵 Sistema de Gestión Musical
        </h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {pages.map(page => (
            <button
              key={page.id}
              onClick={() => onPageChange(page.id)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: currentPage === page.id ? '#007bff' : 'white',
                color: currentPage === page.id ? 'white' : '#333',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: currentPage === page.id ? 'bold' : 'normal',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== page.id) {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== page.id) {
                  e.currentTarget.style.backgroundColor = 'white';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                {page.label}
              </span>
              <small style={{ 
                fontSize: '0.8rem', 
                opacity: 0.8,
                textAlign: 'center',
                lineHeight: 1.2
              }}>
                {page.description}
              </small>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

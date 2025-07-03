import React from 'react';
import type { Usuario } from '../types/Usuario';

interface UsuarioListProps {
  usuarios: Usuario[];
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const UsuarioList: React.FC<UsuarioListProps> = ({ 
  usuarios, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#333',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <p style={{ color: '#333', margin: 0 }}>Cargando usuarios...</p>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem',
        color: '#333',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <p style={{ color: '#333', margin: 0 }}>No hay usuarios registrados.</p>
      </div>
    );
  }

  return (
    <div className="usuario-list" style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '8px' }}>
      <h2 style={{ color: '#1a365d', marginBottom: '1.5rem', textAlign: 'center' }}>Lista de Usuarios</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {usuarios.map((usuario) => (
          <div 
            key={usuario.id} 
            style={{ 
              border: '2px solid #e2e8f0', 
              borderRadius: '12px', 
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#4299e1';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                margin: '0 0 1rem 0', 
                color: '#2d3748', 
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                👤 {usuario.nombre}
              </h3>
              
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <p style={{ 
                  margin: '0', 
                  color: '#2d3748',
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    backgroundColor: '#e6fffa', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    color: '#234e52',
                    fontWeight: '500',
                    fontSize: '0.85rem'
                  }}>
                    📧 Correo:
                  </span>
                  <span style={{ color: '#2b6cb0', fontWeight: '500' }}>
                    {usuario.correo}
                  </span>
                </p>
                
                {usuario.edad && (
                  <p style={{ 
                    margin: '0', 
                    color: '#2d3748',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ 
                      backgroundColor: '#fef5e7', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      color: '#744210',
                      fontWeight: '500',
                      fontSize: '0.85rem'
                    }}>
                      🎂 Edad:
                    </span>
                    <span style={{ color: '#c05621', fontWeight: '500' }}>
                      {usuario.edad} años
                    </span>
                  </p>
                )}
                
                {usuario.descripcion && (
                  <p style={{ 
                    margin: '0', 
                    fontSize: '0.9rem', 
                    color: '#4a5568',
                    backgroundColor: '#f7fafc',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    borderLeft: '3px solid #cbd5e0',
                    marginTop: '0.5rem'
                  }}>
                    <span style={{ fontWeight: '500', color: '#2d3748' }}>📝 Descripción:</span><br />
                    {usuario.descripcion}
                  </p>
                )}
                
                {usuario.created_at && (
                  <p style={{ 
                    margin: '0.5rem 0 0 0', 
                    fontSize: '0.8rem', 
                    color: '#718096',
                    backgroundColor: '#edf2f7',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    textAlign: 'center'
                  }}>
                    📅 Registrado: {new Date(usuario.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.75rem',
              marginLeft: '1rem',
              minWidth: 'fit-content'
            }}>
              <button
                onClick={() => onEdit(usuario)}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#3182ce',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(49, 130, 206, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2c5282';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(49, 130, 206, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#3182ce';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(49, 130, 206, 0.2)';
                }}
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => {
                  if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
                    onDelete(usuario.id);
                  }
                }}
                style={{
                  padding: '0.75rem 1.25rem',
                  backgroundColor: '#e53e3e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(229, 62, 62, 0.2)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c53030';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(229, 62, 62, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#e53e3e';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(229, 62, 62, 0.2)';
                }}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsuarioList;

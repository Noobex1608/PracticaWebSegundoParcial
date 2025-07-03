import React from 'react';
import type { Artista } from '../types/Artista';

interface ArtistaListProps {
  artistas: Artista[];
  onEdit: (artista: Artista) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const ArtistaList: React.FC<ArtistaListProps> = ({ 
  artistas, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          fontSize: '2rem', 
          marginBottom: '1rem',
          color: '#007bff'
        }}>
          🎵
        </div>
        <p style={{ 
          color: '#495057', 
          fontSize: '1.1rem',
          margin: 0
        }}>
          Cargando artistas...
        </p>
      </div>
    );
  }

  if (artistas.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px dashed #dee2e6'
      }}>
        <div style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          color: '#6c757d'
        }}>
          🎨
        </div>
        <h3 style={{ 
          color: '#495057', 
          marginBottom: '0.5rem',
          fontSize: '1.3rem'
        }}>
          No hay artistas registrados
        </h3>
        <p style={{ 
          color: '#6c757d', 
          fontSize: '1rem',
          margin: 0
        }}>
          ¡Comienza añadiendo tu primer artista musical!
        </p>
      </div>
    );
  }

  return (
    <div className="artista-list">
      <h2 style={{ 
        color: '#2c3e50', 
        marginBottom: '1.5rem', 
        textAlign: 'center',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: '2px solid #e9ecef'
      }}>
        🎵 Lista de Artistas
      </h2>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {artistas.map((artista) => (
          <div 
            key={artista.id} 
            style={{ 
              border: '2px solid #e9ecef', 
              borderRadius: '12px', 
              padding: '1.5rem',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
              <img 
                src={artista.fotoUrl} 
                alt={artista.nombre}
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '3px solid #f8f9fa',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/120x120/6c757d/ffffff?text=Sin+Imagen';
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  margin: '0 0 0.75rem 0', 
                  color: '#2c3e50', 
                  fontSize: '1.4rem',
                  fontWeight: 'bold'
                }}>
                  🎵 {artista.nombre}
                </h3>
                <p style={{ 
                  margin: '0.5rem 0', 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  fontSize: '1rem'
                }}>
                  <span style={{ color: '#2c3e50' }}>Género:</span> 
                  <span style={{ 
                    color: '#ffffff', 
                    marginLeft: '0.5rem',
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#007bff',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0, 123, 255, 0.3)'
                  }}>
                    {artista.generomusical}
                  </span>
                </p>
                <p style={{ 
                  margin: '0.75rem 0', 
                  fontSize: '0.95rem',
                  color: '#2c3e50',
                  lineHeight: '1.5',
                  textAlign: 'justify'
                }}>
                  <strong style={{ color: '#495057' }}>Bio:</strong> {artista.bio}
                </p>
                {(artista.redessociales?.facebook || 
                  artista.redessociales?.instagram || 
                  artista.redessociales?.twitter) && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong style={{ color: '#2c3e50', fontSize: '1rem' }}>Redes Sociales:</strong>
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      marginTop: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {artista.redessociales?.facebook && (
                        <a 
                          href={artista.redessociales.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '0.5rem 0.8rem',
                            backgroundColor: '#1877f2',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(24, 119, 242, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#166fe5';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#1877f2';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          📘 Facebook
                        </a>
                      )}
                      {artista.redessociales?.instagram && (
                        <a 
                          href={artista.redessociales.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '0.5rem 0.8rem',
                            backgroundColor: '#e4405f',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(228, 64, 95, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#d73754';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#e4405f';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          📷 Instagram
                        </a>
                      )}
                      {artista.redessociales?.twitter && (
                        <a 
                          href={artista.redessociales.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            color: '#ffffff',
                            textDecoration: 'none',
                            padding: '0.5rem 0.8rem',
                            backgroundColor: '#1da1f2',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(29, 161, 242, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#1991db';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#1da1f2';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          🐦 Twitter
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.75rem',
                alignItems: 'center',
                minWidth: '100px'
              }}>
                <button
                  onClick={() => onEdit(artista)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0, 123, 255, 0.3)',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056b3';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#007bff';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 123, 255, 0.3)';
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres eliminar este artista?')) {
                      onDelete(artista.id);
                    }
                  }}
                  style={{
                    padding: '0.75rem 1.25rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(220, 53, 69, 0.3)',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#c82333';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc3545';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(220, 53, 69, 0.3)';
                  }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistaList;

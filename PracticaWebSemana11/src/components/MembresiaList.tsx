import React from 'react';
import type { Membresia } from '../types/Membresia';

interface MembresiaListProps {
  membresias: Membresia[];
  onEdit: (membresia: Membresia) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const MembresiaList: React.FC<MembresiaListProps> = ({ 
  membresias, 
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
          🧾
        </div>
        <p style={{ 
          color: '#495057', 
          fontSize: '1.1rem',
          margin: 0
        }}>
          Cargando membresías...
        </p>
      </div>
    );
  }

  if (membresias.length === 0) {
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
          💳
        </div>
        <h3 style={{ 
          color: '#495057', 
          marginBottom: '0.5rem',
          fontSize: '1.3rem'
        }}>
          No hay membresías registradas
        </h3>
        <p style={{ 
          color: '#6c757d', 
          fontSize: '1rem',
          margin: 0
        }}>
          ¡Comienza creando tu primera membresía!
        </p>
      </div>
    );
  }

  const getEstadoBadge = (estado: string) => {
    const colors = {
      activa: { bg: '#28a745', text: '#ffffff' },
      inactiva: { bg: '#6c757d', text: '#ffffff' },
      vencida: { bg: '#dc3545', text: '#ffffff' }
    };
    
    const colorConfig = colors[estado as keyof typeof colors] || { bg: '#6c757d', text: '#ffffff' };
    
    return (
      <span style={{
        padding: '0.5rem 0.8rem',
        borderRadius: '20px',
        backgroundColor: colorConfig.bg,
        color: colorConfig.text,
        fontSize: '0.85rem',
        fontWeight: 'bold',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {estado}
      </span>
    );
  };

  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(monto);
  };

  return (
    <div className="membresia-list">
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
        🧾 Lista de Membresías
      </h2>
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {membresias.map((membresia) => (
          <div 
            key={membresia.id} 
            style={{ 
              border: '2px solid #e9ecef', 
              borderRadius: '12px', 
              padding: '1.5rem',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1.5rem',
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
            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid #f8f9fa'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  color: '#2c3e50',
                  fontSize: '1.3rem',
                  fontWeight: 'bold'
                }}>
                  🧾 Membresía #{membresia.id.slice(0, 8)}...
                </h3>
                {getEstadoBadge(membresia.estado)}
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <p style={{ 
                  margin: 0,
                  color: '#2c3e50',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  👤 <strong style={{ color: '#495057' }}>Usuario ID:</strong> 
                  <span style={{ 
                    marginLeft: '0.5rem',
                    color: '#007bff',
                    fontFamily: 'monospace',
                    backgroundColor: '#e3f2fd',
                    padding: '0.2rem 0.4rem',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}>
                    {membresia.usuarioid}
                  </span>
                </p>
                <p style={{ 
                  margin: 0,
                  color: '#2c3e50',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  💰 <strong style={{ color: '#495057' }}>Monto:</strong> 
                  <span style={{ 
                    marginLeft: '0.5rem',
                    color: '#28a745',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}>
                    {formatMonto(membresia.monto)}
                  </span>
                </p>
                <p style={{ 
                  margin: 0,
                  color: '#2c3e50',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  📅 <strong style={{ color: '#495057' }}>Inicio:</strong> 
                  <span style={{ marginLeft: '0.5rem', color: '#495057' }}>
                    {formatFecha(membresia.fechainicio)}
                  </span>
                </p>
                <p style={{ 
                  margin: 0,
                  color: '#2c3e50',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  📅 <strong style={{ color: '#495057' }}>Fin:</strong> 
                  <span style={{ marginLeft: '0.5rem', color: '#495057' }}>
                    {formatFecha(membresia.fechafin)}
                  </span>
                </p>
              </div>
              
              {membresia.created_at && (
                <p style={{ 
                  margin: 0, 
                  fontSize: '0.85rem', 
                  color: '#495057',
                  backgroundColor: '#f8f9fa',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  📝 <strong>Creada:</strong> {formatFecha(membresia.created_at)}
                </p>
              )}
            </div>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.75rem',
              alignItems: 'center',
              minWidth: '120px'
            }}>
              <button
                onClick={() => onEdit(membresia)}
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
                  if (window.confirm('¿Estás seguro de que quieres eliminar esta membresía?')) {
                    onDelete(membresia.id);
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
        ))}
      </div>
    </div>
  );
};

export default MembresiaList;

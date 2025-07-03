import React, { useState, useEffect } from 'react';
import { membresiaService } from '../services/membresiaService';
import { usuarioService } from '../services/usuarioService';
import MembresiaList from '../components/MembresiaList';
import MembresiaForm from '../components/MembresiaForm';
import type { Membresia, CreateMembresiaInput } from '../types/Membresia';
import type { Usuario } from '../types/Usuario';

const MembresiasPage: React.FC = () => {
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editingMembresia, setEditingMembresia] = useState<Membresia | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [membresiasData, usuariosData] = await Promise.all([
        membresiaService.getAll(),
        usuarioService.getAll()
      ]);
      setMembresias(membresiasData);
      setUsuarios(usuariosData);
    } catch (error) {
      setError(`Error al cargar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (membresiaData: CreateMembresiaInput) => {
    try {
      setFormLoading(true);
      setError(null);
      const newMembresia = await membresiaService.create(membresiaData);
      setMembresias(prev => [newMembresia, ...prev]);
      setShowForm(false);
      alert('Membresía creada exitosamente');
    } catch (error) {
      setError(`Error al crear membresía: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error creating membresia:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (membresiaData: CreateMembresiaInput) => {
    if (!editingMembresia) return;

    try {
      setFormLoading(true);
      setError(null);
      const updatedMembresia = await membresiaService.update(editingMembresia.id, membresiaData);
      setMembresias(prev => 
        prev.map(membresia => 
          membresia.id === editingMembresia.id ? updatedMembresia : membresia
        )
      );
      setEditingMembresia(null);
      setShowForm(false);
      alert('Membresía actualizada exitosamente');
    } catch (error) {
      setError(`Error al actualizar membresía: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error updating membresia:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await membresiaService.delete(id);
      setMembresias(prev => prev.filter(membresia => membresia.id !== id));
      alert('Membresía eliminada exitosamente');
    } catch (error) {
      setError(`Error al eliminar membresía: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error deleting membresia:', error);
    }
  };

  const handleEdit = (membresia: Membresia) => {
    setEditingMembresia(membresia);
    setShowForm(true);
  };

  const handleSubmit = (membresiaData: CreateMembresiaInput) => {
    if (editingMembresia) {
      handleUpdate(membresiaData);
    } else {
      handleCreate(membresiaData);
    }
  };

  const handleCancel = () => {
    setEditingMembresia(null);
    setShowForm(false);
    setError(null);
  };

  const handleNewMembresia = () => {
    setEditingMembresia(null);
    setShowForm(true);
    setError(null);
  };

  const stats = {
    total: membresias.length,
    activas: membresias.filter(m => m.estado === 'activa').length,
    inactivas: membresias.filter(m => m.estado === 'inactiva').length,
    vencidas: membresias.filter(m => m.estado === 'vencida').length,
    montoTotal: membresias.reduce((total, m) => total + m.monto, 0),
    montoActivas: membresias.filter(m => m.estado === 'activa').reduce((total, m) => total + m.monto, 0)
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(monto);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1200px', 
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          color: '#2c3e50', 
          margin: 0,
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          🧾 Gestión de Membresías
        </h1>
        <button
          onClick={handleNewMembresia}
          disabled={loading || usuarios.length === 0}
          style={{
            padding: '1rem 2rem',
            backgroundColor: loading || usuarios.length === 0 ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading || usuarios.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: loading || usuarios.length === 0 ? 'none' : '0 4px 8px rgba(40, 167, 69, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading && usuarios.length > 0) {
              e.currentTarget.style.backgroundColor = '#218838';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(40, 167, 69, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && usuarios.length > 0) {
              e.currentTarget.style.backgroundColor = '#28a745';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
            }
          }}
        >
          ➕ Nueva Membresía
        </button>
      </div>

      {usuarios.length === 0 && !loading && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #ffeaa7'
        }}>
          <strong>Aviso:</strong> Necesitas crear usuarios antes de poder crear membresías.
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          border: '1px solid #f5c6cb'
        }}>
          <strong>Error:</strong> {error}
          <button
            onClick={() => setError(null)}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#721c24'
            }}
          >
            ×
          </button>
        </div>
      )}

      {membresias.length > 0 && (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e9ecef'
        }}>
          <h3 style={{ 
            color: '#2c3e50', 
            marginBottom: '1.5rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            📊 Estadísticas de Membresías
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            <div style={{ 
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#e3f2fd',
              borderRadius: '10px',
              border: '2px solid #bbdefb'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#1976d2',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {stats.total}
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '1rem',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                📊 Total
              </p>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#e8f5e8',
              borderRadius: '10px',
              border: '2px solid #c8e6c9'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#388e3c',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {stats.activas}
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '1rem',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                ✅ Activas
              </p>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#f3f4f6',
              borderRadius: '10px',
              border: '2px solid #e5e7eb'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#6b7280',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {stats.inactivas}
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '1rem',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                ⏸️ Inactivas
              </p>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#ffeaa7',
              borderRadius: '10px',
              border: '2px solid #fdcb6e'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#d63031',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                {stats.vencidas}
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '1rem',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                ❌ Vencidas
              </p>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#e1f5fe',
              borderRadius: '10px',
              border: '2px solid #b3e5fc'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#0277bd',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                {formatMonto(stats.montoTotal)}
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '1rem',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                💰 Monto Total
              </p>
            </div>
            <div style={{ 
              textAlign: 'center',
              padding: '1rem',
              backgroundColor: '#e8f5e8',
              borderRadius: '10px',
              border: '2px solid #c8e6c9'
            }}>
              <h4 style={{ 
                margin: '0 0 0.5rem 0', 
                color: '#2e7d32',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                {formatMonto(stats.montoActivas)}
              </h4>
              <p style={{ 
                margin: 0, 
                fontSize: '1rem',
                color: '#2c3e50',
                fontWeight: '500'
              }}>
                💵 Monto Activas
              </p>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <MembresiaForm
          membresia={editingMembresia}
          usuarios={usuarios}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      )}

      <MembresiaList
        membresias={membresias}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {!loading && membresias.length === 0 && !error && usuarios.length > 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: 'white',
          borderRadius: '12px',
          marginTop: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            color: '#6c757d'
          }}>
            🧾
          </div>
          <h3 style={{ 
            color: '#495057', 
            marginBottom: '0.5rem',
            fontSize: '1.3rem'
          }}>
            ¡Comienza creando tu primera membresía!
          </h3>
          <p style={{ 
            color: '#6c757d', 
            fontSize: '1rem',
            margin: 0
          }}>
            No hay membresías registradas aún. Haz clic en "Nueva Membresía" para empezar.
          </p>
        </div>
      )}
    </div>
  );
};

export default MembresiasPage;

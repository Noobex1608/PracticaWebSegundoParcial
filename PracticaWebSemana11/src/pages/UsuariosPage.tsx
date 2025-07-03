import React, { useState, useEffect } from 'react';
import { usuarioService } from '../services/usuarioService';
import UsuarioList from '../components/UsuarioList';
import UsuarioForm from '../components/UsuarioForm';
import type { Usuario, CreateUsuarioInput } from '../types/Usuario';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (error) {
      setError(`Error al cargar usuarios: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error loading usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (usuarioData: CreateUsuarioInput) => {
    try {
      setFormLoading(true);
      setError(null);
      
      const existeCorreo = await usuarioService.existeCorreo(usuarioData.correo);
      if (existeCorreo) {
        throw new Error('Ya existe un usuario con este correo electrónico');
      }

      const newUsuario = await usuarioService.create(usuarioData);
      setUsuarios(prev => [newUsuario, ...prev]);
      setShowForm(false);
      alert('Usuario creado exitosamente');
    } catch (error) {
      setError(`Error al crear usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error creating usuario:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (usuarioData: CreateUsuarioInput) => {
    if (!editingUsuario) return;

    try {
      setFormLoading(true);
      setError(null);
      
      if (usuarioData.correo !== editingUsuario.correo) {
        const existeCorreo = await usuarioService.existeCorreo(usuarioData.correo);
        if (existeCorreo) {
          throw new Error('Ya existe un usuario con este correo electrónico');
        }
      }

      const updatedUsuario = await usuarioService.update(editingUsuario.id, usuarioData);
      setUsuarios(prev => 
        prev.map(usuario => 
          usuario.id === editingUsuario.id ? updatedUsuario : usuario
        )
      );
      setEditingUsuario(null);
      setShowForm(false);
      alert('Usuario actualizado exitosamente');
    } catch (error) {
      setError(`Error al actualizar usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error updating usuario:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await usuarioService.delete(id);
      setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      setError(`Error al eliminar usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error deleting usuario:', error);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleSubmit = (usuarioData: CreateUsuarioInput) => {
    if (editingUsuario) {
      handleUpdate(usuarioData);
    } else {
      handleCreate(usuarioData);
    }
  };

  const handleCancel = () => {
    setEditingUsuario(null);
    setShowForm(false);
    setError(null);
  };

  const handleNewUsuario = () => {
    setEditingUsuario(null);
    setShowForm(true);
    setError(null);
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
        backgroundColor: '#ffffff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ color: '#1a365d', margin: 0 }}>Gestión de Usuarios</h1>
        <button
          onClick={handleNewUsuario}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#94d3a2' : '#38a169',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(56, 161, 105, 0.2)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#2f855a';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#38a169';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          ➕ Nuevo Usuario
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fed7d7',
          color: '#742a2a',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #feb2b2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong style={{ color: '#742a2a' }}>Error:</strong> {error}
          </div>
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#742a2a',
              padding: '0.25rem',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#feb2b2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ×
          </button>
        </div>
      )}

      {showForm && (
        <div style={{ marginBottom: '2rem' }}>
          <UsuarioForm
            usuario={editingUsuario}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={formLoading}
          />
        </div>
      )}

      <UsuarioList
        usuarios={usuarios}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {!loading && usuarios.length === 0 && !error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          marginTop: '2rem',
          border: '2px dashed #cbd5e0',
          color: '#2d3748'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#2d3748', marginBottom: '1rem' }}>¡Comienza creando tu primer usuario!</h3>
          <p style={{ color: '#718096', fontSize: '1.1rem' }}>No hay usuarios registrados aún. Haz clic en "Nuevo Usuario" para empezar.</p>
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        fontSize: '0.95rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <h4 style={{ 
          color: '#2d3748', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1.1rem'
        }}>
          📊 Estadísticas de Usuarios
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ 
            backgroundColor: '#e6fffa', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #b2f5ea'
          }}>
            <p style={{ margin: 0, color: '#234e52' }}>
              <strong style={{ color: '#234e52', fontSize: '1.25rem' }}>{usuarios.length}</strong><br />
              <span style={{ fontSize: '0.9rem' }}>Total de usuarios</span>
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#fef5e7', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #f6e05e'
          }}>
            <p style={{ margin: 0, color: '#744210' }}>
              <strong style={{ color: '#744210', fontSize: '1.25rem' }}>{usuarios.filter(u => u.edad).length}</strong><br />
              <span style={{ fontSize: '0.9rem' }}>Con edad especificada</span>
            </p>
          </div>
          <div style={{ 
            backgroundColor: '#e6f3ff', 
            padding: '1rem', 
            borderRadius: '8px',
            border: '1px solid #90cdf4'
          }}>
            <p style={{ margin: 0, color: '#2c5282' }}>
              <strong style={{ color: '#2c5282', fontSize: '1.25rem' }}>{usuarios.filter(u => u.descripcion).length}</strong><br />
              <span style={{ fontSize: '0.9rem' }}>Con descripción</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;

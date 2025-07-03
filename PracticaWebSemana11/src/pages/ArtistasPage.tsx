import React, { useState, useEffect } from 'react';
import { artistaService } from '../services/artistaService';
import ArtistaList from '../components/ArtistaList';
import ArtistaForm from '../components/ArtistaForm';
import type { Artista, CreateArtistaInput } from '../types/Artista';

const ArtistasPage: React.FC = () => {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [editingArtista, setEditingArtista] = useState<Artista | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArtistas();
  }, []);

  const loadArtistas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await artistaService.getAll();
      setArtistas(data);
    } catch (error) {
      setError(`Error al cargar artistas: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error loading artistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (artistaData: CreateArtistaInput) => {
    try {
      setFormLoading(true);
      setError(null);
      const newArtista = await artistaService.create(artistaData);
      setArtistas(prev => [newArtista, ...prev]);
      setShowForm(false);
      alert('Artista creado exitosamente');
    } catch (error) {
      setError(`Error al crear artista: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error creating artista:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (artistaData: CreateArtistaInput) => {
    if (!editingArtista) return;

    try {
      setFormLoading(true);
      setError(null);
      const updatedArtista = await artistaService.update(editingArtista.id, artistaData);
      setArtistas(prev => 
        prev.map(artista => 
          artista.id === editingArtista.id ? updatedArtista : artista
        )
      );
      setEditingArtista(null);
      setShowForm(false);
      alert('Artista actualizado exitosamente');
    } catch (error) {
      setError(`Error al actualizar artista: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error updating artista:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await artistaService.delete(id);
      setArtistas(prev => prev.filter(artista => artista.id !== id));
      alert('Artista eliminado exitosamente');
    } catch (error) {
      setError(`Error al eliminar artista: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      console.error('Error deleting artista:', error);
    }
  };

  const handleEdit = (artista: Artista) => {
    setEditingArtista(artista);
    setShowForm(true);
  };

  const handleSubmit = (artistaData: CreateArtistaInput) => {
    if (editingArtista) {
      handleUpdate(artistaData);
    } else {
      handleCreate(artistaData);
    }
  };

  const handleCancel = () => {
    setEditingArtista(null);
    setShowForm(false);
    setError(null);
  };

  const handleNewArtista = () => {
    setEditingArtista(null);
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
          🎵 Gestión de Artistas
        </h1>
        <button
          onClick={handleNewArtista}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            backgroundColor: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 8px rgba(40, 167, 69, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#218838';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(40, 167, 69, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#28a745';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
            }
          }}
        >
          ➕ Nuevo Artista
        </button>
      </div>

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

      {showForm && (
        <ArtistaForm
          artista={editingArtista}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={formLoading}
        />
      )}

      <ArtistaList
        artistas={artistas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {!loading && artistas.length === 0 && !error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginTop: '2rem'
        }}>
          <h3>¡Comienza creando tu primer artista!</h3>
          <p>No hay artistas registrados aún. Haz clic en "Nuevo Artista" para empezar.</p>
        </div>
      )}
    </div>
  );
};

export default ArtistasPage;

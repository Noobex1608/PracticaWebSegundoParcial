import React, { useState, useEffect } from 'react';
import type { Artista, CreateArtistaInput } from '../types/Artista';

interface ArtistaFormProps {
  artista?: Artista | null;
  onSubmit: (artista: CreateArtistaInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ArtistaForm: React.FC<ArtistaFormProps> = ({ 
  artista, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<CreateArtistaInput>({
    nombre: '',
    bio: '',
    redessociales: {},
    generomusical: '',
    fotoUrl: ''
  });

  useEffect(() => {
    if (artista) {
      setFormData({
        nombre: artista.nombre || '',
        bio: artista.bio || '',
        redessociales: artista.redessociales || {},
        generomusical: artista.generomusical || '',
        fotoUrl: artista.fotoUrl || ''
      });
    } else {
      setFormData({
        nombre: '',
        bio: '',
        redessociales: {},
        generomusical: '',
        fotoUrl: ''
      });
    }
  }, [artista]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('redessociales.')) {
      const redSocial = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        redessociales: {
          ...prev.redessociales,
          [redSocial]: value || ''
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value || '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.generomusical.trim()) {
      alert('El género musical es obligatorio');
      return;
    }
    if (!formData.bio.trim()) {
      alert('La biografía es obligatoria');
      return;
    }

    onSubmit(formData);
  };

  const generosMusica = [
    'Rock',
    'Pop',
    'Jazz',
    'Blues',
    'Country',
    'Hip Hop',
    'Electronic',
    'Classical',
    'Reggae',
    'Folk',
    'R&B',
    'Alternative',
    'Indie',
    'Punk',
    'Metal'
  ];

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '2rem', 
      borderRadius: '12px',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid #e9ecef'
    }}>
      <h2 style={{ 
        color: '#2c3e50', 
        marginBottom: '1.5rem',
        fontSize: '1.8rem',
        fontWeight: 'bold',
        textAlign: 'center',
        borderBottom: '2px solid #e9ecef',
        paddingBottom: '1rem'
      }}>
        {artista ? '✏️ Editar Artista' : '➕ Crear Nuevo Artista'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1rem'
          }}>
            🎵 Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: '#ffffff',
              color: '#2c3e50',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1rem'
          }}>
            🎸 Género Musical *
          </label>
          <select
            name="generomusical"
            value={formData.generomusical}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: '#ffffff',
              color: '#2c3e50',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
            }}
          >
            <option value="" style={{ color: '#6c757d' }}>Selecciona un género</option>
            {generosMusica.map(genero => (
              <option key={genero} value={genero} style={{ color: '#2c3e50' }}>{genero}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1rem'
          }}>
            📝 Biografía *
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              resize: 'vertical',
              backgroundColor: '#ffffff',
              color: '#2c3e50',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box',
              lineHeight: '1.5'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1rem'
          }}>
            📷 URL de la foto
          </label>
          <input
            type="url"
            name="fotoUrl"
            value={formData.fotoUrl}
            onChange={handleChange}
            placeholder="https://ejemplo.com/foto.jpg"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: '#ffffff',
              color: '#2c3e50',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#007bff';
              e.target.style.outline = 'none';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef';
            }}
          />
        </div>

        <fieldset style={{ 
          border: '2px solid #e9ecef', 
          borderRadius: '8px', 
          padding: '1.5rem',
          marginBottom: '1.5rem',
          backgroundColor: '#f8f9fa'
        }}>
          <legend style={{ 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1.1rem',
            padding: '0 0.5rem'
          }}>
            🌐 Redes Sociales
          </legend>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              📘 Facebook
            </label>
            <input
              type="url"
              name="redessociales.facebook"
              value={formData.redessociales?.facebook || ''}
              onChange={handleChange}
              placeholder="https://facebook.com/usuario"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#2c3e50',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1877f2';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              📷 Instagram
            </label>
            <input
              type="url"
              name="redessociales.instagram"
              value={formData.redessociales?.instagram || ''}
              onChange={handleChange}
              placeholder="https://instagram.com/usuario"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#2c3e50',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e4405f';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem',
              color: '#2c3e50',
              fontWeight: '500'
            }}>
              🐦 Twitter
            </label>
            <input
              type="url"
              name="redessociales.twitter"
              value={formData.redessociales?.twitter || ''}
              onChange={handleChange}
              placeholder="https://twitter.com/usuario"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                color: '#2c3e50',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1da1f2';
                e.target.style.outline = 'none';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
              }}
            />
          </div>
        </fieldset>

        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          marginTop: '2rem'
        }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 8px rgba(40, 167, 69, 0.3)',
              transition: 'all 0.2s ease',
              minWidth: '140px'
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
            {loading ? '⏳ Guardando...' : (artista ? '✏️ Actualizar' : '➕ Crear')}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(108, 117, 125, 0.3)',
              transition: 'all 0.2s ease',
              minWidth: '140px'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#5a6268';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(108, 117, 125, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = '#6c757d';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)';
              }
            }}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArtistaForm;

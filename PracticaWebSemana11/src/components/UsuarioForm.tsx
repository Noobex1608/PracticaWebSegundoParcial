import React, { useState, useEffect } from 'react';
import type { Usuario, CreateUsuarioInput } from '../types/Usuario';

interface UsuarioFormProps {
  usuario?: Usuario | null;
  onSubmit: (usuario: CreateUsuarioInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ 
  usuario, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState<CreateUsuarioInput>({
    nombre: '',
    correo: '',
    edad: undefined,
    descripcion: undefined
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        correo: usuario.correo,
        edad: usuario.edad,
        descripcion: usuario.descripcion
      });
    }
  }, [usuario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : undefined) : (value || undefined)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (!formData.correo.trim()) {
      alert('El correo es obligatorio');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      alert('Por favor ingresa un correo válido');
      return;
    }

    if (formData.edad !== undefined && (formData.edad < 1 || formData.edad > 120)) {
      alert('La edad debe estar entre 1 y 120 años');
      return;
    }

    onSubmit(formData);
  };

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
        {usuario ? '✏️ Editar Usuario' : '➕ Crear Nuevo Usuario'}
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
            👤 Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Ingresa el nombre completo"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              color: '#2c3e50',
              backgroundColor: '#ffffff',
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
            📧 Correo Electrónico *
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            placeholder="usuario@ejemplo.com"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              color: '#2c3e50',
              backgroundColor: '#ffffff',
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
            🎂 Edad
          </label>
          <input
            type="number"
            name="edad"
            value={formData.edad || ''}
            onChange={handleChange}
            min="1"
            max="120"
            placeholder="Edad (opcional)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              color: '#2c3e50',
              backgroundColor: '#ffffff',
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

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1rem'
          }}>
            📝 Descripción
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción adicional del usuario (opcional)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              color: '#2c3e50',
              backgroundColor: '#ffffff',
              resize: 'vertical',
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
            {loading ? '⏳ Guardando...' : (usuario ? '✏️ Actualizar' : '➕ Crear')}
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

export default UsuarioForm;

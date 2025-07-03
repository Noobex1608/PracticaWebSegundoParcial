import React, { useState, useEffect } from 'react';
import type { Membresia, CreateMembresiaInput } from '../types/Membresia';
import type { Usuario } from '../types/Usuario';

interface MembresiaFormProps {
  membresia?: Membresia | null;
  usuarios: Usuario[];
  onSubmit: (membresia: CreateMembresiaInput) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MembresiaForm: React.FC<MembresiaFormProps> = ({ 
  membresia, 
  usuarios,
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  interface FormMembresiaData {
    usuarioid: string;
    monto: number;
    fechainicio: string;
    fechafin: string;
    estado: 'activa' | 'inactiva' | 'vencida';
  }

  const [formData, setFormData] = useState<FormMembresiaData>({
    usuarioid: '',
    monto: 0,
    fechainicio: '',
    fechafin: '',
    estado: 'activa'
  });

  useEffect(() => {
    if (membresia) {
      setFormData({
        usuarioid: membresia.usuarioid,
        monto: membresia.monto,
        fechainicio: membresia.fechainicio && typeof membresia.fechainicio === 'string' 
          ? membresia.fechainicio.split('T')[0] 
          : '',
        fechafin: membresia.fechafin && typeof membresia.fechafin === 'string' 
          ? membresia.fechafin.split('T')[0] 
          : '',
        estado: membresia.estado
      });
    }
  }, [membresia]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.usuarioid) {
      alert('Debes seleccionar un usuario');
      return;
    }
    if (formData.monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    if (!formData.fechainicio) {
      alert('La fecha de inicio es obligatoria');
      return;
    }
    if (!formData.fechafin) {
      alert('La fecha de fin es obligatoria');
      return;
    }
    
    const fechaInicio = new Date(formData.fechainicio);
    const fechaFin = new Date(formData.fechafin);
    
    if (fechaFin <= fechaInicio) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    const membresiaData = {
      ...formData,
      fechainicio: new Date(formData.fechainicio).toISOString(),
      fechafin: new Date(formData.fechafin).toISOString()
    };

    onSubmit(membresiaData);
  };

  const getFechaMinFin = () => {
    if (!formData.fechainicio) return '';
    const fecha = new Date(formData.fechainicio);
    fecha.setDate(fecha.getDate() + 1);
    return fecha.toISOString().split('T')[0];
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
        {membresia ? '✏️ Editar Membresía' : '➕ Crear Nueva Membresía'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '100%' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1rem'
          }}>
            👤 Usuario *
          </label>
          <select
            name="usuarioid"
            value={formData.usuarioid}
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
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          >
            <option value="">Selecciona un usuario</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} ({usuario.correo})
              </option>
            ))}
          </select>
          {usuarios.length === 0 && (
            <p style={{ 
              color: '#dc3545', 
              fontSize: '0.9rem', 
              margin: '0.5rem 0 0 0',
              fontWeight: '500',
              backgroundColor: '#f8d7da',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid #f5c6cb'
            }}>
              ⚠️ No hay usuarios disponibles. Crea un usuario primero.
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1rem'
          }}>
            💰 Monto *
          </label>
          <input
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: '#ffffff',
              color: '#2c3e50',
              transition: 'border-color 0.2s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '1rem'
            }}>
              📅 Fecha de Inicio *
            </label>
            <input
              type="date"
              name="fechainicio"
              value={formData.fechainicio}
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
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50',
              fontSize: '1rem'
            }}>
              📅 Fecha de Fin *
            </label>
            <input
              type="date"
              name="fechafin"
              value={formData.fechafin}
              onChange={handleChange}
              required
              min={getFechaMinFin()}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '1rem',
                backgroundColor: '#ffffff',
                color: '#2c3e50',
                transition: 'border-color 0.2s ease',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: 'bold',
            color: '#2c3e50',
            fontSize: '1rem'
          }}>
            📊 Estado *
          </label>
          <select
            name="estado"
            value={formData.estado}
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
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
          >
            <option value="activa">✅ Activa</option>
            <option value="inactiva">⏸️ Inactiva</option>
            <option value="vencida">❌ Vencida</option>
          </select>
        </div>

        {formData.fechainicio && formData.fechafin && (
          <div style={{ 
            marginBottom: '1.5rem', 
            padding: '1rem', 
            backgroundColor: '#e3f2fd', 
            borderRadius: '8px',
            fontSize: '1rem',
            border: '2px solid #bbdefb',
            color: '#1565c0'
          }}>
            <strong>⏱️ Duración:</strong> {
              Math.ceil((new Date(formData.fechafin).getTime() - new Date(formData.fechainicio).getTime()) / (1000 * 60 * 60 * 24))
            } días
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: '1rem',
          justifyContent: 'center',
          paddingTop: '1rem',
          borderTop: '2px solid #e9ecef'
        }}>
          <button
            type="submit"
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
              transition: 'all 0.2s ease',
              minWidth: '150px'
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
            {loading ? '⏳ Guardando...' : (membresia ? '✏️ Actualizar' : '➕ Crear')}
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
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 8px rgba(108, 117, 125, 0.3)',
              transition: 'all 0.2s ease',
              minWidth: '150px'
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

export default MembresiaForm;

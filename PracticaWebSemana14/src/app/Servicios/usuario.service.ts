import { Injectable, signal } from '@angular/core';
import { usuario } from '../interface/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios = signal<usuario[]>([
    {
      id: 1,
      nombre: 'Juan Pérez',
      email: 'juan.perez@email.com',
      fechaRegistro: new Date('2023-01-15')
    },
    {
      id: 2,
      nombre: 'María García',
      email: 'maria.garcia@email.com',
      fechaRegistro: new Date('2023-02-20')
    },
    {
      id: 3,
      nombre: 'Carlos López',
      email: 'carlos.lopez@email.com',
      fechaRegistro: new Date('2023-03-10')
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      fechaRegistro: new Date('2023-04-05')
    },
    {
      id: 5,
      nombre: 'Luis Rodríguez',
      email: 'luis.rodriguez@email.com',
      fechaRegistro: new Date('2023-05-12')
    }
  ]);

  private nextId = signal(6);

  // CREATE - Crear nuevo usuario
  createUsuario(usuario: Omit<usuario, 'id'>): usuario {
    const newUsuario: usuario = {
      ...usuario,
      id: this.nextId(),
      fechaRegistro: usuario.fechaRegistro || new Date()
    };
    
    this.usuarios.update(current => [...current, newUsuario]);
    this.nextId.update(id => id + 1);
    
    return newUsuario;
  }

  // READ - Obtener todos los usuarios
  getAllUsuarios(): usuario[] {
    return this.usuarios();
  }

  // READ - Obtener usuario por ID
  getUsuarioById(id: number): usuario | undefined {
    return this.usuarios().find(usuario => usuario.id === id);
  }

  // READ - Buscar usuarios por nombre
  searchUsuariosByNombre(nombre: string): usuario[] {
    return this.usuarios().filter(usuario => 
      usuario.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  // READ - Buscar usuario por email
  getUsuarioByEmail(email: string): usuario | undefined {
    return this.usuarios().find(usuario => usuario.email.toLowerCase() === email.toLowerCase());
  }

  // READ - Obtener usuarios registrados en un rango de fechas
  getUsuariosByFechaRange(fechaInicio: Date, fechaFin: Date): usuario[] {
    return this.usuarios().filter(usuario => {
      const fechaRegistro = new Date(usuario.fechaRegistro);
      return fechaRegistro >= fechaInicio && fechaRegistro <= fechaFin;
    });
  }

  // READ - Obtener usuarios registrados recientemente (últimos 30 días)
  getUsuariosRecientes(): usuario[] {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);
    
    return this.usuarios().filter(usuario => 
      new Date(usuario.fechaRegistro) >= fechaLimite
    );
  }

  // UPDATE - Actualizar usuario
  updateUsuario(id: number, usuarioData: Partial<Omit<usuario, 'id'>>): usuario | null {
    const usuarioIndex = this.usuarios().findIndex(usuario => usuario.id === id);
    
    if (usuarioIndex === -1) {
      return null;
    }

    const updatedUsuario = {
      ...this.usuarios()[usuarioIndex],
      ...usuarioData
    };

    this.usuarios.update(current => 
      current.map(usuario => usuario.id === id ? updatedUsuario : usuario)
    );

    return updatedUsuario;
  }

  // DELETE - Eliminar usuario
  deleteUsuario(id: number): boolean {
    const initialLength = this.usuarios().length;
    
    this.usuarios.update(current => 
      current.filter(usuario => usuario.id !== id)
    );

    return this.usuarios().length < initialLength;
  }

  // UTILITY - Verificar si email ya existe
  emailExists(email: string, excludeId?: number): boolean {
    return this.usuarios().some(usuario => 
      usuario.email.toLowerCase() === email.toLowerCase() && 
      usuario.id !== excludeId
    );
  }

  // UTILITY - Obtener estadísticas de usuarios
  getUsuariosStats() {
    const usuarios = this.usuarios();
    const totalUsuarios = usuarios.length;
    
    // Usuarios por mes
    const usuariosPorMes = usuarios.reduce((acc, usuario) => {
      const mes = new Date(usuario.fechaRegistro).toISOString().slice(0, 7); // YYYY-MM
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Dominios de email más comunes
    const dominios = usuarios.map(usuario => usuario.email.split('@')[1]);
    const dominioStats = dominios.reduce((acc, dominio) => {
      acc[dominio] = (acc[dominio] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalUsuarios,
      usuariosPorMes,
      dominioStats,
      usuariosRecientes: this.getUsuariosRecientes().length
    };
  }
}

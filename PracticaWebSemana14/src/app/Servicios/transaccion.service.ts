import { Injectable, signal } from '@angular/core';
import { transaccion } from '../interface/transaccion.interface';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {
  private transacciones = signal<transaccion[]>([
    {
      id: 1,
      usuarioId: 1,
      tipo: 'compra',
      cantidad: 5,
      fecha: new Date('2024-01-15'),
      montoTotal: 250.00,
      estado: 'completada'
    },
    {
      id: 2,
      usuarioId: 2,
      tipo: 'venta',
      cantidad: 3,
      fecha: new Date('2024-02-20'),
      montoTotal: 180.00,
      estado: 'completada'
    },
    {
      id: 3,
      usuarioId: 1,
      tipo: 'compra',
      cantidad: 2,
      fecha: new Date('2024-03-10'),
      montoTotal: 120.00,
      estado: 'pendiente'
    },
    {
      id: 4,
      usuarioId: 3,
      tipo: 'venta',
      cantidad: 7,
      fecha: new Date('2024-04-05'),
      montoTotal: 420.00,
      estado: 'completada'
    },
    {
      id: 5,
      usuarioId: 2,
      tipo: 'compra',
      cantidad: 1,
      fecha: new Date('2024-05-12'),
      montoTotal: 75.00,
      estado: 'cancelada'
    }
  ]);

  private nextId = signal(6);

  // CREATE - Crear nueva transacción
  createTransaccion(transaccion: Omit<transaccion, 'id'>): transaccion {
    const newTransaccion: transaccion = {
      ...transaccion,
      id: this.nextId(),
      fecha: transaccion.fecha || new Date(),
      estado: transaccion.estado || 'pendiente'
    };
    
    this.transacciones.update(current => [...current, newTransaccion]);
    this.nextId.update(id => id + 1);
    
    return newTransaccion;
  }

  // READ - Obtener todas las transacciones
  getAllTransacciones(): transaccion[] {
    return this.transacciones();
  }

  // READ - Obtener transacción por ID
  getTransaccionById(id: number): transaccion | undefined {
    return this.transacciones().find(transaccion => transaccion.id === id);
  }

  // READ - Obtener transacciones por usuario
  getTransaccionesByUsuario(usuarioId: number): transaccion[] {
    return this.transacciones().filter(transaccion => transaccion.usuarioId === usuarioId);
  }

  // READ - Filtrar transacciones por tipo
  getTransaccionesByTipo(tipo: 'compra' | 'venta'): transaccion[] {
    return this.transacciones().filter(transaccion => transaccion.tipo === tipo);
  }

  // READ - Filtrar transacciones por estado
  getTransaccionesByEstado(estado: 'pendiente' | 'completada' | 'cancelada'): transaccion[] {
    return this.transacciones().filter(transaccion => transaccion.estado === estado);
  }

  // READ - Obtener transacciones en un rango de fechas
  getTransaccionesByFechaRange(fechaInicio: Date, fechaFin: Date): transaccion[] {
    return this.transacciones().filter(transaccion => {
      const fechaTransaccion = new Date(transaccion.fecha);
      return fechaTransaccion >= fechaInicio && fechaTransaccion <= fechaFin;
    });
  }

  // READ - Obtener transacciones por rango de monto
  getTransaccionesByMontoRange(montoMin: number, montoMax: number): transaccion[] {
    return this.transacciones().filter(transaccion => 
      transaccion.montoTotal >= montoMin && transaccion.montoTotal <= montoMax
    );
  }

  // UPDATE - Actualizar transacción
  updateTransaccion(id: number, transaccionData: Partial<Omit<transaccion, 'id'>>): transaccion | null {
    const transaccionIndex = this.transacciones().findIndex(transaccion => transaccion.id === id);
    
    if (transaccionIndex === -1) {
      return null;
    }

    const updatedTransaccion = {
      ...this.transacciones()[transaccionIndex],
      ...transaccionData
    };

    this.transacciones.update(current => 
      current.map(transaccion => transaccion.id === id ? updatedTransaccion : transaccion)
    );

    return updatedTransaccion;
  }

  // UPDATE - Cambiar estado de transacción
  updateEstadoTransaccion(id: number, nuevoEstado: 'pendiente' | 'completada' | 'cancelada'): transaccion | null {
    return this.updateTransaccion(id, { estado: nuevoEstado });
  }

  // DELETE - Eliminar transacción
  deleteTransaccion(id: number): boolean {
    const initialLength = this.transacciones().length;
    
    this.transacciones.update(current => 
      current.filter(transaccion => transaccion.id !== id)
    );

    return this.transacciones().length < initialLength;
  }

  // UTILITY - Obtener estadísticas de transacciones
  getTransaccionesStats() {
    const transacciones = this.transacciones();
    const totalTransacciones = transacciones.length;
    
    // Estadísticas por tipo
    const compras = transacciones.filter(t => t.tipo === 'compra');
    const ventas = transacciones.filter(t => t.tipo === 'venta');
    
    // Estadísticas por estado
    const pendientes = transacciones.filter(t => t.estado === 'pendiente');
    const completadas = transacciones.filter(t => t.estado === 'completada');
    const canceladas = transacciones.filter(t => t.estado === 'cancelada');
    
    // Montos totales
    const montoTotalCompras = compras.reduce((sum, t) => sum + t.montoTotal, 0);
    const montoTotalVentas = ventas.reduce((sum, t) => sum + t.montoTotal, 0);
    const montoTotalGeneral = transacciones.reduce((sum, t) => sum + t.montoTotal, 0);
    
    // Promedios
    const montoPromedio = montoTotalGeneral / totalTransacciones;
    const cantidadPromedio = transacciones.reduce((sum, t) => sum + t.cantidad, 0) / totalTransacciones;

    return {
      total: totalTransacciones,
      tipoStats: {
        compras: compras.length,
        ventas: ventas.length
      },
      estadoStats: {
        pendientes: pendientes.length,
        completadas: completadas.length,
        canceladas: canceladas.length
      },
      montoStats: {
        totalCompras: montoTotalCompras,
        totalVentas: montoTotalVentas,
        totalGeneral: montoTotalGeneral,
        promedio: Math.round(montoPromedio * 100) / 100
      },
      cantidadPromedio: Math.round(cantidadPromedio * 100) / 100,
      transaccionMasAlta: Math.max(...transacciones.map(t => t.montoTotal)),
      transaccionMasBaja: Math.min(...transacciones.map(t => t.montoTotal))
    };
  }

  // UTILITY - Obtener balance de usuario
  getBalanceUsuario(usuarioId: number) {
    const transaccionesUsuario = this.getTransaccionesByUsuario(usuarioId);
    const compras = transaccionesUsuario.filter(t => t.tipo === 'compra' && t.estado === 'completada');
    const ventas = transaccionesUsuario.filter(t => t.tipo === 'venta' && t.estado === 'completada');
    
    const totalCompras = compras.reduce((sum, t) => sum + t.montoTotal, 0);
    const totalVentas = ventas.reduce((sum, t) => sum + t.montoTotal, 0);
    const balance = totalVentas - totalCompras;

    return {
      totalCompras,
      totalVentas,
      balance,
      cantidadTransacciones: transaccionesUsuario.length,
      transaccionesPendientes: transaccionesUsuario.filter(t => t.estado === 'pendiente').length
    };
  }
}

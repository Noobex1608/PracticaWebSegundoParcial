import type { Usuario } from './usuario'


export interface Transaccion {
    id: number;
    usuarioId: number;
    usuario?: Usuario; 
    monto: number;
    tipo: 'compra' | 'venta' | 'suscripcion' | 'reembolso';
    descripcion: string;
    fechaTransaccion: Date;
    estado: 'pendiente' | 'completada' | 'fallida' | 'cancelada';
    metodoPago: string;
}
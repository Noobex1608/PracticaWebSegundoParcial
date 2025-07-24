export interface transaccion {
    id: number;
    usuarioId: number;
    tipo: 'compra' | 'venta';
    cantidad: number;
    fecha: Date;
    montoTotal: number; // Monto total de la transacción
    estado: 'pendiente' | 'completada' | 'cancelada';
}

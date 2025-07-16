
export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    contraseña: string;
    fechaRegistro: Date;
    activo: boolean;
}
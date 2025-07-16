import type { Usuario } from './usuario'


export interface Cancion {
    id: number;
    nombre: string;
    artista: string;
    album: string;
    duracion: number; 
    genero: string;
    fechaLanzamiento: Date;
    usuarioId: number;
    usuario?: Usuario; 
    disponible: boolean;
}
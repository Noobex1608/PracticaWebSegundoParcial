export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  edad?: number;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateUsuarioInput = Omit<Usuario, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUsuarioInput = Partial<CreateUsuarioInput>;

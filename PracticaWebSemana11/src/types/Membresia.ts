export interface Membresia {
  id: string;
  usuarioid: string;
  monto: number;
  fechainicio: string | null;
  fechafin: string | null;
  estado: 'activa' | 'inactiva' | 'vencida';
  created_at?: string;
  updated_at?: string;
}

export type CreateMembresiaInput = Omit<Membresia, 'id' | 'created_at' | 'updated_at'>;
export type UpdateMembresiaInput = Partial<CreateMembresiaInput>;

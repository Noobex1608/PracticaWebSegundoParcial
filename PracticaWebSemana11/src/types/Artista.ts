export interface RedesSociales {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface Artista {
  id: string;
  nombre: string;
  bio: string;
  redessociales?: RedesSociales;
  generomusical: string;
  fotoUrl: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateArtistaInput = Omit<Artista, 'id' | 'created_at' | 'updated_at'>;
export type UpdateArtistaInput = Partial<CreateArtistaInput>;

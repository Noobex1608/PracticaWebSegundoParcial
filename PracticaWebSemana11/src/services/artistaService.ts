import { supabase } from './supabaseConfig';
import type { Artista, CreateArtistaInput, UpdateArtistaInput } from '../types/Artista';

export const artistaService = {
  async getAll(): Promise<Artista[]> {
    const { data, error } = await supabase
      .from('artistas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener artistas: ${error.message}`);
    }

    return data || [];
  },

  async getById(id: string): Promise<Artista | null> {
    const { data, error } = await supabase
      .from('artistas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error al obtener artista: ${error.message}`);
    }

    return data;
  },

  async create(artista: CreateArtistaInput): Promise<Artista> {
    const { data, error } = await supabase
      .from('artistas')
      .insert([artista])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear artista: ${error.message}`);
    }

    return data;
  },

  async update(id: string, artista: UpdateArtistaInput): Promise<Artista> {
    const { data, error } = await supabase
      .from('artistas')
      .update(artista)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar artista: ${error.message}`);
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('artistas')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar artista: ${error.message}`);
    }
  },

  async getByGenero(genero: string): Promise<Artista[]> {
    const { data, error } = await supabase
      .from('artistas')
      .select('*')
      .ilike('generoMusical', `%${genero}%`)
      .order('nombre');

    if (error) {
      throw new Error(`Error al buscar artistas por género: ${error.message}`);
    }

    return data || [];
  }
};

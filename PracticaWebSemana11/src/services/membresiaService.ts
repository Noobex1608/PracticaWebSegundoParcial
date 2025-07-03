import { supabase } from './supabaseConfig';
import type { Membresia, CreateMembresiaInput, UpdateMembresiaInput } from '../types/Membresia';

export const membresiaService = {
  async getAll(): Promise<Membresia[]> {
    const { data, error } = await supabase
      .from('membresias')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener membresías: ${error.message}`);
    }

    return data || [];
  },

  async getById(id: string): Promise<Membresia | null> {
    const { data, error } = await supabase
      .from('membresias')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error al obtener membresía: ${error.message}`);
    }

    return data;
  },

  async create(membresia: CreateMembresiaInput): Promise<Membresia> {
    const { data, error } = await supabase
      .from('membresias')
      .insert([membresia])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear membresía: ${error.message}`);
    }

    return data;
  },

  async update(id: string, membresia: UpdateMembresiaInput): Promise<Membresia> {
    const { data, error } = await supabase
      .from('membresias')
      .update(membresia)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar membresía: ${error.message}`);
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('membresias')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar membresía: ${error.message}`);
    }
  },

  async getByUsuario(usuarioId: string): Promise<Membresia[]> {
    const { data, error } = await supabase
      .from('membresias')
      .select('*')
      .eq('usuarioId', usuarioId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener membresías del usuario: ${error.message}`);
    }

    return data || [];
  },

  async getActivas(): Promise<Membresia[]> {
    const { data, error } = await supabase
      .from('membresias')
      .select('*')
      .eq('estado', 'activa')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener membresías activas: ${error.message}`);
    }

    return data || [];
  },

  async getAllWithUsuario() {
    const { data, error } = await supabase
      .from('membresias')
      .select(`
        *,
        usuarios (
          id,
          nombre,
          correo
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener membresías con usuarios: ${error.message}`);
    }

    return data || [];
  }
};

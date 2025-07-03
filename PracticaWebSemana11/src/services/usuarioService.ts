import { supabase } from './supabaseConfig';
import type { Usuario, CreateUsuarioInput, UpdateUsuarioInput } from '../types/Usuario';

export const usuarioService = {
  async getAll(): Promise<Usuario[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }

    return data || [];
  },

  async getById(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }

    return data;
  },

  async create(usuario: CreateUsuarioInput): Promise<Usuario> {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([usuario])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear usuario: ${error.message}`);
    }

    return data;
  },

  async update(id: string, usuario: UpdateUsuarioInput): Promise<Usuario> {
    const { data, error } = await supabase
      .from('usuarios')
      .update(usuario)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`);
    }

    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }
  },

  async getByCorreo(correo: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('correo', correo)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error al buscar usuario por correo: ${error.message}`);
    }

    return data;
  },

  async existeCorreo(correo: string): Promise<boolean> {
    const usuario = await this.getByCorreo(correo);
    return usuario !== null;
  }
};

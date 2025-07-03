import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-clave-publica-anonima';

if (!SUPABASE_URL || SUPABASE_URL === 'https://tu-proyecto.supabase.co') {
  console.warn('⚠️  SUPABASE_URL no está configurada. Por favor, configura VITE_SUPABASE_URL en tu archivo .env');
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY === 'tu-clave-publica-anonima') {
  console.warn('⚠️  SUPABASE_ANON_KEY no está configurada. Por favor, configura VITE_SUPABASE_ANON_KEY en tu archivo .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const API_URLS = {
  ARTISTAS: `${SUPABASE_URL}/rest/v1/artistas`,
  MEMBRESIAS: `${SUPABASE_URL}/rest/v1/membresias`,
  USUARIOS: `${SUPABASE_URL}/rest/v1/usuarios`,
};

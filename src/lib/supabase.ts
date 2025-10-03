import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Style {
  id: string;
  category: string;
  name: string;
  value: string;
  description?: string;
  css_class?: string;
  created_at: string;
  updated_at: string;
}

export interface Dream {
  id: string;
  user_id?: string;
  title: string;
  photo_url?: string;
  video_url?: string;
  video_status?: string;
  video_prompt?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

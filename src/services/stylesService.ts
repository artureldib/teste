import { supabase, Style } from '../lib/supabase';

export const stylesService = {
  async getAllStyles(): Promise<Style[]> {
    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch styles: ${error.message}`);
    }

    return data || [];
  },

  async getStylesByCategory(category: string): Promise<Style[]> {
    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .eq('category', category)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch styles by category: ${error.message}`);
    }

    return data || [];
  },

  async createStyle(style: Omit<Style, 'id' | 'created_at' | 'updated_at'>): Promise<Style> {
    const { data, error } = await supabase
      .from('styles')
      .insert([style])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create style: ${error.message}`);
    }

    return data;
  },

  async updateStyle(id: string, updates: Partial<Omit<Style, 'id' | 'created_at' | 'updated_at'>>): Promise<Style> {
    const { data, error } = await supabase
      .from('styles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update style: ${error.message}`);
    }

    return data;
  },

  async deleteStyle(id: string): Promise<void> {
    const { error } = await supabase
      .from('styles')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete style: ${error.message}`);
    }
  },

  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('styles')
      .select('category')
      .order('category', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    const uniqueCategories = [...new Set(data?.map(item => item.category) || [])];
    return uniqueCategories;
  },
};

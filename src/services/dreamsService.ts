import { supabase, Dream } from '../lib/supabase';
import { videoGenerationService } from './videoGenerationService';

export const dreamsService = {
  async getUserDream(): Promise<Dream | null> {
    const { data, error } = await supabase
      .from('dreams')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createDream(title: string, photoFile?: File): Promise<Dream> {
    let photoUrl: string | undefined;

    if (photoFile) {
      const photoPath = `${Date.now()}-${photoFile.name}`;
      const { error: photoError } = await supabase.storage
        .from('dream-photos')
        .upload(photoPath, photoFile);

      if (photoError) throw photoError;

      const { data: photoData } = supabase.storage
        .from('dream-photos')
        .getPublicUrl(photoPath);

      photoUrl = photoData.publicUrl;
    }

    const enrichedPrompt = await videoGenerationService.enrichPrompt(title);

    const { data, error } = await supabase
      .from('dreams')
      .insert({
        title,
        photo_url: photoUrl,
        video_status: 'generating',
        video_prompt: enrichedPrompt,
        user_id: null,
      })
      .select()
      .single();

    if (error) throw error;

    this.generateVideoAsync(data.id, title, photoUrl);

    return data;
  },

  async generateVideoAsync(dreamId: string, description: string, photoUrl?: string): Promise<void> {
    try {
      const videoUrl = await videoGenerationService.generateVideo({
        dreamDescription: description,
        photoUrl,
      });

      await supabase
        .from('dreams')
        .update({
          video_url: videoUrl,
          video_status: 'completed',
        })
        .eq('id', dreamId);
    } catch (err) {
      await supabase
        .from('dreams')
        .update({
          video_status: 'failed',
          error_message: err instanceof Error ? err.message : 'Video generation failed',
        })
        .eq('id', dreamId);
    }
  },

  async updateDream(id: string, title: string, photoFile?: File): Promise<Dream> {
    let photoUrl: string | undefined;

    if (photoFile) {
      const photoPath = `${Date.now()}-${photoFile.name}`;
      const { error: photoError } = await supabase.storage
        .from('dream-photos')
        .upload(photoPath, photoFile);

      if (photoError) throw photoError;

      const { data: photoData } = supabase.storage
        .from('dream-photos')
        .getPublicUrl(photoPath);

      photoUrl = photoData.publicUrl;
    }

    const enrichedPrompt = await videoGenerationService.enrichPrompt(title);

    const updateData: any = {
      title,
      video_status: 'generating',
      video_prompt: enrichedPrompt,
    };
    if (photoUrl) updateData.photo_url = photoUrl;

    const { data, error } = await supabase
      .from('dreams')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    this.generateVideoAsync(id, title, photoUrl);

    return data;
  },

  async deleteDream(id: string): Promise<void> {
    const { error } = await supabase
      .from('dreams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

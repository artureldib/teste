import { supabase, Dream } from '../lib/supabase';

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

  async createDream(title: string, photoFile?: File, videoFile?: File): Promise<Dream> {
    let photoUrl: string | undefined;
    let videoUrl: string | undefined;

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

    if (videoFile) {
      const videoPath = `${Date.now()}-${videoFile.name}`;
      const { error: videoError } = await supabase.storage
        .from('dream-videos')
        .upload(videoPath, videoFile);

      if (videoError) throw videoError;

      const { data: videoData } = supabase.storage
        .from('dream-videos')
        .getPublicUrl(videoPath);

      videoUrl = videoData.publicUrl;
    }

    const { data, error } = await supabase
      .from('dreams')
      .insert({
        title,
        photo_url: photoUrl,
        video_url: videoUrl,
        user_id: null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateDream(id: string, title: string, photoFile?: File, videoFile?: File): Promise<Dream> {
    let photoUrl: string | undefined;
    let videoUrl: string | undefined;

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

    if (videoFile) {
      const videoPath = `${Date.now()}-${videoFile.name}`;
      const { error: videoError } = await supabase.storage
        .from('dream-videos')
        .upload(videoPath, videoFile);

      if (videoError) throw videoError;

      const { data: videoData } = supabase.storage
        .from('dream-videos')
        .getPublicUrl(videoPath);

      videoUrl = videoData.publicUrl;
    }

    const updateData: any = { title };
    if (photoUrl) updateData.photo_url = photoUrl;
    if (videoUrl) updateData.video_url = videoUrl;

    const { data, error } = await supabase
      .from('dreams')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
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

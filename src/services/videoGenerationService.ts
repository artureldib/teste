interface VideoGenerationParams {
  dreamDescription: string;
  photoUrl?: string;
}

export const videoGenerationService = {
  async enrichPrompt(dreamDescription: string): Promise<string> {
    const enrichedPrompt = `Create a cinematic, inspirational video showing: ${dreamDescription}.
Style: Cinematic, dreamlike, and motivational.
Camera: Smooth, professional camera movements with dynamic angles.
Atmosphere: Warm, inspiring lighting with vibrant colors.
Duration: 15-30 seconds loop-friendly sequence.
Quality: High-definition, professional cinematography.`;

    return enrichedPrompt;
  },

  async generateVideo(params: VideoGenerationParams): Promise<string> {
    const enrichedPrompt = await this.enrichPrompt(params.dreamDescription);

    console.log('Enriched prompt:', enrichedPrompt);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    return mockVideoUrl;
  },

  async pollGenerationStatus(dreamId: string): Promise<'pending' | 'generating' | 'completed' | 'failed'> {
    return 'completed';
  },
};

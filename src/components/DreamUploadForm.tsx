import { useState } from 'react';
import { dreamsService } from '../services/dreamsService';
import { Dream } from '../lib/supabase';

interface DreamUploadFormProps {
  onDreamCreated: (dream: Dream) => void;
  onCancel?: () => void;
}

export function DreamUploadForm({ onDreamCreated, onCancel }: DreamUploadFormProps) {
  const [title, setTitle] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Please describe your dream');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const dream = await dreamsService.createDream(title, photoFile || undefined);
      onDreamCreated(dream);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dream');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-card border border-muted rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-foreground mb-2">Create Your Dream</h2>
      <p className="text-muted-foreground mb-6">
        Describe your dream and we'll create a cinematic video to inspire you every day
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
            Describe Your Dream <span className="text-red-500">*</span>
          </label>
          <textarea
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Traveling to Rome, exploring ancient ruins and eating authentic Italian food under the sunset..."
            rows={4}
            className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground resize-none"
            disabled={loading}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Be specific and vivid. We'll enrich your description to create a cinematic experience.
          </p>
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-foreground mb-2">
            Your Photo (Optional)
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full px-4 py-3 bg-background border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600"
            disabled={loading}
          />
          {photoPreview && (
            <div className="mt-4">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-muted"
              />
            </div>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a photo to personalize your dream video
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? 'Creating Your Dream...' : 'Generate Cinematic Video'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-muted disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

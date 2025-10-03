import { useEffect, useState } from 'react';
import { dreamsService } from '../services/dreamsService';
import { Dream } from '../lib/supabase';
import { ImmersiveDreamVideo } from '../components/ImmersiveDreamVideo';
import { DreamUploadForm } from '../components/DreamUploadForm';

export default function Home() {
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadDream();
  }, []);

  const loadDream = async () => {
    try {
      setLoading(true);
      const userDream = await dreamsService.getUserDream();
      setDream(userDream);
      setShowForm(!userDream);
    } catch (err) {
      console.error('Failed to load dream:', err);
      setShowForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDreamCreated = (newDream: Dream) => {
    setDream(newDream);
    setShowForm(false);
  };

  const handleEdit = () => {
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-foreground mb-2">Loading your dream...</div>
          <div className="text-muted-foreground">Preparing your motivational experience</div>
        </div>
      </div>
    );
  }

  if (showForm || !dream) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <DreamUploadForm
          onDreamCreated={handleDreamCreated}
          onCancel={dream ? () => setShowForm(false) : undefined}
        />
      </div>
    );
  }

  return <ImmersiveDreamVideo dream={dream} onEdit={handleEdit} />;
}

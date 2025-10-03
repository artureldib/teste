import { useEffect, useState } from 'react';
import { stylesService } from '../services/stylesService';
import { Style } from '../lib/supabase';

export default function Styleguide() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadStyles();
  }, []);

  const loadStyles = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allStyles, allCategories] = await Promise.all([
        stylesService.getAllStyles(),
        stylesService.getCategories(),
      ]);
      setStyles(allStyles);
      setCategories(allCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load styles');
    } finally {
      setLoading(false);
    }
  };

  const filteredStyles = selectedCategory === 'all'
    ? styles
    : styles.filter(style => style.category === selectedCategory);

  const groupedStyles = filteredStyles.reduce((acc, style) => {
    if (!acc[style.category]) {
      acc[style.category] = [];
    }
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, Style[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-muted-foreground">Loading styles...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-500">Error: {error}</div>
          <button
            onClick={loadStyles}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-auto block"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Design System Styleguide</h1>
          <p className="text-muted-foreground">
            Complete color and typography scales synced with the database
          </p>
        </div>

        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {styles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No styles found in the database</p>
            <p className="text-sm text-muted-foreground">
              Add styles to the database to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedStyles).map(([category, categoryStyles]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-foreground mb-4 capitalize">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryStyles.map(style => (
                    <div
                      key={style.id}
                      className="border border-muted rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{style.name}</h3>
                        {style.css_class && (
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {style.css_class}
                          </code>
                        )}
                      </div>

                      {category === 'color' && (
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-12 h-12 rounded border border-muted"
                            style={{ backgroundColor: style.value }}
                          />
                          <code className="text-sm text-muted-foreground">{style.value}</code>
                        </div>
                      )}

                      {category === 'typography' && (
                        <div className="mb-2">
                          <div
                            className="text-foreground mb-1"
                            style={{ fontSize: style.value }}
                          >
                            The quick brown fox
                          </div>
                          <code className="text-sm text-muted-foreground">{style.value}</code>
                        </div>
                      )}

                      {category !== 'color' && category !== 'typography' && (
                        <div className="mb-2">
                          <code className="text-sm text-muted-foreground">{style.value}</code>
                        </div>
                      )}

                      {style.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {style.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

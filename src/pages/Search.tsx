import React, { useState } from 'react';
import { Search as SearchIcon, ListPlus, Play, Heart, Loader2 } from 'lucide-react';
import { searchYouTube, YouTubeSearchResult } from '../services/youtube';
import { usePlayerStore } from '../store/usePlayerStore';
import { PlaylistSelector } from '../components/PlaylistSelector';
import styles from './Search.module.css';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToQueue, playSong, toggleFavorite, favorites } = usePlayerStore();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const data = await searchYouTube(query);
    setResults(data);
    setLoading(false);
  };

  const isFavorite = (id: string) => {
    return favorites.some(f => f.id === id);
  };

  return (
    <div className={styles.searchContainer}>
      <header className={styles.header}>
        <h1 className="text-gradient">Find Your Song</h1>
        <p>Search standard Youtube tracking prioritizing Karaoke versions automatically.</p>
        
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={`${styles.inputWrapper} glass-panel`}>
            <SearchIcon className={styles.searchIcon} size={24} />
            <input 
              type="text" 
              placeholder="Search for a song or artist..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className={styles.searchBtn} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={24} /> : 'Search'}
            </button>
          </div>
        </form>
      </header>

      <div className={styles.resultsArea}>
        {loading && <div className={styles.loadingState}>Searching YouTube for the best versions...</div>}
        
        {!loading && results.length > 0 && (
          <div className={styles.resultsList}>
            {results.map((song) => (
              <div key={song.id} className={`${styles.resultCard} glass-panel animate-fade-in`}>
                <div className={styles.thumbnailWrapper} onClick={() => playSong({ ...song, addedAt: Date.now() })}>
                  <img src={song.thumbnail} alt={song.title} />
                  <div className={styles.playOverlay}>
                    <Play size={32} fill="white" />
                  </div>
                </div>
                
                <div className={styles.songInfo}>
                  <h3 dangerouslySetInnerHTML={{ __html: song.title }}></h3>
                  <p>{song.channelTitle}</p>
                </div>
                
                <div className={styles.actionButtons}>
                  <PlaylistSelector song={song} />
                  <button 
                    className={`${styles.actionBtn} ${isFavorite(song.id) ? styles.activeHeart : ''}`}
                    onClick={() => toggleFavorite(song)}
                    title="Toggle Favorite"
                  >
                    <Heart size={20} fill={isFavorite(song.id) ? "var(--accent-primary)" : "none"} />
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.primaryAction}`}
                    onClick={() => addToQueue(song)}
                    title="Add to Queue"
                  >
                    <ListPlus size={20} />
                    <span>Add to Queue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && query && results.length === 0 && (
          <div className={styles.emptyState}>
            <p>No results found for "{query}". Try a different search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Heart, Play, ListPlus, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { PlaylistSelector } from '../components/PlaylistSelector';
import styles from './SharedList.module.css';

export const Favorites: React.FC = () => {
  const { favorites, playSong, addToQueue, toggleFavorite } = usePlayerStore();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Heart size={32} fill="var(--accent-primary)" color="var(--accent-primary)" />
          <h1 className="text-gradient">Your Favorites</h1>
        </div>
        <p>Your all-time favorite karaoke tracks.</p>
      </header>

      {favorites.length > 0 ? (
        <div className={styles.grid}>
          {favorites.map((song) => (
            <div key={`fav-${song.id}`} className={`${styles.card} glass-panel animate-fade-in`}>
              <div className={styles.thumbnailWrapper} onClick={() => playSong(song)}>
                <img src={song.thumbnail} alt={song.title} />
                <div className={styles.playOverlay}>
                  <Play size={32} fill="white" />
                </div>
              </div>
              
              <div className={styles.info}>
                <h4 dangerouslySetInnerHTML={{ __html: song.title }}></h4>
                <p>{song.channelTitle}</p>
              </div>
              
              <div className={styles.actions}>
                <PlaylistSelector song={song} />
                <button 
                  className={styles.iconBtn} 
                  onClick={() => addToQueue(song)}
                  title="Add to Queue"
                >
                  <ListPlus size={20} />
                </button>
                <button 
                  className={`${styles.iconBtn} ${styles.dangerBtn}`} 
                  onClick={() => toggleFavorite(song)}
                  title="Remove from Favorites"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Heart size={48} className={styles.emptyIcon} />
          <h2>No favorites yet</h2>
          <p>Click the heart icon on any song to add it to your favorites.</p>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { History as HistoryIcon, Play, ListPlus, Trash2 } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { PlaylistSelector } from '../components/PlaylistSelector';
import styles from './SharedList.module.css';

export const History: React.FC = () => {
  const { history, playSong, addToQueue, clearHistory } = usePlayerStore();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <HistoryIcon size={32} color="var(--text-secondary)" />
          <h1 className="text-gradient">Recently Played</h1>
        </div>
        <p>Songs you've sung recently.</p>
        
        {history.length > 0 && (
          <button className={styles.clearBtn} onClick={clearHistory}>
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </header>

      {history.length > 0 ? (
        <div className={styles.grid}>
          {history.map((song, index) => (
            <div key={`hist-${song.id}-${index}`} className={`${styles.card} glass-panel animate-fade-in`}>
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
                  className={styles.primaryBtn} 
                  onClick={() => addToQueue(song)}
                >
                  <ListPlus size={18} />
                  Add to Queue
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <HistoryIcon size={48} className={styles.emptyIcon} />
          <h2>No history yet</h2>
          <p>Songs you play will appear here.</p>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Play, Heart } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { history, favorites, playSong } = usePlayerStore();

  const handlePlayQuick = (song: any) => {
    playSong(song);
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className="text-gradient">Sing Your Heart Out</h1>
          <p>Find your favorite karaoke tracks powered by YouTube and start singing instantly.</p>
          <button 
            className={styles.ctaButton}
            onClick={() => navigate('/search')}
          >
            <Search size={20} />
            Find a Song
          </button>
        </div>
      </header>

      {history.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Recently Played</h2>
          <div className={styles.gridContainer}>
            {history.slice(0, 4).map((song) => (
              <div key={`history-${song.id}`} className={`${styles.songCard} glass-panel animate-fade-in`}>
                <div className={styles.thumbnailWrapper}>
                  <img src={song.thumbnail} alt={song.title} />
                  <button 
                    className={styles.playOverlay}
                    onClick={() => handlePlayQuick(song)}
                  >
                    <Play size={32} fill="white" />
                  </button>
                </div>
                <div className={styles.songInfo}>
                  <h4 title={song.title}>{song.title}</h4>
                  <p>{song.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {favorites.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}><Heart size={20} className={styles.iconHeart} /> Your Favorites</h2>
            <button className={styles.seeAllBtn} onClick={() => navigate('/favorites')}>See All</button>
          </div>
          <div className={styles.gridContainer}>
            {favorites.slice(0, 4).map((song) => (
              <div key={`fav-${song.id}`} className={`${styles.songCard} glass-panel animate-fade-in`}>
                <div className={styles.thumbnailWrapper}>
                  <img src={song.thumbnail} alt={song.title} />
                  <button 
                    className={styles.playOverlay}
                    onClick={() => handlePlayQuick(song)}
                  >
                    <Play size={32} fill="white" />
                  </button>
                </div>
                <div className={styles.songInfo}>
                  <h4 title={song.title}>{song.title}</h4>
                  <p>{song.channelTitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {history.length === 0 && favorites.length === 0 && (
        <div className={styles.emptyState}>
          <h3>Ready to start?</h3>
          <p>Search for a song or artist to begin your karaoke session.</p>
        </div>
      )}
    </div>
  );
};

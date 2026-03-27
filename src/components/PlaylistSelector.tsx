import React, { useState, useRef, useEffect } from 'react';
import { FolderPlus, Check } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { YouTubeSearchResult } from '../services/youtube';
import styles from './PlaylistSelector.module.css';

interface Props {
  song: YouTubeSearchResult;
}

export const PlaylistSelector: React.FC<Props> = ({ song }) => {
  const { playlists, addSongToPlaylist } = usePlayerStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Removed early return so the button is always visible

  const handleSelect = (playlistId: string) => {
    addSongToPlaylist(playlistId, song);
    setIsOpen(false);
  };

  const isInPlaylist = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    return playlist?.songs.some(s => s.id === song.id);
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <button 
        className={styles.triggerBtn} 
        onClick={() => setIsOpen(!isOpen)}
        title="Save to Playlist"
      >
        <FolderPlus size={20} />
      </button>

      {isOpen && (
        <div className={`${styles.dropdown} glass-panel animate-fade-in`}>
          <div className={styles.dropdownHeader}>Select Playlist</div>
          <div className={styles.playlistList}>
            {playlists.length === 0 ? (
              <div style={{ padding: '16px', fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                No playlists yet.<br/>Create one on the Playlists page!
              </div>
            ) : (
              playlists.map((playlist) => {
                const added = isInPlaylist(playlist.id);
                return (
                  <button
                    key={playlist.id}
                    className={styles.playlistItem}
                    onClick={() => !added && handleSelect(playlist.id)}
                    disabled={added}
                  >
                    <span className={styles.playlistName}>{playlist.name}</span>
                    {added && <Check size={16} color="var(--accent-primary)" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

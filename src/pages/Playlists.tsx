import React, { useState } from 'react';
import { Music, Plus, Trash2, Play, ListPlus, ChevronLeft } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import styles from './Playlists.module.css';
import sharedStyles from './SharedList.module.css';

export const Playlists: React.FC = () => {
  const { playlists, createPlaylist, deletePlaylist, removeSongFromPlaylist, playSong, addToQueue } = usePlayerStore();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
    }
  };

  const activePlaylist = playlists.find(p => p.id === activePlaylistId);

  // View for a specific playlist
  if (activePlaylist) {
    return (
      <div className={sharedStyles.container}>
        <header className={sharedStyles.header}>
          <button 
            className={styles.backBtn}
            onClick={() => setActivePlaylistId(null)}
          >
            <ChevronLeft size={20} /> Back to Playlists
          </button>
          <div className={sharedStyles.headerTitle} style={{ marginTop: '16px' }}>
            <Music size={32} color="var(--accent-secondary)" />
            <h1 className="text-gradient">{activePlaylist.name}</h1>
          </div>
          <p>{activePlaylist.songs.length} songs</p>
        </header>

        {activePlaylist.songs.length > 0 ? (
          <div className={sharedStyles.grid}>
            {activePlaylist.songs.map((song, index) => (
              <div key={`pl-song-${song.id}-${index}`} className={`${sharedStyles.card} glass-panel animate-fade-in`}>
                <div className={sharedStyles.thumbnailWrapper} onClick={() => playSong(song)}>
                  <img src={song.thumbnail} alt={song.title} />
                  <div className={sharedStyles.playOverlay}>
                    <Play size={32} fill="white" />
                  </div>
                </div>
                
                <div className={sharedStyles.info}>
                  <h4 dangerouslySetInnerHTML={{ __html: song.title }}></h4>
                  <p>{song.channelTitle}</p>
                </div>
                
                <div className={sharedStyles.actions}>
                  <button 
                    className={sharedStyles.primaryBtn} 
                    onClick={() => addToQueue(song)}
                  >
                    <ListPlus size={18} />
                    Add to Queue
                  </button>
                  <button 
                    className={`${sharedStyles.iconBtn} ${sharedStyles.dangerBtn}`} 
                    onClick={() => removeSongFromPlaylist(activePlaylist.id, song.id)}
                    title="Remove from Playlist"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={sharedStyles.emptyState}>
            <Music size={48} className={sharedStyles.emptyIcon} />
            <h2>Playlist is empty</h2>
            <p>Go to the search page or queue to add songs to this playlist.</p>
          </div>
        )}
      </div>
    );
  }

  // View for list of playlists
  return (
    <div className={sharedStyles.container}>
      <header className={sharedStyles.header}>
        <div className={sharedStyles.headerTitle}>
          <Music size={32} color="var(--accent-secondary)" />
          <h1 className="text-gradient">Your Playlists</h1>
        </div>
        <p>Curate your own karaoke sets.</p>
      </header>

      <form onSubmit={handleCreatePlaylist} className={styles.createForm}>
        <div className={`${styles.inputGroup} glass-panel`}>
          <input 
            type="text" 
            placeholder="New Playlist Name" 
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <button type="submit" disabled={!newPlaylistName.trim()}>
            <Plus size={20} /> Create
          </button>
        </div>
      </form>

      {playlists.length > 0 ? (
        <div className={styles.playlistGrid}>
          {playlists.map((playlist) => (
            <div key={playlist.id} className={`${styles.playlistCard} glass-panel animate-fade-in`}>
              <div 
                className={styles.playlistInfo}
                onClick={() => setActivePlaylistId(playlist.id)}
              >
                <div className={styles.playlistIcon}>
                  <Music size={32} color="var(--text-secondary)" />
                </div>
                <div>
                  <h3>{playlist.name}</h3>
                  <p>{playlist.songs.length} songs</p>
                </div>
              </div>
              <button 
                className={styles.deleteBtn}
                onClick={() => deletePlaylist(playlist.id)}
                title="Delete Playlist"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={sharedStyles.emptyState}>
          <Music size={48} className={sharedStyles.emptyIcon} />
          <h2>No playlists yet</h2>
          <p>Create your first playlist above to start organizing your songs.</p>
        </div>
      )}
    </div>
  );
};

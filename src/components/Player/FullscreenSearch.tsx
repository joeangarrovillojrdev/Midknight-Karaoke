import React, { useState, useRef, KeyboardEvent } from 'react';
import { Search, X, ListPlus, Loader2, Check, ListMusic, ChevronUp, ChevronDown, Trash2, Heart, Folder, ArrowLeft } from 'lucide-react';
import { searchYouTube, YouTubeSearchResult } from '../../services/youtube';
import { usePlayerStore } from '../../store/usePlayerStore';
import styles from './FullscreenSearch.module.css';

export const FullscreenSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'queue' | 'favorites' | 'playlists'>('search');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  
  const { queue, favorites, playlists, addToQueue, removeFromQueue, reorderQueue } = usePlayerStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const data = await searchYouTube(query);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleAdd = (song: YouTubeSearchResult) => {
    addToQueue(song);
    setAddedId(song.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  // When closed, render a transparent floating button
  if (!isOpen) {
    return (
      <button 
        className={styles.openBtn} 
        onClick={() => setIsOpen(true)}
        aria-label="Add to Queue"
        title="Search & Add to Queue"
      >
        <Search size={24} />
      </button>
    );
  }

  // When open, render the semi-transparent overlay
  return (
    <div className={styles.overlayContainer}>
      <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
      
      <div className={`${styles.searchPanel} glass-panel animate-fade-in`}>
        <div className={styles.header}>
          <div className={styles.tabContainer}>
            <button 
              className={activeTab === 'search' ? styles.activeTab : styles.tabBtn} 
              onClick={() => setActiveTab('search')}
              title="Search YouTube"
            >
              <Search size={18} /> <span className={styles.tabText}>Search</span>
            </button>
            <button 
              className={activeTab === 'playlists' ? styles.activeTab : styles.tabBtn} 
              onClick={() => { setActiveTab('playlists'); setSelectedPlaylistId(null); }}
              title="Playlists"
            >
              <Folder size={18} /> <span className={styles.tabText}>Playlists</span>
            </button>
            <button 
              className={activeTab === 'favorites' ? styles.activeTab : styles.tabBtn} 
              onClick={() => setActiveTab('favorites')}
              title="Favorites"
            >
              <Heart size={18} /> <span className={styles.tabText}>Favorites</span>
            </button>
            <button 
              className={activeTab === 'queue' ? styles.activeTab : styles.tabBtn} 
              onClick={() => setActiveTab('queue')}
              title="Live Queue"
            >
              <ListMusic size={18} /> <span className={styles.tabText}>Queue ({queue.length})</span>
            </button>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.resultsArea}>
          {activeTab === 'search' ? (
            <>
              <div className={styles.inputWrapper}>
                <Search className={styles.searchIcon} size={20} />
                <input 
                  ref={inputRef}
                  type="text"
                  placeholder="Search for a song..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <button 
                  className={styles.searchActionBtn} 
                  onClick={handleSearch} 
                  disabled={isSearching || !query.trim()}
                >
                  {isSearching ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
                </button>
              </div>
              
              <div className={styles.resultsSpacer}>
                {results.length > 0 ? (
                  <div className={styles.resultsList}>
                    {results.map((song) => (
                      <div key={song.id} className={styles.resultCard}>
                        <div className={styles.thumbnailWrapper}>
                          <img src={song.thumbnail} alt={song.title} />
                        </div>
                        <div className={styles.songInfo}>
                          <h4 dangerouslySetInnerHTML={{ __html: song.title }}></h4>
                          <p>{song.channelTitle}</p>
                        </div>
                        <button 
                          className={`${styles.addBtn} ${addedId === song.id ? styles.addedSuccess : ''}`}
                          onClick={() => handleAdd(song)}
                          title="Add to Queue"
                        >
                          {addedId === song.id ? <Check size={20} /> : <ListPlus size={20} />}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <Search size={48} className={styles.emptyIcon} />
                    <p>{isSearching ? 'Searching YouTube...' : 'Search for a song to add to your queue.'}</p>
                  </div>
                )}
              </div>
            </>
          ) : activeTab === 'favorites' ? (
            <div className={styles.resultsSpacer}>
              {favorites.length > 0 ? (
                <div className={styles.resultsList}>
                  {favorites.map((song) => (
                    <div key={`fav-${song.id}`} className={styles.resultCard}>
                      <div className={styles.thumbnailWrapper}>
                        <img src={song.thumbnail} alt={song.title} />
                      </div>
                      <div className={styles.songInfo}>
                        <h4 dangerouslySetInnerHTML={{ __html: song.title }}></h4>
                        <p>{song.channelTitle}</p>
                      </div>
                      <button 
                        className={`${styles.addBtn} ${addedId === song.id ? styles.addedSuccess : ''}`}
                        onClick={() => handleAdd(song)}
                        title="Add to Queue"
                      >
                        {addedId === song.id ? <Check size={20} /> : <ListPlus size={20} />}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Heart size={48} className={styles.emptyIcon} />
                  <p>You have no offline favorites saved yet.</p>
                </div>
              )}
            </div>
          ) : activeTab === 'playlists' ? (
            <div className={styles.resultsSpacer}>
              {!selectedPlaylistId ? (
                playlists.length > 0 ? (
                  <div className={styles.playlistGrid}>
                    {playlists.map((playlist) => (
                      <div 
                        key={playlist.id} 
                        className={styles.playlistCard} 
                        onClick={() => setSelectedPlaylistId(playlist.id)}
                      >
                        <Folder size={40} className={styles.folderIcon} />
                        <h4>{playlist.name}</h4>
                        <p>{playlist.songs.length} songs</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <Folder size={48} className={styles.emptyIcon} />
                    <p>You haven't created any playlists yet.</p>
                  </div>
                )
              ) : (
                <div className={styles.playlistView}>
                  <button className={styles.backBtn} onClick={() => setSelectedPlaylistId(null)}>
                    <ArrowLeft size={20} /> Back to Folders
                  </button>
                  {playlists.find(p => p.id === selectedPlaylistId)?.songs.length ? (
                    <div className={styles.resultsList}>
                      {playlists.find(p => p.id === selectedPlaylistId)?.songs.map((song) => (
                        <div key={`pl-${song.id}`} className={styles.resultCard}>
                          <div className={styles.thumbnailWrapper}>
                            <img src={song.thumbnail} alt={song.title} />
                          </div>
                          <div className={styles.songInfo}>
                            <h4 dangerouslySetInnerHTML={{ __html: song.title }}></h4>
                            <p>{song.channelTitle}</p>
                          </div>
                          <button 
                            className={`${styles.addBtn} ${addedId === song.id ? styles.addedSuccess : ''}`}
                            onClick={() => handleAdd(song)}
                            title="Add to Queue"
                          >
                            {addedId === song.id ? <Check size={20} /> : <ListPlus size={20} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.emptyState}>
                      <ListMusic size={48} className={styles.emptyIcon} />
                      <p>This playlist is empty.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.queueContainer}>
              {queue.length > 0 ? (
                <div className={styles.resultsList}>
                  {queue.map((song, index) => (
                    <div key={`${song.id}-${index}`} className={styles.queueItem}>
                      <span className={styles.indexNum}>{index + 1}</span>
                      <div className={styles.songInfo}>
                        <h4 dangerouslySetInnerHTML={{ __html: song.title }}></h4>
                        <p>{song.channelTitle}</p>
                      </div>
                      <div className={styles.itemActions}>
                        <div className={styles.moveArrows}>
                          <button 
                            onClick={() => reorderQueue(index, index - 1)} 
                            disabled={index === 0}
                          ><ChevronUp size={16} /></button>
                          <button 
                            onClick={() => reorderQueue(index, index + 1)} 
                            disabled={index === queue.length - 1}
                          ><ChevronDown size={16} /></button>
                        </div>
                        <button 
                          className={styles.removeBtn} 
                          onClick={() => removeFromQueue(index)}
                          title="Remove from Queue"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <ListMusic size={48} className={styles.emptyIcon} />
                  <p>Your queue is empty. Find some songs to sing!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

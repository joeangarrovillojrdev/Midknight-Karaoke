import React, { useState } from 'react';
import { Play, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import styles from './Queue.module.css';

export const Queue: React.FC = () => {
  const { currentSong, queue, removeFromQueue, reorderQueue, skipTo, clearQueue } = usePlayerStore();
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    // Firefox requires some data to be set
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      return;
    }
    
    reorderQueue(draggedIdx, targetIdx);
    setDraggedIdx(null);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) reorderQueue(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    if (index < queue.length - 1) reorderQueue(index, index + 1);
  };

  return (
    <div className={styles.queueContainer}>
      <header className={styles.header}>
        <h1 className="text-gradient">Live Queue</h1>
        <p>Manage upcoming songs. Drag and drop to reorder.</p>
        
        {queue.length > 0 && (
          <button className={styles.clearBtn} onClick={clearQueue}>
            <Trash2 size={16} />
            Clear Queue
          </button>
        )}
      </header>

      <div className={styles.nowPlayingSection}>
        <h2 className={styles.sectionTitle}>Now Playing</h2>
        {currentSong ? (
          <div className={`${styles.nowPlayingCard} glass-panel animate-fade-in`}>
            <div className={styles.nowPlayingThumbnailWrapper}>
              <img src={currentSong.thumbnail} alt={currentSong.title} />
              <div className={styles.playingIndicator}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </div>
            </div>
            <div className={styles.songInfoLarge}>
              <h3 dangerouslySetInnerHTML={{ __html: currentSong.title }}></h3>
              <p>{currentSong.channelTitle}</p>
            </div>
          </div>
        ) : (
          <div className={`${styles.emptyCard} glass-panel`}>
            <p>Nothing is currently playing.</p>
          </div>
        )}
      </div>

      <div className={styles.upNextSection}>
        <h2 className={styles.sectionTitle}>Up Next ({queue.length})</h2>
        {queue.length > 0 ? (
          <div className={styles.queueList}>
            {queue.map((song, index) => (
              <div 
                key={`${song.id}-${song.addedAt}-${index}`} 
                className={`${styles.queueItem} glass-panel ${draggedIdx === index ? styles.dragging : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={() => setDraggedIdx(null)}
              >
                <div className={styles.dragHandle} title="Drag to reorder">
                  <GripVertical size={20} />
                </div>
                
                <div className={styles.indexNum}>{index + 1}</div>
                
                <div className={styles.thumbnailSmall}>
                  <img src={song.thumbnail} alt={song.title} />
                  <button className={styles.playOverlaySmall} onClick={() => skipTo(index)} title="Skip to this song">
                    <Play size={20} fill="white" />
                  </button>
                </div>
                
                <div className={styles.songInfoSmall}>
                  <h4 dangerouslySetInnerHTML={{ __html: song.title }}></h4>
                  <p>{song.channelTitle}</p>
                </div>
                
                <div className={styles.timeAdded}>
                  Added {formatTime(song.addedAt)}
                </div>
                
                <div className={styles.itemActions}>
                  <div className={styles.moveArrows}>
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0}><ChevronUp size={16}/></button>
                    <button onClick={() => handleMoveDown(index)} disabled={index === queue.length - 1}><ChevronDown size={16}/></button>
                  </div>
                  <button 
                    className={styles.removeBtn} 
                    onClick={() => removeFromQueue(index)}
                    title="Remove from queue"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Your queue is empty. Search for songs to add them here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

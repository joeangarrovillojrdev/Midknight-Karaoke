import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Play, Pause, SkipForward, Maximize2, Minimize2 } from 'lucide-react';
import { usePlayerStore } from '../../store/usePlayerStore';
import { FullscreenSearch } from './FullscreenSearch';
import styles from './MiniPlayer.module.css';

export const MiniPlayer: React.FC = () => {
  const { currentSong, queue, isPlaying, playNext, togglePlayPause } = usePlayerStore();
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Ref for the player wrapper so we can handle fullscreen properly
  const playerWrapperRef = useRef<HTMLDivElement>(null);

  // Sync isPlaying state with the actual YouTube player
  useEffect(() => {
    if (player) {
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }
    }
  }, [isPlaying, player, currentSong?.id]);

  const onReady = (event: YouTubeEvent) => {
    setPlayer(event.target);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    if (event.data === 1 && !isPlaying) {
      togglePlayPause(true);
    } else if (event.data === 2 && isPlaying) {
      togglePlayPause(false);
    }
  };

  const onEnd = () => {
    playNext();
  };

  const onError = (event: YouTubeEvent) => {
    // 101 or 150 means the video owner explicitly disabled embedding.
    // We should skip this video and automatically play the next one in the queue.
    console.error("YouTube Player encountered an error trying to play the video. Skipping to next.", event);
    playNext();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!currentSong) return null;

  return (
    <div className={`${styles.miniPlayer} ${isFullscreen ? styles.fullscreen : ''} glass-panel`}>
      <div 
        ref={playerWrapperRef}
        className={`${styles.videoWrapper} ${isFullscreen ? styles.videoFullscreen : ''}`}
      >
        <YouTube
          videoId={currentSong.id}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              controls: 1, // Keep constant to prevent iframe reload going fullscreen
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={onReady}
          onStateChange={onStateChange}
          onEnd={onEnd}
          onError={onError}
          className={styles.youtubeFrame}
        />
      </div>

      {!isFullscreen && (
        <div className={styles.controls}>
          <div className={styles.songInfo}>
            <div className={styles.scrollTextWrapper}>
              <h4 className={styles.songTitle}>{currentSong.title}</h4>
            </div>
            <p className={styles.channelTitle}>{currentSong.channelTitle}</p>
          </div>

          <div className={styles.actionButtons}>
            <button 
              className={styles.btnNav} 
              onClick={() => togglePlayPause()}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <button 
              className={styles.btnNav} 
              onClick={playNext}
              disabled={queue.length === 0}
              aria-label="Skip to Next"
            >
              <SkipForward size={24} className={queue.length === 0 ? styles.disabledIcon : ''} />
            </button>
            
            <div className={styles.divider}></div>
            
            <button 
              className={styles.btnAction} 
              onClick={toggleFullscreen}
              aria-label="Toggle Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
          </div>
        </div>
      )}
      
      {isFullscreen && (
        <>
          <FullscreenSearch />
          <button 
            className={`${styles.btnAction} ${styles.minimizeBtn}`} 
            onClick={toggleFullscreen}
            aria-label="Minimize"
          >
            <Minimize2 size={24} />
          </button>
        </>
      )}
    </div>
  );
};

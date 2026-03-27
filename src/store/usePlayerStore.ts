import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { YouTubeSearchResult } from '../services/youtube';

export interface Song extends YouTubeSearchResult {
  addedAt: number; // timestamp
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: number;
}

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  history: Song[];
  favorites: Song[];
  playlists: Playlist[];
  isPlaying: boolean;
  
  // Actions
  playSong: (song: Song) => void;
  addToQueue: (song: YouTubeSearchResult) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  playNext: () => void;
  skipTo: (index: number) => void; // Skips to a specific song in queue
  clearQueue: () => void;
  togglePlayPause: (state?: boolean) => void;
  
  toggleFavorite: (song: YouTubeSearchResult) => void;
  
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: YouTubeSearchResult) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  
  clearHistory: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      queue: [],
      history: [],
      favorites: [],
      playlists: [],
      isPlaying: false,

      playSong: (song) => {
        set((state) => ({
          currentSong: song,
          isPlaying: true,
          history: [song, ...state.history.filter(s => s.id !== song.id)].slice(0, 50), // keep history up to 50
        }));
      },

      addToQueue: (songResult) => {
        const song: Song = { ...songResult, addedAt: Date.now() };
        set((state) => {
          // If nothing is playing and queue is empty, play it immediately
          if (!state.currentSong) {
            get().playSong(song);
            return state;
          }
          return { queue: [...state.queue, song] };
        });
      },

      removeFromQueue: (index) => {
        set((state) => {
          const newQueue = [...state.queue];
          newQueue.splice(index, 1);
          return { queue: newQueue };
        });
      },

      reorderQueue: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.queue);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { queue: result };
        });
      },

      playNext: () => {
        set((state) => {
          if (state.queue.length === 0) {
            return { currentSong: null, isPlaying: false };
          }
          const nextSong = state.queue[0];
          const newQueue = state.queue.slice(1);
          
          return {
            currentSong: nextSong,
            queue: newQueue,
            isPlaying: true,
            history: [nextSong, ...state.history.filter(s => s.id !== nextSong.id)].slice(0, 50),
          };
        });
      },

      skipTo: (index) => {
        set((state) => {
          if (index < 0 || index >= state.queue.length) return state;
          const nextSong = state.queue[index];
          const newQueue = state.queue.slice(index + 1);
          
          return {
            currentSong: nextSong,
            queue: newQueue,
            isPlaying: true,
            history: [nextSong, ...state.history.filter(s => s.id !== nextSong.id)].slice(0, 50),
          };
        });
      },

      clearQueue: () => set({ queue: [] }),
      
      togglePlayPause: (forcedState) => set((state) => ({
        isPlaying: forcedState !== undefined ? forcedState : !state.isPlaying
      })),

      toggleFavorite: (songResult) => {
        set((state) => {
          const exists = state.favorites.some(s => s.id === songResult.id);
          if (exists) {
            return { favorites: state.favorites.filter(s => s.id !== songResult.id) };
          } else {
            return { favorites: [{ ...songResult, addedAt: Date.now() }, ...state.favorites] };
          }
        });
      },

      createPlaylist: (name) => {
        const newPlaylist: Playlist = {
          id: Math.random().toString(36).substring(2, 9),
          name,
          songs: [],
          createdAt: Date.now(),
        };
        set((state) => ({ playlists: [...state.playlists, newPlaylist] }));
      },

      deletePlaylist: (id) => {
        set((state) => ({ playlists: state.playlists.filter(p => p.id !== id) }));
      },

      addSongToPlaylist: (playlistId, songResult) => {
        set((state) => ({
          playlists: state.playlists.map(p => {
            if (p.id === playlistId) {
              // Prevent duplicates in playlist
              if (!p.songs.some(s => s.id === songResult.id)) {
                return { ...p, songs: [...p.songs, { ...songResult, addedAt: Date.now() }] };
              }
            }
            return p;
          })
        }));
      },

      removeSongFromPlaylist: (playlistId, songId) => {
        set((state) => ({
          playlists: state.playlists.map(p => {
            if (p.id === playlistId) {
              return { ...p, songs: p.songs.filter(s => s.id !== songId) };
            }
            return p;
          })
        }));
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'karaoke-storage',
      // We don't want to persist the currentSong playing state or isPlaying across reloads ideally,
      // but keeping queue and favorites is great. 
      // By default zustand persist saves the whole state. Let's just use default for now.
    }
  )
);

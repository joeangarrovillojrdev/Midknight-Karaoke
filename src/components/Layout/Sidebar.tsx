import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, ListMusic, Heart, History, Music, X, Youtube, Facebook, HeartHandshake } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/queue', label: 'Live Queue', icon: ListMusic },
  { path: '/playlists', label: 'Playlists', icon: Music },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/history', label: 'History', icon: History },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`${styles.mobileOverlay} ${isOpen ? styles.overlayOpen : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logoContainer}>
          <div className={styles.logoItem}>
            <div className={`${styles.logoIcon} animate-pulse-glow`}>🎤</div>
            <h1 className="text-gradient" style={{ fontSize: '20px' }}>Midknight's Karaoke</h1>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              <item.icon className={styles.icon} size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.supportSection}>
          <div className={styles.supportTitle}>
            <HeartHandshake size={16} className={styles.supportIcon} />
            <span>Support the Developer</span>
          </div>
          <a href="https://www.youtube.com/@MidknightcodeNautomation" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <Youtube size={16} />
            <span>YouTube Channel</span>
          </a>
          <a href="https://www.facebook.com/miknightautomationfbpage" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <Facebook size={16} />
            <span>Facebook Page</span>
          </a>
          <a href="https://www.facebook.com/midknightuzer" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            <Facebook size={16} />
            <span>Facebook Profile</span>
          </a>
        </div>

        <div className={styles.footer}>
          <p>powered by YouTube</p>
        </div>
      </aside>
    </>
  );
};

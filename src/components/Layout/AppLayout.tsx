import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import styles from './AppLayout.module.css';

// We will import the Player component here later

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className={styles.mainContent}>
        <div className={styles.mobileHeader}>
          <button className={styles.menuBtn} onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className={styles.mobileLogo}>
            <span className={styles.mobileIcon}>🎤</span>
            <span className="text-gradient">Midknight's Karaoke</span>
          </div>
        </div>
        
        <div className={styles.scrollContainer}>
          <Outlet />
        </div>
      </main>
      
      {/* Mini Player will go here, fixed at the bottom right or bottom bar */}
      <div id="player-portal"></div>
    </div>
  );
};

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { MiniPlayer } from './components/Player/MiniPlayer';

// Import Pages
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Queue } from './pages/Queue';
import { Playlists } from './pages/Playlists';
import { Favorites } from './pages/Favorites';
import { History } from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="queue" element={<Queue />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <MiniPlayer />
    </BrowserRouter>
  );
}

export default App;

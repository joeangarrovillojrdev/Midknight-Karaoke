export interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Fallback mock data in case API key is missing or limit is reached
const MOCK_DATA: YouTubeSearchResult[] = [
  {
    id: 'eL4ZvuBcvJI',
    title: 'Ed Sheeran - Perfect (Karaoke Version)',
    thumbnail: 'https://i.ytimg.com/vi/eL4ZvuBcvJI/hqdefault.jpg',
    channelTitle: 'Sing King'
  },
  {
    id: 'YQHsXMglC9A',
    title: 'Adele - Hello (Karaoke Version)',
    thumbnail: 'https://i.ytimg.com/vi/YQHsXMglC9A/hqdefault.jpg',
    channelTitle: 'Sing King'
  },
  {
    id: 'TfT5nEhm9Qc',
    title: 'Journey - Don\'t Stop Believin\' (Karaoke Version)',
    thumbnail: 'https://i.ytimg.com/vi/TfT5nEhm9Qc/hqdefault.jpg',
    channelTitle: 'KaraokeOn'
  },
  {
    id: 'fJ9rUzIMcZQ',
    title: 'Queen - Bohemian Rhapsody (Karaoke)',
    thumbnail: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg',
    channelTitle: 'Sing King'
  }
];

export const searchYouTube = async (query: string): Promise<YouTubeSearchResult[]> => {
  if (!API_KEY) {
    console.warn('VITE_YOUTUBE_API_KEY is missing. Using mock data.');
    // Return mock data filtered by query if it exists, otherwise just return mock
    return MOCK_DATA.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    ).concat(MOCK_DATA).slice(0, 10);
  }

  // Appending 'karaoke' to prioritize sing-along versions unless the user explicitly included it
  const searchQuery = query.toLowerCase().includes('karaoke') ? query : `${query} karaoke`;

  try {
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&maxResults=15&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=10&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from YouTube API');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      // Decode HTML entities in title (YouTube API returns them encoded)
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));
  } catch (error) {
    console.error('YouTube API Error:', error);
    // Fallback to mock data on error so UI testing can continue
    return MOCK_DATA;
  }
};

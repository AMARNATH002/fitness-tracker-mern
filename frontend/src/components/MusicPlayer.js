import React, { useState } from 'react';
import './MusicPlayer.css';

// Spotify playlist embed URLs for gym music
const PLAYLISTS = {
  tamil: {
    title: "Tamil Gym Mix",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0"
  },
  english: {
    title: "English Workout Mix",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DWXRqgorJj26U?utm_source=generator&theme=0"
  },
  rap: {
    title: "Hip Hop Workout",
    url: "https://open.spotify.com/embed/playlist/37i9dQZF1DX2RxBh64BHjQ?utm_source=generator&theme=0"
  }
};

function MusicPlayer() {
  const [activeTab, setActiveTab] = useState('english');
  const [minimized, setMinimized] = useState(false);

  const current = PLAYLISTS[activeTab];

  return (
    <div className={`music-player ${minimized ? 'minimized' : ''}`} style={{ width: minimized ? 'auto' : '300px' }}>
      <div className="player-header">
        <span className="player-title">🎵 Gym Radio</span>
        <button className="minimize-btn" onClick={() => setMinimized(!minimized)}>
          {minimized ? '▲' : '▼'}
        </button>
      </div>

      {!minimized && (
        <>
          <div className="player-tabs">
            <button
              className={activeTab === 'tamil' ? 'active' : ''}
              onClick={() => setActiveTab('tamil')}
            >Tamil</button>
            <button
              className={activeTab === 'english' ? 'active' : ''}
              onClick={() => setActiveTab('english')}
            >English</button>
            <button
              className={activeTab === 'rap' ? 'active' : ''}
              onClick={() => setActiveTab('rap')}
            >Rap</button>
          </div>

          {/* Spotify embed — actual audio, no browser block */}
          <iframe
            key={activeTab}
            src={current.url}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title={current.title}
            style={{ borderRadius: '0 0 8px 8px', display: 'block' }}
          />
        </>
      )}

      {minimized && (
        <div className="minimized-info" onClick={() => setMinimized(false)}>
          <span className="mini-icon">🎵</span>
          <div className="mini-track">{current.title.substring(0, 15)}...</div>
          <span style={{ color: '#ff9800', fontSize: '0.75rem', marginLeft: 'auto' }}>▲ Open</span>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;

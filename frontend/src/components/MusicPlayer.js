import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './MusicPlayer.css';

const PLAYLISTS = {
  tamil: [
    { title: "Tamil Gym Motivation", url: "https://www.youtube.com/watch?v=F55_B2dY7nQ" },
    { title: "Anirudh Gym Mix", url: "https://www.youtube.com/watch?v=I0T6wL5xI8A" },
    { title: "Tamil Workout Trap", url: "https://www.youtube.com/watch?v=R5T_GikzX1k" }
  ],
  english: [
    { title: "English Gym Motivation", url: "https://www.youtube.com/watch?v=1FGBzT1Zk4o" },
    { title: "Neffex Workout Mix", url: "https://www.youtube.com/watch?v=mD0iXgWwV60" },
    { title: "Hardstyle Gym Mix", url: "https://www.youtube.com/watch?v=zT1zZ5eL7eQ" }
  ],
  rap: [
    { title: "Hip Hop Workout", url: "https://www.youtube.com/watch?v=4C57m-mJzUo" },
    { title: "Eminem Gym Mix", url: "https://www.youtube.com/watch?v=kYtGl1dX5qI" },
    { title: "Aggressive Rap", url: "https://www.youtube.com/watch?v=p4vW73-k10o" }
  ]
};

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('english');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [minimized, setMinimized] = useState(false);

  const playlist = PLAYLISTS[activeTab];
  const currentTrack = playlist[currentTrackIndex];

  // If tab changes, reset to first song of new tab
  useEffect(() => {
    setCurrentTrackIndex(0);
    setPlaying(true);
  }, [activeTab]);

  const togglePlay = () => setPlaying(!playing);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setPlaying(true);
  };

  return (
    <div className={`music-player ${minimized ? 'minimized' : ''}`}>
      <div className="player-header">
        <span className="player-title">🎵 Gym Radio</span>
        <button className="minimize-btn" onClick={() => setMinimized(!minimized)}>
          {minimized ? '▲' : '▼'}
        </button>
      </div>

      {!minimized && (
        <>
          <div className="player-tabs">
            <button className={activeTab === 'tamil' ? 'active' : ''} onClick={() => setActiveTab('tamil')}>Tamil</button>
            <button className={activeTab === 'english' ? 'active' : ''} onClick={() => setActiveTab('english')}>English</button>
            <button className={activeTab === 'rap' ? 'active' : ''} onClick={() => setActiveTab('rap')}>Rap</button>
          </div>

          <div className="player-track-info">
            <div className="track-marquee">
              <span>{currentTrack.title}</span>
            </div>
          </div>

          <div className="player-controls">
            <button onClick={handlePrev} className="control-btn">⏮</button>
            <button onClick={togglePlay} className="control-btn play-btn">
              {playing ? '⏸' : '▶'}
            </button>
            <button onClick={handleNext} className="control-btn">⏭</button>
          </div>

          <div className="youtube-player-hidden">
            <ReactPlayer 
              url={currentTrack.url}
              playing={playing}
              controls={false}
              width="200px"
              height="112px"
              onEnded={handleNext}
              config={{
                youtube: {
                  playerVars: { showinfo: 0, modestbranding: 1 }
                }
              }}
            />
          </div>
        </>
      )}
      {minimized && (
        <div className="minimized-info" onClick={() => setMinimized(false)}>
          <span className="mini-icon">🎵</span>
          <div className="mini-track">{currentTrack.title.substring(0, 15)}...</div>
          <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="mini-play-btn">
            {playing ? '⏸' : '▶'}
          </button>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;

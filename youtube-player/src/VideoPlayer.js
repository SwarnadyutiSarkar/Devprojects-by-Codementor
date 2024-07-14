// src/VideoPlayer.js
import React from 'react';

function VideoPlayer({ video }) {
  if (!video) return <div>Loading...</div>;

  const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`;

  return (
    <div className="video-player">
      <iframe title="YouTube Video Player" width="560" height="315" src={videoSrc} frameBorder="0" allowFullScreen></iframe>
      <div className="video-details">
        <h2>{video.snippet.title}</h2>
        <p>{video.snippet.description}</p>
      </div>
    </div>
  );
}

export default VideoPlayer;

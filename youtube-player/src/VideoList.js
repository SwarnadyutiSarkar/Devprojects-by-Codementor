// src/VideoList.js
import React from 'react';

function VideoList({ videos, onVideoSelect }) {
  if (!videos) return null;

  return (
    <div className="video-list">
      {videos.map((video) => (
        <div key={video.id.videoId} className="video-item" onClick={() => onVideoSelect(video)}>
          <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} />
          <div className="video-info">
            <h4>{video.snippet.title}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoList;

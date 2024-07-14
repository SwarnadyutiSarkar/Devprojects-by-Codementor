// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import VideoList from './VideoList';
import VideoPlayer from './VideoPlayer';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          maxResults: 5,
          q: searchTerm,
          key: 'YOUR_YOUTUBE_API_KEY_HERE', // Replace with your YouTube API key
        },
      });
      setVideos(response.data.items);
      setSelectedVideo(response.data.items[0]); // Select the first video by default
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="App">
      <form onSubmit={handleSearch}>
        <input type="text" value={searchTerm} onChange={handleChange} placeholder="Search for videos..." />
        <button type="submit">Search</button>
      </form>
      <div className="content">
        <VideoList videos={videos} onVideoSelect={handleVideoSelect} />
        <VideoPlayer video={selectedVideo} />
      </div>
    </div>
  );
}

export default App;

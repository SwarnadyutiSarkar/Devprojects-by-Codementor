import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [images, setImages] = useState([]);
  const [borderSize, setBorderSize] = useState(10);
  const [borderColor, setBorderColor] = useState('#ffffff');
  const [taskId, setTaskId] = useState(null);
  const [collageId, setCollageId] = useState(null);
  const [collageUrl, setCollageUrl] = useState(null);

  useEffect(() => {
    if (taskId) {
      axios.get(`/get_status?task_id=${taskId}`)
        .then(response => {
          if (response.data.status === 'success') {
            setCollageId(response.data.collage_id);
          }
        })
        .catch(error => console.error(error));
    }
  }, [taskId]);

  const handleImageChange = (event) => {
    setImages([...images, event.target.files[0]]);
  };

  const handleCreateTask = () => {
    axios.post('/create_task', {
      images: images.map(image => image.name),
      border_size: borderSize,
      border_color: borderColor
    })
      .then(response => {
        setTaskId(response.data.task_id);
      })
      .catch(error => console.error(error));
  };

  const handleGetCollage = () => {
    axios.get(`/get_collage?collage_id=${collageId}`)
      .then(response => {
        setCollageUrl(response.data.collage_url);
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Photo Collage Tool</h1>
      <input type="file" multiple onChange={handleImageChange} />
      <br />
      <label>Border Size:</label>
      <input type="number" value={borderSize} onChange={(event) => setBorderSize(event.target.value)} />
      <br />
      <label>Border Color:</label>
      <input type="color" value={borderColor} onChange={(event) => setBorderColor(event.target.value)} />
      <br />
      <button onClick={handleCreateTask}>Create Task</button>
      <br />
      {taskId && (
        <div>
          <p>Task ID: {taskId}</p>
          <button onClick={handleGetCollage}>Get Collage</button>
        </div>
      )}
      {collageUrl && (
        <img src={collageUrl} alt="Collage" />
      )}
    </div>
  );
}

export default App;
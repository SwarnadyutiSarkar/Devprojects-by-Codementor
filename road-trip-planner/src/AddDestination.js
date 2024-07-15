import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AddDestination = ({ addDestination }) => {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && lat && lng) {
      addDestination({ id: uuidv4(), name, lat: parseFloat(lat), lng: parseFloat(lng) });
      setName('');
      setLat('');
      setLng('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Destination name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Latitude"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
      />
      <button type="submit">Add Destination</button>
    </form>
  );
};

export default AddDestination;

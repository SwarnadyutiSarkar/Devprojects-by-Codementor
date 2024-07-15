import React, { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import Map from './components/Map';
import DestinationsList from './components/DestinationsList';
import AddDestination from './components/AddDestination';
import './App.css';

const libraries = ['places'];

function App() {
  const [destinations, setDestinations] = useState([]);

  const addDestination = (destination) => {
    setDestinations([...destinations, destination]);
  };

  const reorderDestinations = (newOrder) => {
    setDestinations(newOrder);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="App">
        <h1>Road Trip Planner</h1>
        <AddDestination addDestination={addDestination} />
        <DestinationsList destinations={destinations} reorderDestinations={reorderDestinations} />
        <Map destinations={destinations} />
      </div>
    </LoadScript>
  );
}

export default App;

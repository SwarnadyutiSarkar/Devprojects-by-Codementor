import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import axios from 'axios';

const JOKE_API_URL = 'https://official-joke-api.appspot.com/jokes/random';

export default function App() {
  const [joke, setJoke] = useState('');

  const fetchJoke = async () => {
    try {
      const response = await axios.get(JOKE_API_URL);
      const { setup, punchline } = response.data;
      setJoke(`${setup} ... ${punchline}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch joke');
    }
  };

  const speakJoke = () => {
    if (joke) {
      Speech.speak(joke, { language: 'en' });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Joke Telling Robot</Text>
      <Button title="Tell Me A Joke" onPress={fetchJoke} />
      <Text style={styles.joke}>{joke}</Text>
      <Button title="Speak Joke" onPress={speakJoke} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  joke: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
});

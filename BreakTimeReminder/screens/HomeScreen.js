import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as Notifications from 'expo-notifications';

const HomeScreen = ({ navigation }) => {
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [breakDuration, setBreakDuration] = useState(10);
  const [frequency, setFrequency] = useState(60);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      setIsBreakTime(true);
    });
    return () => subscription.remove();
  }, []);

  const startSchedule = () => {
    const trigger = new Date(Date.now() + frequency * 60 * 1000);
    Notifications.scheduleNotificationAsync({
      content: {
        title: "It's break time!",
      },
      trigger,
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{isBreakTime ? 'Break time!' : 'Keep working!'}</Text>
      <Button title="Start Schedule" onPress={startSchedule} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

export default HomeScreen;

import React, { useEffect } from 'react';
import AppNavigator from './navigation/AppNavigator';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  };

  return <AppNavigator />;
}
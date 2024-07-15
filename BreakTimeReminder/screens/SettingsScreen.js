import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const SettingsScreen = ({ navigation }) => {
  const [breakDuration, setBreakDuration] = useState('10');
  const [frequency, setFrequency] = useState('60');

  const saveSettings = () => {
    // Save settings logic here
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Break Duration (minutes):</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginBottom: 20 }}
        keyboardType="numeric"
        value={breakDuration}
        onChangeText={setBreakDuration}
      />
      <Text>Frequency (minutes):</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginBottom: 20 }}
        keyboardType="numeric"
        value={frequency}
        onChangeText={setFrequency}
      />
      <Button title="Save" onPress={saveSettings} />
    </View>
  );
};

export default SettingsScreen;

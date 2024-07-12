import React from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ImagePicker from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';

const Stack = createStackNavigator();

const db = SQLite.openDatabase(
  {
    name: 'FoodJournalDB',
    location: 'default',
  },
  () => {},
  error => { console.log(error) }
);

const HomeScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    createTable();
    fetchEntries();
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Entries (id INTEGER PRIMARY KEY AUTOINCREMENT, imageUri TEXT, description TEXT, hashtags TEXT, location TEXT)',
        [],
        () => {},
        error => { console.log(error) }
      );
    });
  };

  const fetchEntries = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM Entries', [], (tx, results) => {
        const rows = results.rows;
        let entries = [];
        for (let i = 0; i < rows.length; i++) {
          entries.push(rows.item(i));
        }
        setEntries(entries);
      });
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Add New Entry" onPress={() => navigation.navigate('AddEntry')} />
      <FlatList
        data={entries}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <Text>{item.description}</Text>
            <Text>{item.hashtags}</Text>
            <Text>{item.location}</Text>
          </View>
        )}
      />
    </View>
  );
};

const AddEntryScreen = ({ navigation }) => {
  const [imageUri, setImageUri] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [location, setLocation] = useState('');

  const selectImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.uri) {
        setImageUri(response.uri);
      }
    });
  };

  const saveEntry = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO Entries (imageUri, description, hashtags, location) VALUES (?, ?, ?, ?)',
        [imageUri, description, hashtags, location],
        () => {
          navigation.navigate('Home');
        },
        error => { console.log(error) }
      );
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={selectImage} />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Hashtags"
        value={hashtags}
        onChangeText={setHashtags}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title="Save Entry" onPress={saveEntry} />
    </View>
  );
};

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="AddEntry" component={AddEntryScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const App = () => {
  return <AppNavigator />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  entry: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 8,
    padding: 8,
  },
});

export default App;

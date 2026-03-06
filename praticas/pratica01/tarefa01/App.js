import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { titulo } from './util';
import titulo_default from './util';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{titulo}</Text>
      <Text style={styles.titulo_text}>{titulo_default}</Text>
      <StatusBar style="auto" />
      <Button title='Clique aqui'></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff8e8e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo_text: {
    margin:20,
    color: '#ff0000',
    fontSize: 20
  }
});

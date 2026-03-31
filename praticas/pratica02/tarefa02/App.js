import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import {
  rotulo_input_meta,
  rotulo_btn_cadastro_meta,
  rotulo_lista_metas
} from './mensagens';
import { useState } from 'react';
import MetasList from './components/MetasList';
import MetaInput from './components/MetaInput';
import { SafeAreaViewProvider, SafeAreaView } from 'react-native';

export default function App() {

  const [metas, setMetas] = useState([]);

  function adicionarMetaHandler(inputMeta) {
    const novaMeta = { id: Math.random().toString(), texto: inputMeta};
    setMetas([...metas, novaMeta]);
  }

  function deletarMetaHandler(id) {
    console.log(id);
    const novasMetas = metas.filter(meta => meta.id !== id);
    setMetas(novasMetas);
  }
  
  return (
    <View style={styles.mainContainer}>
      <MetaInput onAddMeta={adicionarMetaHandler}/>
      <View style={styles.metaContainer}>
        <MetasList array={metas} onDeleteItem={deletarMetaHandler}/>
      </View>
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
  mainContainer: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
  },
  metaContainer: {
    flex: 1,
  },
});

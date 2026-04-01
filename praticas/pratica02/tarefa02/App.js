import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  SafeAreaViewProvider,
  Image,
} from "react-native";
import {
  rotulo_input_meta,
  rotulo_btn_cadastro_meta,
  rotulo_lista_metas,
} from "./mensagens";
import { useState, useEffect } from "react";
import MetasList from "./components/MetasList";
import MetaInput from "./components/MetaInput";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [metas, setMetas] = useState([]);

  function adicionarMetaHandler(inputMeta) {
    const novaMeta = { id: Math.random().toString(), texto: inputMeta };
    setMetas([...metas, novaMeta]);
  }

  function deletarMetaHandler(id) {
    const novasMetas = metas.filter((meta) => meta.id !== id);
    setMetas(novasMetas);
  }

  useEffect(() => {
    async function carregarDados() {
      try {
        const dadosSalvos = await AsyncStorage.getItem("@listaTarefas");
        if (dadosSalvos) {
          setMetas(JSON.parse(dadosSalvos));
          console.log(
            "Dados carregados do AsyncStorage:",
            JSON.parse(dadosSalvos)
          );
        }
      } catch (error) {
        console.log("Erro ao carregar dados:", error);
      }
    }

    carregarDados();
  }, []);

  useEffect(() => {
    async function salvarDados() {
      try {
        await AsyncStorage.setItem("@listaTarefas", JSON.stringify(metas));
        console.log(
          "Dados armazenados no AsyncStorage:",
          JSON.stringify(metas)
        );
      } catch (error) {
        console.log("Erro ao salvar dados:", error);
      }
    }

    salvarDados();
  }, [metas]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topo}>
          <View style={styles.imageContainer}>
            <Image source={require("./assets/favicon.png")} />
          </View>
          <View>
            <Text style={styles.headerText}>Minhas Metas</Text>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <MetaInput onAddMeta={adicionarMetaHandler} />
          <View style={styles.metaContainer}>
            <MetasList array={metas} onDeleteItem={deletarMetaHandler} />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContainer: {
    flex: 1,
    padding: 30,
    flexDirection: "column",
  },
  metaContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    alignItems: "flex-start",
    marginTop: 10,
    paddingLeft: 30,
  },
  image: {
    width: 50,
    height: 50,
  },
  headerText: {
    fontSize: 20,
    marginLeft: 10,
  },
  topo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
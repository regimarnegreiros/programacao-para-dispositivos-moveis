import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from "react-native";
import {
  rotulo_input_meta,
  rotulo_btn_cadastro_meta,
  rotulo_lista_metas,
} from "../mensagens";

function MetaInput(props) {
  const [inputMetaText, setInputMetaText] = useState('');

  function metaInputHandler(inputText) {
    setInputMetaText(inputText);
  }

  function adicionarMetaHandler() {
    props.onAddMeta(inputMetaText);
    setInputMetaText('');
  }

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
      <View style={{ width: "65%" }}>
        <TextInput
          style={styles.inputText}
          placeholder={rotulo_input_meta}
          onChangeText={metaInputHandler}
          value={inputMetaText}
        />
      </View>
      <View style={{ width: "30%" }}>
        <Button
          title={rotulo_btn_cadastro_meta}
          onPress={adicionarMetaHandler}
        />
      </View>
    </View>
  );
}

export default MetaInput;

const styles = StyleSheet.create({
  inputText: {
    borderColor: "#cccccc",
    borderWidth: 1,
  },
});

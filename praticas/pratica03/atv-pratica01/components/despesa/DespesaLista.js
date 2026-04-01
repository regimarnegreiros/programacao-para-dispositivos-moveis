import { FlatList, Text, View } from "react-native";
import DespesaItem from "./DespesaItem";

function renderDespesaItem(itemData) {
  return (
    <View>
      <Text>{itemData.item.descricao}</Text>
      <Text>{itemData.item.valor}</Text>
    </View>
  );
}

function DespesaLista({ despesas }) {
  return (
    <FlatList
      data={despesas}
      renderItem={({ item }) => <DespesaItem item={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

export default DespesaLista;

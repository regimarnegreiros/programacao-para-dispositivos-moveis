import { useContext, useState, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MoneyContext } from "@/contexts/GlobalState";
import TransactionItem from "@/components/TransactionItem";
import MonthYearPicker from "@/components/MonthYearPicker";
import DescriptionInput from "@/components/DescriptionInput";
import CurrencyInput from "@/components/CurrencyInput";
import DatePicker from "@/components/DatePicker";
import CategoryPicker from "@/components/CategoryPicker";
import Button from "@/components/Button";
import { globalStyles } from "@/styles/globalStyles";
import { colors } from "@/constants/colors";

export default function Transactions() {
  const { user, logout, transactions, categories, loading, error, refresh, removeTransaction, updateTransaction } =
    useContext(MoneyContext);

  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Edit state
  const [editingTx, setEditingTx] = useState(null);
  const [form, setForm] = useState({ description: "", value: 0, date: new Date(), categoryId: "" });
  const [saving, setSaving] = useState(false);
  const valueInputRef = useRef();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === currentDate.getMonth() && txDate.getFullYear() === currentDate.getFullYear();
    });
  }, [transactions, currentDate]);

  const handleLongPress = (item) => {
    Alert.alert(
      "Ações da Transação",
      `O que deseja fazer com "${item.description}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Editar",
          onPress: () => {
            setForm({
              description: item.description,
              value: item.value,
              date: new Date(item.date),
              categoryId: item.categoryId
            });
            setEditingTx(item);
          }
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await removeTransaction(item.id);
            } catch (e) {
              Alert.alert("Erro ao excluir", e.message ?? "Tente novamente.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSaveEdit = async () => {
    if (!form.description || !form.value || !form.categoryId) return Alert.alert("Preencha todos os campos");
    setSaving(true);
    try {
      await updateTransaction(editingTx.id, {
        description: form.description,
        value: Number(form.value),
        date: form.date.toISOString(),
        categoryId: form.categoryId
      });
      setEditingTx(null);
    } catch (e) {
      Alert.alert("Erro", e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading && transactions.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando transações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <Text style={globalStyles.primaryText}>
          Não foi possível carregar.
        </Text>
        <Text style={globalStyles.secondaryText}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, {user?.name}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <MaterialIcons name="logout" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <MonthYearPicker date={currentDate} onChange={setCurrentDate} />

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => handleLongPress(item)}
            activeOpacity={0.7}
          >
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[globalStyles.secondaryText, { textAlign: 'center', marginTop: 20 }]}>
            Nenhuma transação neste mês.
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
        contentContainerStyle={styles.listContent}
      />

      <Modal visible={!!editingTx} animationType="slide" transparent>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Transação</Text>
            
            <DescriptionInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
            <CurrencyInput form={form} setForm={setForm} valueInputRef={valueInputRef} />
            <DatePicker form={form} setForm={setForm} />
            <CategoryPicker form={form} setForm={setForm} categories={categories} />

            <View style={{ marginTop: 20 }}>
              <Button onPress={handleSaveEdit} loading={saving}>Salvar Alterações</Button>
              <TouchableOpacity onPress={() => setEditingTx(null)} style={{ marginTop: 10, alignItems: 'center' }}>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoutBtn: {
    padding: 8,
  },
  listContent: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  retry: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryText: {
    color: colors.primaryContrast,
    fontWeight: "600",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 20,
  }
});

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

export default function MonthYearPicker({ date, onChange }) {
  const handlePrev = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    onChange(newDate);
  };

  const monthName = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const capitalized = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePrev} style={styles.btn}>
        <MaterialIcons name="chevron-left" size={28} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.text}>{capitalized}</Text>
      <TouchableOpacity onPress={handleNext} style={styles.btn}>
        <MaterialIcons name="chevron-right" size={28} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primaryText,
  },
  btn: {
    padding: 4,
  }
});

import { useContext, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { MoneyContext } from "@/contexts/GlobalState";
import SummaryItem from "@/components/SummaryItem";
import MonthYearPicker from "@/components/MonthYearPicker";
import { globalStyles } from "@/styles/globalStyles";
import { colors } from "@/constants/colors";

export default function Summary() {
  const { transactions, categories, loading } = useContext(MoneyContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { totalsById, balance, chartData } = useMemo(() => {
    const acc = {};
    let saldo = 0;
    const pieData = [];

    // Filter transactions by month/year
    const filtered = transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getMonth() === currentDate.getMonth() && txDate.getFullYear() === currentDate.getFullYear();
    });

    for (const c of categories) acc[c.id] = 0;

    for (const t of filtered) {
      const numericValue = Number(t.value);
      if (acc[t.categoryId] !== undefined) {
        acc[t.categoryId] += numericValue;
      }
      const cat = t.category ?? categories.find((c) => c.id === t.categoryId);
      if (cat?.isIncome) {
        saldo += numericValue;
      } else {
        saldo -= numericValue;
      }
    }

    // Prepare chart data only for expenses (isIncome = false) with > 0 total
    categories.forEach(c => {
      if (!c.isIncome && acc[c.id] > 0) {
        pieData.push({
          name: c.displayName,
          value: acc[c.id],
          color: c.background,
          legendFontColor: "#7F7F7F",
          legendFontSize: 12
        });
      }
    });

    return { totalsById: acc, balance: saldo, chartData: pieData };
  }, [transactions, categories, currentDate]);

  if (loading && categories.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const balanceStyle =
    balance >= 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      <MonthYearPicker date={currentDate} onChange={setCurrentDate} />
      <ScrollView style={globalStyles.content}>
        
        {chartData.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Despesas do Mês</Text>
            <PieChart
              data={chartData}
              width={Dimensions.get("window").width - 40}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"value"}
              backgroundColor={"transparent"}
              paddingLeft={"0"}
              absolute
            />
          </View>
        )}

        {categories.map((category) => (
          <SummaryItem
            key={category.id}
            category={category}
            value={totalsById[category.id] ?? 0}
          />
        ))}
        <View style={globalStyles.line} />
        <View style={styles.balance}>
          <Text style={styles.balanceText}>Saldo</Text>
          <Text style={balanceStyle}>
            {balance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primaryText,
    marginBottom: 10,
  },
  balance: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  balanceText: {
    fontSize: 18,
    color: colors.primaryText,
    fontWeight: "800",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

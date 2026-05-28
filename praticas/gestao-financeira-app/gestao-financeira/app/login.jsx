import { useState, useContext } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MoneyContext } from "@/contexts/GlobalState";
import { colors } from "@/constants/colors";
import { globalStyles } from "@/styles/globalStyles";
import Button from "@/components/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(MoneyContext);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Erro", "Preencha todos os campos");
    
    setLoading(true);
    try {
      await login(email, password);
    } catch (e) {
      Alert.alert("Erro de Login", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Gestão Financeira</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={globalStyles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[globalStyles.input, { flex: 1, borderWidth: 0 }]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholder="Sua senha secreta"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 8 }}>
              <MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Button onPress={handleLogin} loading={loading} style={{ marginTop: 20 }}>
            Entrar
          </Button>

          <TouchableOpacity style={styles.link} onPress={() => router.push("/register")}>
            <Text style={styles.linkText}>Ainda não tem conta? Crie uma aqui.</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    marginTop: 10,
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
  }
});

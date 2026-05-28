import { useState, useContext } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MoneyContext } from "@/contexts/GlobalState";
import { colors } from "@/constants/colors";
import { globalStyles } from "@/styles/globalStyles";
import Button from "@/components/Button";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useContext(MoneyContext);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) return Alert.alert("Erro", "Preencha todos os campos");
    if (password !== confirmPassword) return Alert.alert("Erro", "As senhas não coincidem");
    
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (e) {
      Alert.alert("Erro de Registro", e.message);
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
        <View style={styles.card}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={globalStyles.input}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            placeholder="Seu nome"
          />

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

          <Text style={styles.label}>Confirmar Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[globalStyles.input, { flex: 1, borderWidth: 0 }]}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repita sua senha"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={{ padding: 8 }}>
              <MaterialIcons name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Button onPress={handleRegister} loading={loading} style={{ marginTop: 20 }}>
            Criar Conta
          </Button>
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: colors.secondaryText,
    borderWidth: 1,
    borderRadius: 8,
  }
});

// Exemplo de como ficaria seu arquivo em TypeScript
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

// Define a interface para os dados que a API retorna
interface PerfilResponse {
  message: string;
}

export default function Perfil() {
  const [nome, setNome] = useState<string>("");
  const [sobrenome, setSobrenome] = useState<string>("");
  const [cpf, setCpf] = useState<string>("");
  const [tipoTelefone, setTipoTelefone] = useState<string>("Celular");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const _HOST = "http://192.168.1.2:9000";

  const salvarDados = async () => {
    try {
      const resposta = await fetch(`${_HOST}/perfil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sobrenome, cpf, tipoTelefone, telefone, email }),
      });

      const data: PerfilResponse = await resposta.json();
      console.log("Perfil salvo:", data);

      Alert.alert("✅ Sucesso!", "Perfil salvo com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
          style: "default"
        }
      ], { cancelable: false });
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("❌ Erro", "Não foi possível salvar o perfil. Tente novamente.", [{ text: "OK", style: "cancel" }]);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>DADOS PESSOAIS</Text>
        <Text style={styles.subtitle}>Insira seus dados pessoais</Text>
        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Sobrenome" value={sobrenome} onChangeText={setSobrenome} />
        <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
        <Picker selectedValue={tipoTelefone} style={styles.input} onValueChange={(itemValue: string) => setTipoTelefone(itemValue)}>
          <Picker.Item label="Celular" value="Celular" />
          <Picker.Item label="Residencial" value="Residencial" />
          <Picker.Item label="Comercial" value="Comercial" />
        </Picker>
        <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Pressable style={styles.button} onPress={salvarDados}>
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f6fa", padding: 30, justifyContent: 'center'},
  title: { fontSize: 22, fontWeight: "bold", color: "#144480", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
  },
  button: { backgroundColor: "#144480", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
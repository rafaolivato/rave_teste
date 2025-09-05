import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export default function Perfil() {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipoTelefone, setTipoTelefone] = useState("Celular");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const _HOST = "http://192.168.1.2:9000";

  const salvarDados = async () => {
    try {
      const resposta = await fetch(`${_HOST}/perfil`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, sobrenome, cpf, tipoTelefone, telefone, email }),
      });

      const data = await resposta.json();
      console.log("Perfil salvo:", data);

      // ALERTA MODERNO DE SUCESSO
      Alert.alert(
        "✅ Sucesso!",
        "Perfil salvo com sucesso!",
        [
          {
            text: "OK",
            onPress: () => router.back(), // Volta após clicar em OK
            style: "default"
          }
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.error("Erro ao salvar perfil:", error);

      // ALERTA DE ERRO
      Alert.alert(
        "❌ Erro",
        "Não foi possível salvar o perfil. Tente novamente.",
        [{ text: "OK", style: "cancel" }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 2 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subtitle}></Text>
        <Text style={styles.subtitle}></Text>
        <Text style={styles.title}>DADOS PESSOAIS</Text>
        <Text style={styles.subtitle}>Insira seus dados pessoais</Text>

        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Sobrenome" value={sobrenome} onChangeText={setSobrenome} />
        <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />

        <Picker selectedValue={tipoTelefone} style={styles.option} onValueChange={(itemValue) => setTipoTelefone(itemValue)}>
          <Picker.Item label="Celular" value="Celular" />
          <Picker.Item label="Residencial" value="Residencial" />
          <Picker.Item label="Comercial" value="Comercial" />
        </Picker>

        <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Pressable style={styles.button} onPress={salvarDados}>
          <Text style={styles.buttonText}>Salvar</Text>
        </Pressable>
      </ScrollView >
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, height: 1, backgroundColor: "#191a27ff", padding: 30, justifyContent: 'center', alignItens: 'center' },
  title: { fontSize: 22, fontWeight: "bold", color: "#144480", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, },
  option: { backgroundColor: "#fff", height: 50, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, },
  button: { backgroundColor: "#144480", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

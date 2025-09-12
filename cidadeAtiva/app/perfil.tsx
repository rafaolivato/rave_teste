import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { ZodError } from "zod";

// Importa o schema de validação e o tipo do arquivo de validação
import { perfilSchema } from "../src/validations/validations";

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

    const _HOST = "http://192.168.1.11:9000";

    const formatTelefone = (value: string) => {
        // remove tudo que não for número
        const cleaned = value.replace(/\D/g, "");

        // aplica máscara (xx) xxxxx-xxxx
        if (cleaned.length <= 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        }
        return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    };

    const formatCpf = (value: string) => {
        const cleaned = value.replace(/\D/g, "");
        return cleaned
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };

    const salvarDados = async () => {
        try {
            // 1. Valida os dados usando o schema Zod
            perfilSchema.parse({
                nome,
                sobrenome,
                cpf,
                tipoTelefone,
                telefone,
                email,
            });

            // Se a validação passar, continua com a chamada à API
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

            // 2. Trata o erro de validação do Zod
            if (error instanceof ZodError) {
                const erros = error.issues.map(issue => `• ${issue.message}`).join("\n");
                Alert.alert("❌ Erro de Validação", erros);
            } else {
                // Trata outros erros, como falha na rede
                Alert.alert("❌ Erro", "Não foi possível salvar o perfil. Tente novamente.", [{ text: "OK", style: "cancel" }]);
            }
        }

    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 2 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}></Text>
                <Text style={styles.title}></Text>
                <Text style={styles.title}>DADOS PESSOAIS</Text>
                <Text style={styles.subtitle}>Insira seus dados pessoais</Text>
                <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
                <TextInput style={styles.input} placeholder="Sobrenome" value={sobrenome} onChangeText={setSobrenome} />
                <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={(v) => setCpf(formatCpf(v))} keyboardType="numeric" maxLength={14} />
                <Picker selectedValue={tipoTelefone} style={styles.option} onValueChange={(itemValue: string) => setTipoTelefone(itemValue)}>
                    <Picker.Item label="Celular" value="Celular" />
                    <Picker.Item label="Residencial" value="Residencial" />
                    <Picker.Item label="Comercial" value="Comercial" />
                </Picker>
                <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={(v) => setTelefone(formatTelefone(v))} keyboardType="phone-pad" maxLength={15} />
                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                <Pressable style={styles.button} onPress={salvarDados}>
                    <Text style={styles.buttonText}>Salvar</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, height: 700, backgroundColor: "#191a27ff", padding: 30, justifyContent: 'center' },
    title: { fontSize: 22, fontWeight: "bold", color: "#144480", marginBottom: 5 },
    subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
    option: { backgroundColor: "#fff", height: 50, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, },
    input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: "#ccc", marginBottom: 15, },
    button: { backgroundColor: "#144480", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 20 },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

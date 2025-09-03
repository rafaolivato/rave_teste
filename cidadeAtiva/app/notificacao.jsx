import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image,StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


export default function Notificacao() {
  const [step, setStep] = useState(1);

  const navigation = useNavigation();

  
  // Estados gerais
  const [localizacao, setLocalizacao] = useState(null);
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [problemas, setProblemas] = useState([]);
  const [dados, setDados] = useState({
    nome: "",
    sobrenome: "",
    cpf: "",
    telefone: "",
    tipoTelefone: "",
    email: "",
  });


  const [infosAdicionais, setInfosAdicionais] = useState({
    referencia: "",
    observacoes: "",
    foto: null,
  });

  // Função para pegar localização atual
  const pegarLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão de localização negada!");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    setLocalizacao(loc.coords);

    // Reverse geocoding
    let [enderecoCompleto] = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    if (enderecoCompleto) {
      // Preencher campos automaticamente
      setEndereco(enderecoCompleto.street || "");   // Rua
      setNumero(enderecoCompleto.name || "");       // Número (às vezes vem vazio)
      setBairro(enderecoCompleto.subregion || "");  // Bairro
  }

  };

  // Função para selecionar imagem
  const escolherImagem = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setInfosAdicionais({ ...infosAdicionais, foto: result.assets[0].uri });
    }
  };
  
  // Função para salvar notificação (aqui depois integraremos com backend)
  const salvarNotificacao = () => {
    const payload = {
      localizacao,
      endereco,
      problemas,
      dados,
      infosAdicionais,
    };

    console.log("Notificação salva:", payload);
    setStep(6);
  };

  // Renderização condicional por etapa
  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Step 1 */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Cadastrar Notificação</Text>
          <Text style={styles.subtitle}>📍 Localização</Text>
          
          <TouchableOpacity onPress={pegarLocalizacao} style={styles.buttonSecondary}>
            <Text style={styles.buttonTextSecondary}>Usar minha localização atual</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Insira um endereço"
            value={endereco}
            onChangeText={setEndereco}
            style={styles.input}
          />
          <TextInput
            placeholder="Número"
            value={numero}
            onChangeText={setNumero}
            style={styles.input}
          />
          <TextInput
            placeholder="Bairro"
            value={bairro}
            onChangeText={setBairro}
            style={styles.input}
          />

          {/* Mapa */}
    <View style={{ height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 15 }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: localizacao ? localizacao.latitude : -3.5,
          longitude: localizacao ? localizacao.longitude : -52.2,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {localizacao && <Marker coordinate={localizacao} />}
      </MapView>
    </View>

          <TouchableOpacity onPress={() => setStep(2)} style={styles.buttonPrimary}>
            <Text style={styles.buttonTextPrimary}>Próximo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Step 2 */}
{step === 2 && (
  <View style={styles.stepContainer}>
    <Text style={styles.title}>Problemas Encontrados</Text>

    <View style={styles.grid}>
      {[
        { label: "Iluminação Pública", icon: "lightbulb-on-outline" },
        { label: "Coleta de Lixo", icon: "delete" },
        { label: "Tapa Buraco", icon: "road-variant" },
        { label: "Pets", icon: "dog" },
        { label: "Guarda Municipal", icon: "shield-account" },
        { label: "Meu Ônibus", icon: "bus" },
        { label: "Roçada Áreas Públicas", icon: "grass" },
        { label: "Coleta Seletiva", icon: "recycle" },
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() =>
            setProblemas((prev) =>
              prev.includes(item.label) ? [] : [item.label]
            )
          }
          style={[
            styles.optionButton,
            problemas.includes(item.label) && styles.optionButtonSelected,
          ]}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={28}
            color={problemas.includes(item.label) ? "#fff" : "#333"}
            style={{ marginBottom: 6 }}
          />
          <Text
            style={
              problemas.includes(item.label)
                ? styles.optionTextSelected
                : styles.optionText
            }
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.navigation}>
      <TouchableOpacity onPress={() => setStep(1)} style={styles.buttonSecondary}>
        <Text style={styles.buttonTextSecondary}>Anterior</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (problemas.length > 0) {
            setStep(3);
          } else {
            alert("Selecione um problema antes de continuar!");
          }
        }}
        style={styles.buttonPrimary}
      >
        <Text style={styles.buttonTextPrimary}>Próximo</Text>
      </TouchableOpacity>
    </View>
  </View>
)}



      {/* Step 3 */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Dados Pessoais</Text>

          <TextInput placeholder="Nome" style={styles.input} value={dados.nome} onChangeText={(v) => setDados({ ...dados, nome: v })} />
          <TextInput placeholder="Sobrenome" style={styles.input} value={dados.sobrenome} onChangeText={(v) => setDados({ ...dados, sobrenome: v })} />
          <TextInput placeholder="CPF" style={styles.input} value={dados.cpf} onChangeText={(v) => setDados({ ...dados, cpf: v })} />
          <TextInput placeholder="Telefone" style={styles.input} value={dados.telefone} onChangeText={(v) => setDados({ ...dados, telefone: v })} />
          <TextInput placeholder="Email" style={styles.input} value={dados.email} onChangeText={(v) => setDados({ ...dados, email: v })} />

          <View style={styles.navigation}>
            <TouchableOpacity onPress={() => setStep(2)} style={styles.buttonSecondary}>
              <Text style={styles.buttonTextSecondary}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setStep(4)} style={styles.buttonPrimary}>
              <Text style={styles.buttonTextPrimary}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 4 */}
      {step === 4 && (
  <View style={styles.stepContainer}>
    <Text style={styles.title}>Informações Adicionais</Text>

    <TextInput 
      placeholder="Referência" 
      style={styles.input} 
      value={infosAdicionais.referencia} 
      onChangeText={(v) => setInfosAdicionais({ ...infosAdicionais, referencia: v })} 
    />
    <TextInput 
      placeholder="Observações" 
      style={styles.input} 
      value={infosAdicionais.observacoes} 
      onChangeText={(v) => setInfosAdicionais({ ...infosAdicionais, observacoes: v })} 
    />

    {infosAdicionais.foto && (
      <Image source={{ uri: infosAdicionais.foto }} style={styles.previewImage} />
    )}

    <TouchableOpacity onPress={escolherImagem} style={[styles.buttonSecondary, { padding: 20 }]}>
      <Ionicons name="camera" size={33} color="#5d4bc7ff" style={{ marginRight: 8 }} />
      <Text style={styles.buttonTextSecondary}>Tirar Foto</Text>
    </TouchableOpacity>

    <View style={styles.navigation}>
      <TouchableOpacity onPress={() => setStep(3)} style={styles.buttonSecondary}>
        <Text style={styles.buttonTextSecondary}>Anterior</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStep(5)} style={styles.buttonPrimary}>
        <Text style={styles.buttonTextPrimary}>Próximo</Text>
      </TouchableOpacity>
    </View>
  </View>
)}

      {/* Step 5 */}
     {step === 5 && (
  <View style={styles.stepContainer}>
    <Text style={styles.title}>📋 Confirmar Informações</Text>

    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{dados.nome} {dados.sobrenome}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.value}>{dados.telefone}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Problemas:</Text>
        <Text style={styles.value}>{problemas.join(", ")}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Endereço:</Text>
        <Text style={styles.value}>{endereco}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Número:</Text>
        <Text style={styles.value}>{numero}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Bairro:</Text>
        <Text style={styles.value}>{bairro}</Text>
      </View>
    </View>

    <TouchableOpacity onPress={salvarNotificacao} style={styles.buttonPrimary}>
      <Text style={styles.buttonTextPrimary}>✅ Confirmar</Text>
    </TouchableOpacity>
  </View>
)}

      {/* Step 6 */}
      {step === 6 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>✅ Notificação enviada!</Text>
          <Text style={styles.subtitle}>
            Sua requisição foi enviada para análise técnica e gerou protocolo 082500002.
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("index")} style={styles.buttonPrimary}>
            <Text style={styles.buttonTextPrimary}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  stepContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: "#555",
    
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  buttonPrimary: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonTextPrimary: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    backgroundColor: "#e3f2fd",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonTextSecondary: {
    color: "#1565c0",
    fontSize: 16,
    fontWeight: "500",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: 'baseline'
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
  },
  optionButton: {
    width: "45%",
    margin: "2.5%",
    padding: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  optionButtonSelected: {
    borderColor: "#2e7d32",
    backgroundColor: "#e8f5e9",
  },
  optionText: {
    color: "#333",
    textAlign: 'center'
  },
  optionTextSelected: {
    color: "#2e7d32",
    fontWeight: "600",
  },
  previewImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  value: {
    color: "#1f2937",
    fontWeight: "500",
  },
});
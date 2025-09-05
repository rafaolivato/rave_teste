import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from 'expo-router';
import React, { JSX } from 'react';

// Tipagem para o objeto de estilos
interface StyleSheetProps {
  container: object;
  header: object;
  profileButton: object;
  titleBox: object;
  logo: object;
  nomedomunicipio: object;
  actions: object;
  button: object;
  context: object;
  footer: object;
  logorave: object;
}

export default function Index(): JSX.Element {
  return (
    <View style={styles.container}>
      {/* Topo */}
      <View style={styles.header}>
        <View style={styles.titleBox}>
          <Image
            style={styles.logo}
            source={require("../assets/images/brasao.png")}
          />
          <Text style={styles.nomedomunicipio}>XINGUARA</Text>
        </View>
        <Link href="../perfil" asChild>
          <Pressable style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={40} color="#144480" />
          </Pressable>
        </Link>
      </View>

      {/* Ações */}
      <View style={styles.actions}>
        <Link href="../notificacao" asChild>
          <Pressable style={styles.button}>
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
            <Text style={styles.context}>Cadastrar Notificação</Text>
          </Pressable>
        </Link>

        <Pressable style={styles.button}>
          <Ionicons name="search-outline" size={22} color="#fff" />
          <Text style={styles.context}>Consultar Notificação</Text>
        </Pressable>
      </View>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Image
          style={styles.logorave}
          source={require("../assets/images/logorave.png")}
        />
      </View>
    </View>
  );
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7ff",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    borderBottomWidth: 0,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  profileButton: {
    backgroundColor: "#f2f4f7",
    borderRadius: 50,
    padding: 6,
  },
  titleBox: {
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 10,
  },
  nomedomunicipio: {
    fontSize: 22,
    color: "#144480",
    fontWeight: "700",
    marginTop: 5,
    letterSpacing: 1,
  },
  actions: {
    alignItems: "center",
    gap: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#144480",
    padding: 15,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#0f335c",
    width: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  context: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logorave: {
    width: 180,
    height: 120,
    resizeMode: "contain",
  },
});

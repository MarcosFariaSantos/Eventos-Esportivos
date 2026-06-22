import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { account } from "../appwrite";

export default function Perfil() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("Usuário");
  const [userEmail, setUserEmail] = useState("");

  // Buscar dados do usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUserName(user.name || user.email);
        setUserEmail(user.email);
      } catch (err) {
        console.log("Erro ao buscar usuário:", err);
      }
    };
    fetchUser();
  }, []);

  // Função de logout
  const handleLogout = async () => {
    await AsyncStorage.clear(); // limpa dados salvos

    const parentNav = navigation.getParent(); // pega o Stack acima do Tab
    if (parentNav) {
      parentNav.reset({
        index: 0,
        routes: [{ name: "Inicio" }], // volta para Login no Stack principal
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Foto de perfil */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{userName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.cameraIcon}>
          <Text style={styles.cameraText}>📷</Text>
        </View>
      </View>

      {/* Nome e tipo */}
      <Text style={styles.name}>{userName}</Text>
      <Text style={styles.role}>JOGADOR</Text>

      {/* Seções */}
      <View style={styles.section}>
        <Text style={styles.label}>E-MAIL:</Text>
        <Text style={styles.value}>{userEmail}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>MÉTODOS DE PAGAMENTO:</Text>
        <Text style={styles.value}>Cartão e Pix</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>CONFIGURAÇÕES:</Text>
        <Text style={styles.value}>Privacidade, Notificações...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>SOBRE O APP:</Text>
        <Text style={styles.value}>Informações gerais</Text>
      </View>

      {/* Botão sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", alignItems: "center", paddingTop: 40 },
  avatarContainer: { position: "relative", marginBottom: 15 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#22c55e",
    borderRadius: 15,
    padding: 5,
  },
  cameraText: { fontSize: 14 },
  name: { color: "#fff", fontSize: 24, fontWeight: "bold", marginTop: 10 },
  role: { color: "#22c55e", fontSize: 16, marginBottom: 20 },
  section: { width: "90%", marginBottom: 15 },
  label: { color: "#94a3b8", fontSize: 14, fontWeight: "bold" },
  value: { color: "#fff", fontSize: 16, marginTop: 3 },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

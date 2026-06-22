import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { account } from "../appwrite"; // importa o account para pegar usuário

export default function PerfilOrganizador() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("Usuário");
  const [userEmail, setUserEmail] = useState("");

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

  const handleLogout = async () => {
    const parentNav = navigation.getParent();
    if (parentNav) {
      parentNav.reset({
        index: 0,
        routes: [{ name: "Inicio" }],
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Nome e tipo */}
      <Text style={styles.title}>{userName}</Text>
      <Text style={styles.subtitle}>ORGANIZADOR MASTER</Text>

      {/* Seções */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>E-MAIL DE CONTATO:</Text>
        <Text style={styles.sectionText}>{userEmail}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>GERENCIAR QUADRAS:</Text>
        <Text style={styles.sectionText}>Configuração e Fotos</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RELATÓRIOS & VENDAS:</Text>
        <Text style={styles.sectionText}>Ver faturamento</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONFIGURAÇÕES DO APP:</Text>
        <Text style={styles.sectionText}>Notificações e Suporte</Text>
      </View>

      {/* Botão sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  title: { color: "#22c55e", fontSize: 24, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "#94a3b8", fontSize: 16, marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { color: "#22c55e", fontSize: 16, fontWeight: "bold" },
  sectionText: { color: "#fff", fontSize: 15, marginTop: 5 },
  logoutButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 30,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Favoritos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favoritos</Text>

      {/* Ícone coração dentro do círculo */}
      <View style={styles.iconCircle}>
        <Text style={styles.heartIcon}>❤️</Text>
      </View>

      {/* Texto informativo */}
      <Text style={styles.message}>Nenhuma quadra favoritada ainda.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // fundo branco igual ao print
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffe4e6", // rosa claro
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  heartIcon: {
    fontSize: 40,
    color: "#dc2626", // vermelho forte
  },
  message: {
    fontSize: 16,
    color: "#374151", // cinza escuro
    textAlign: "center",
  },
});
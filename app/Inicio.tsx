import { useRouter } from "expo-router";
import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Inicio() {
  const router = useRouter();

  return (
     <ImageBackground
      source={{
        uri: "https://img.criativodahora.com.br/2024/03/criativo-66007bcef279aimg-2024-03-2466007bcef27a0.jpg", // quadra iluminada profissional
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>SPORTCONNECT PRO</Text>
        <Text style={styles.subtitle}>Onde o esporte ganha vida.</Text>

        {/* Botão COMEÇAR AGORA → vai para Opção */}
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/Opcao")}>
          <Text style={styles.btnText}>COMEÇAR AGORA</Text>
        </TouchableOpacity>

        {/* Botão ENTRAR NA MINHA CONTA → vai para Login */}
        <TouchableOpacity style={styles.btn} onPress={() => router.push("/login")}>
          <Text style={styles.btnText}>Entrar na minha conta</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>

  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 30,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#39FF14", // verde fluorescente
    paddingVertical: 22,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginVertical: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
});
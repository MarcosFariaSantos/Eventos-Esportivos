import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";

export default function Opcao() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <ImageBackground
      source={{
        uri: "https://img.criativodahora.com.br/2024/03/criativo-66007bcef279aimg-2024-03-2466007bcef27a0.jpg",
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Como quer usar o app?</Text>

        <Pressable
          style={[
            styles.btn,
            selected === "jogar" && { backgroundColor: "#39FF14" },
          ]}
          onPress={() => setSelected("jogar")}
        >
          <Text style={styles.btnText}>QUERO JOGAR</Text>
          <Text style={styles.subText}>Encontrar racha e garantir vaga</Text>
        </Pressable>

        <Pressable
          style={[
            styles.btn,
            selected === "organizar" && { backgroundColor: "#39FF14" },
          ]}
          onPress={() => setSelected("organizar")}
        >
          <Text style={styles.btnText}>QUERO ORGANIZAR</Text>
          <Text style={styles.subText}>Gerenciar quadras e eventos</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, { marginTop: 40 }]}
          onPress={() => router.push("/cadastro")} // agora CONTINUAR leva para cadastro.tsx
        >
          <Text style={styles.btnText}>CONTINUAR</Text>
        </Pressable>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
  },
  btn: {
    backgroundColor: "#222",
    width: "85%",
    paddingVertical: 30,
    paddingHorizontal: 50,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  subText: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});
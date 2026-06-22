import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ID } from "appwrite";
import { useRouter } from "expo-router";
import { account, databases } from "../appwrite";

const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_ID = "usuarios";

export default function Cadastro() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState<"jogador" | "organizador" | "">("");

  const cadastrar = async () => {
    if (!nome || !email || !senha || !tipo) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      await account.deleteSession("current").catch(() => {});
      const newUser = await account.create(ID.unique(), email, senha, nome);

      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          nome,
          email,
          tipo,
          userId: newUser.$id,
        }
      );

      alert("Conta criada com sucesso!");
      router.push("/login");
    } catch (error: any) {
      if (error.code === 409) {
        alert("Esse e-mail já está cadastrado. Faça login.");
      } else {
        alert("Erro no cadastro: " + error.message);
      }
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://img.criativodahora.com.br/2024/03/criativo-66007bcef279aimg-2024-03-2466007bcef27a0.jpg",
      }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Criar Conta</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#94a3b8"
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          onChangeText={setSenha}
        />

        <View style={styles.tipoContainer}>
          <TouchableOpacity
            style={[styles.tipoBtn, tipo === "jogador" && styles.tipoSelecionado]}
            onPress={() => setTipo("jogador")}
          >
            <Text style={styles.tipoText}>Jogador</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tipoBtn, tipo === "organizador" && styles.tipoSelecionado]}
            onPress={() => setTipo("organizador")}
          >
            <Text style={styles.tipoText}>Organizador</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={cadastrar}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.link}>Já tenho conta</Text>
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
    padding: 20,
  },
  title: { color: "#fff", fontSize: 26, marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { color: "#3b82f6", marginTop: 15, textAlign: "center" },
  tipoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 10,
  },
  tipoBtn: { backgroundColor: "#1e293b", padding: 12, borderRadius: 8 },
  tipoSelecionado: { backgroundColor: "#3b82f6" },
  tipoText: { color: "#fff" },
});
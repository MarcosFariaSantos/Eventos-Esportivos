import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Query } from "appwrite";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { account, databases } from "../appwrite";

type RootStackParamList = {
  Login: undefined;
  PainelOrganizador: undefined;
  PainelJogador: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_ID = "usuarios";

export default function Login() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      await account.deleteSession("current").catch(() => {});
      await account.createEmailPasswordSession(email, senha);
      const user = await account.get();

      const userDocs = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal("email", user.email),
      ]);

      if (userDocs.documents.length > 0) {
        const perfil = userDocs.documents[0];
        if (perfil.tipo === "organizador") {
          navigation.navigate("PainelOrganizador");
        } else {
          navigation.navigate("PainelJogador");
        }
      } else {
        alert("Perfil não encontrado.");
      }
    } catch (err: any) {
      alert("Erro no login: " + err.message);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://img.criativodahora.com.br/2024/03/criativo-66007bcef279aimg-2024-03-2466007bcef27a0.jpg" }}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Bem-vindo de volta.</Text>
        <Text style={styles.subtitle}>Sentimos sua falta no campo.</Text>

        <TextInput
          style={styles.input}
          placeholder="Seu e-mail"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Sua senha"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Esqueceu a senha?</Text>
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
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "#94a3b8", fontSize: 16, marginBottom: 30 },
  input: {
    width: "100%",
    backgroundColor: "#1e293b",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  forgotPassword: { color: "#22c55e", marginTop: 15, fontSize: 14 },
});
import { useFocusEffect } from "@react-navigation/native";
import { Query } from "appwrite";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { account, databases } from "../appwrite";

const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_ID = "quadras";

export default function Quadras({ navigation }: any) {
  const [quadras, setQuadras] = useState<any[]>([]);

  const fetchQuadras = async () => {
    try {
      const user = await account.get();
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal("organizadorId", user.$id), // filtra só quadras do usuário logado
          Query.orderDesc("$createdAt"),
        ]
      );
      setQuadras(res.documents);
    } catch (err) {
      console.log("Erro ao buscar quadras:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchQuadras();
    }, [])
  );

  // Função para deletar quadra
  const handleDelete = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      Alert.alert("Sucesso", "Quadra deletada com sucesso!");
      fetchQuadras(); // atualiza lista
    } catch (err: any) {
      Alert.alert("Erro", "Erro ao deletar quadra: " + err.message);
    }
  };

const handleUpdate = (quadra: any) => {
  navigation.navigate("CadastroQuadra", { quadraId: quadra.$id });
};






  const renderQuadra = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.nomeLocal}</Text>
      <Text style={styles.cardText}>{item.endereco}</Text>
      <Text style={styles.cardText}>Tel: {item.telefone}</Text>
      <Text style={styles.cardText}>CNPJ: {item.cnpj}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => handleUpdate(item)}
        >
          <Text style={styles.actionText}>Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.$id)}
        >
          <Text style={styles.actionText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Quadras</Text>

      {quadras.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Você ainda não possui quadras cadastradas.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("CadastroQuadra")}
          >
            <Text style={styles.buttonText}>Cadastrar Agora</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={quadras}
          keyExtractor={(item) => item.$id}
          renderItem={renderQuadra}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CadastroQuadra")}
      >
        <Text style={styles.fabText}>+ Nova</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  emptyBox: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 16, color: "#555", marginBottom: 20, textAlign: "center" },
  button: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "green",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
  },
  fabText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  card: {
    backgroundColor: "#f1f5f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#111" },
  cardText: { fontSize: 14, color: "#333" },
  actionsRow: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  updateButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  actionText: { color: "#fff", fontWeight: "bold" },
});

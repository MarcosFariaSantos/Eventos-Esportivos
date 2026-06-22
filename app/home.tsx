import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";


import { useRouter } from "expo-router";
import { databases } from "../appwrite";

const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_ID = "eventos";

export default function Home() {
  const [eventos, setEventos] = useState<any[]>([]);
  const router = useRouter();

  const carregar = async () => {
    try {
      const res: any = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID
      );

      setEventos(res.documents || []);
    } catch (error) {
      console.log("Erro:", error);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Eventos</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.push("/criarEvento")}>
            <Text style={styles.btnCriar}>+ Criar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/perfil")}>
            <Text style={styles.btnPerfil}>Perfil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LISTA */}
      <FlatList
        data={eventos}
        keyExtractor={(item: any) => item.$id}
        renderItem={({ item }: any) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.info}>📍 {item.local}</Text>
            <Text style={styles.info}>📅 {item.data}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum evento encontrado</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20
  },

  header: {
    marginBottom: 20
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold"
  },

  actions: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10
  },

  btnCriar: {
    backgroundColor: "#22c55e",
    color: "#fff",
    padding: 10,
    borderRadius: 8
  },

  btnPerfil: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: 10,
    borderRadius: 8
  },

  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12
  },

  nome: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },

  info: {
    color: "#94a3b8",
    marginTop: 5
  },

  empty: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 20
  }
});
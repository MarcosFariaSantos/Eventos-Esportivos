import { Query } from "appwrite";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { account, databases } from "../appwrite";

const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_EVENTOS = "eventos";

export default function ListaEventos({ navigation }: any) {
  const [eventos, setEventos] = useState<any[]>([]);
const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_QUADRAS = "quadras";

const buscarQuadra = async (quadraId: string) => {
  try {
    const res = await databases.getDocument(DATABASE_ID, COLLECTION_QUADRAS, quadraId);
    return res; // aqui você terá nomeLocal, telefone, endereco etc.
  } catch (err) {
    console.error("Erro ao buscar quadra:", err);
    return null;
  }
};
 useEffect(() => {
  const fetchEventos = async () => {
    try {
      const user = await account.get();
      const eventosRes = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_EVENTOS,
        [Query.equal("organizadorId", user.$id)]
      );

      // Para cada evento, buscar a quadra
      const eventosComQuadra = await Promise.all(
        eventosRes.documents.map(async (ev) => {
          const quadra = await buscarQuadra(ev.quadraId);
          return {
            ...ev,
            quadraNome: quadra?.nomeLocal,
            quadraTelefone: quadra?.telefone,
            quadraEndereco: quadra?.endereco,
          };
        })
      );

      setEventos(eventosComQuadra);
    } catch (err) {
      console.log("Erro ao buscar eventos:", err);
    }
  };

  fetchEventos();
}, []);
  const excluirEvento = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_EVENTOS, id);
      setEventos(eventos.filter((ev) => ev.$id !== id));
    } catch (err) {
      console.log("Erro ao excluir evento:", err);
    }
  };

 const atualizarEvento = (evento: any) => {
  navigation.navigate("Criar", {
    screen: "CriarEvento",
    params: { eventoId: evento.$id },
  });
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Todos os Eventos</Text>

      {eventos.length === 0 ? (
        <Text style={{ color: "#fff" }}>Nenhum evento encontrado.</Text>
      ) : (
        eventos.map((ev) => (
          <View key={ev.$id} style={styles.card}>
  <Text style={styles.nome}>{ev.nome}</Text>
  <Text style={styles.info}>
    {ev.data} • {ev.hora}
  </Text>
  <Text style={styles.info}>Vagas: {ev.numJogadores}</Text>

  {/* Aqui você mostra os dados da quadra */}
  <Text style={styles.info}>Quadra: {ev.quadraNome || ev.quadraId}</Text>
  <Text style={styles.info}>Telefone: {ev.quadraTelefone}</Text>
  <Text style={styles.info}>Endereço: {ev.quadraEndereco}</Text>

  <View style={styles.buttonsRow}>
    <TouchableOpacity
      style={styles.btnUpdate}
      onPress={() => atualizarEvento(ev)}
    >
      <Text style={styles.btnText}>Atualizar</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.btnDelete}
      onPress={() => excluirEvento(ev.$id)}
    >
      <Text style={styles.btnText}>Excluir</Text>
    </TouchableOpacity>
  </View>
</View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  header: { color: "#22c55e", fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  nome: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  info: { color: "#94a3b8", marginTop: 3 },
  buttonsRow: { flexDirection: "row", marginTop: 10 },
  btnUpdate: {
    backgroundColor: "#22c55e",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  btnDelete: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 5,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});

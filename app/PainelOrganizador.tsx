import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Query } from "appwrite";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { account, databases } from "../appwrite";
import CadastroQuadra from "./CadastroQuadra";
import CriarEvento from "./criarEvento";
import ListaEventos from "./ListarEventos";
import PerfilOrganizador from "./PerfilOrganizador";
import Quadras from "./Quadras";

const Tab = createBottomTabNavigator();

const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_QUADRAS = "quadras";
const COLLECTION_EVENTOS = "eventos";

// Tela Dashboard (PainelOrganizador)
function PainelOrganizador() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState("Usuário");
  const [eventos, setEventos] = useState<any[]>([]);
  const [receitaTotal, setReceitaTotal] = useState(0);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const user = await account.get();
        setUserName(user.name || user.email);

        // Buscar quadras do organizador
        const quadrasRes = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_QUADRAS,
          [Query.equal("organizadorId", user.$id)]
        );
        const quadraIds = quadrasRes.documents.map((q) => q.$id);

        // Buscar eventos vinculados às quadras
     // Buscar eventos criados pelo organizador
const eventosRes = await databases.listDocuments(
  DATABASE_ID,
  COLLECTION_EVENTOS,
  [Query.equal("criadorId", user.$id)]
);
setEventos(eventosRes.documents);

// Calcular receita total
let receita = 0;
eventosRes.documents.forEach((ev) => {
  const valor = parseFloat(ev.valorPorVaga || 0);
  const vagas = parseInt(ev.numJogadores || 0);
  receita += valor * vagas;
});
setReceitaTotal(receita);

      } catch (err) {
        console.log("Erro ao buscar eventos:", err);
      }
    };

    fetchEventos();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>PAINEL DE CONTROLE</Text>
      <Text style={styles.greeting}>Bem-vindo, {userName}!</Text>
      <Text style={styles.subtitleHeader}>Gerencie suas quadras e eventos</Text>

      {/* Caixa branca com borda tracejada */}
      <View style={styles.box}>
        <TouchableOpacity
          style={styles.circle}
          onPress={() => (navigation as any).navigate("CadastroQuadra")}
        >
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cadastre sua Quadra</Text>
        <Text style={styles.subtitle}>
          Sua jornada começa aqui. Adicione os detalhes do seu local para começar a lucrar com eventos.
        </Text>
      </View>

      <View style={styles.cardsRow}>
        <View style={styles.cardDark}>
          <Text style={styles.cardTitle}>EVENTOS</Text>
          <Text style={styles.cardValue}>{eventos.length}</Text>
        </View>
        <View style={styles.cardLight}>
          <Text style={styles.cardTitleLight}>RECEITA</Text>
          <Text style={styles.cardValueGreen}>R$ {receitaTotal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Eventos</Text>
        <TouchableOpacity onPress={() => (navigation as any).navigate("ListaEventos")}>
  <Text style={styles.link}>VER TODOS</Text>
</TouchableOpacity>

      </View>

      {eventos.length === 0 ? (
        <Text style={{ color: "#fff" }}>Nenhum evento encontrado.</Text>
      ) : (
        eventos.slice(0, 3).map((ev) => (
          <View key={ev.$id} style={{ marginBottom: 15 }}>
            {/* Nome do evento */}
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              {ev.nome}
            </Text>

            {/* Data e hora */}
            <Text style={{ color: "#94a3b8" }}>
              {ev.data} • {ev.hora}
            </Text>

            {/* Quantidade de jogadores */}
            <Text style={{ color: "#22c55e" }}>
              Vagas: {ev.numJogadores}
            </Text>

            {/* Nome da quadra */}
            <Text style={{ color: "#94a3b8" }}>
              Quadra: {ev.quadraNome || ev.quadraId}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}


const tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack para a aba Criar
function CriarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CriarEvento" component={CriarEvento} />
    </Stack.Navigator>
  );
}

export default function PainelTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f172a",
          borderTopColor: "#1e293b",
        },
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen name="Dashboard" component={PainelOrganizador} />
      <Tab.Screen name="Minhas Quadras" component={Quadras} />
      
      <Tab.Screen name="Criar" component={CriarStack} />
      <Tab.Screen name="Perfil" component={PerfilOrganizador} />
      <Tab.Screen
        name="CadastroQuadra"
        component={CadastroQuadra}
        options={{ tabBarButton: () => null }}
      />
      <Tab.Screen
        name="ListaEventos"
        component={ListaEventos}
        options={{ tabBarButton: () => null }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  header: { color: "#22c55e", fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  greeting: { color: "#fff", fontSize: 18, marginBottom: 5 },
  subtitleHeader: { color: "#94a3b8", fontSize: 14, marginBottom: 20 },
  box: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#22c55e",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  plus: { color: "#fff", fontSize: 28, fontWeight: "bold" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  cardsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  cardDark: {
    backgroundColor: "#1e293b",
    flex: 1,
    padding: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  cardLight: {
    backgroundColor: "#f8fafc",
    flex: 1,
    padding: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  cardTitle: { color: "#fff", fontSize: 16, marginBottom: 10 },
  cardTitleLight: { color: "#0f172a", fontSize: 16, marginBottom: 10 },
  cardValue: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  cardValueGreen: { color: "#22c55e", fontSize: 22, fontWeight: "bold" },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  link: { color: "#22c55e", fontSize: 14, fontWeight: "bold" },
});

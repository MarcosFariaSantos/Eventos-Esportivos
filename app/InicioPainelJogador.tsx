import { Query } from "appwrite";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { account, databases } from "../appwrite";

const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_EVENTOS = "eventos";
const COLLECTION_QUADRAS = "quadras";

export default function InicioPainelJogador() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");
  const [eventos, setEventos] = useState<any[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [participacoes, setParticipacoes] = useState<{ [key: string]: boolean }>({});
  const [userName, setUserName] = useState("Usuário");

  const filters = ["Todos","Futebol","Futsal","Vôlei","Basquete","Tênis","Natação","Outros"];

  // Buscar nome do usuário logado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUserName(user.name || user.email);
      } catch (err) {
        console.log("Erro ao buscar usuário:", err);
      }
    };
    fetchUser();
  }, []);

  const generateWeekDates = (offset: number) => {
    const today = new Date();
    today.setDate(today.getDate() + offset * 7);
    const week: string[] = [];
    const diasSemana = ["DOMINGO","SEGUNDA","TERÇA","QUARTA","QUINTA","SEXTA","SÁBADO"];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const diaSemana = diasSemana[d.getDay()];
      const dia = d.getDate().toString().padStart(2, "0");
      const mes = (d.getMonth() + 1).toString().padStart(2, "0");
      week.push(`${diaSemana} ${dia}/${mes}`);
    }
    return week;
  };

  const visibleDates = generateWeekDates(weekOffset);

  const buscarQuadra = async (quadraId: string) => {
    try {
      const quadra = await databases.getDocument(DATABASE_ID, COLLECTION_QUADRAS, quadraId);
      return quadra;
    } catch {
      return null;
    }
  };

  const buscarEventos = async (dia: string, filtro: string) => {
    try {
      const partes = dia.split(" ");
      const [diaNum, mesNum] = partes[1].split("/");
      const anoAtual = new Date().getFullYear();
      const dataFormatada = `${anoAtual}-${mesNum}-${diaNum}`; // formato YYYY-MM-DD

      const queries: any[] = [Query.equal("data", dataFormatada)];
      if (filtro !== "Todos") {
        queries.push(Query.equal("esporte", filtro));
      }
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_EVENTOS, queries);

      // enriquecer eventos com dados da quadra
      const eventosComQuadra = await Promise.all(
        res.documents.map(async (ev) => {
          const quadra = await buscarQuadra(ev.quadraId);
          return {
            ...ev,
            quadraNome: quadra?.nomeLocal || "Quadra não encontrada",
            quadraEndereco: quadra?.endereco || "Endereço não informado",
            quadraTelefone: quadra?.telefone || "Telefone não informado",
          };
        })
      );

      setEventos(eventosComQuadra);
    } catch (err) {
      console.log("Erro ao buscar eventos:", err);
    }
  };

  // Carregar eventos do dia atual ao abrir a tela
  useEffect(() => {
    const hoje = visibleDates[0];
    setSelectedDate(hoje);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      buscarEventos(selectedDate, selectedFilter);
    }
  }, [selectedDate, selectedFilter]);

  const toggleParticipacao = async (id: string) => {
    try {
      const evento = await databases.getDocument(DATABASE_ID, COLLECTION_EVENTOS, id);
      const user = await account.get();

      let novosParticipantes = [...evento.participantes];

      if (participacoes[id]) {
        novosParticipantes = novosParticipantes.filter((p) => p !== user.$id);
      } else {
        if (evento.participantes.length >= parseInt(evento.numJogadores)) {
          alert("Não há vagas disponíveis!");
          return;
        }
        novosParticipantes.push(user.$id);
      }

      await databases.updateDocument(DATABASE_ID, COLLECTION_EVENTOS, id, {
        participantes: novosParticipantes,
      });

      setParticipacoes((prev) => ({ ...prev, [id]: !prev[id] }));
      setEventos((prev) =>
        prev.map((ev) =>
          ev.$id === id ? { ...ev, participantes: novosParticipantes } : ev
        )
      );
    } catch (err) {
      console.log("Erro ao atualizar participação:", err);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>BEM VINDO, {userName}!</Text>

      {/* Mini calendário */}
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.arrow} onPress={() => setWeekOffset(weekOffset - 1)}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {visibleDates.map((dia, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dateBox, selectedDate === dia && styles.dateBoxActive]}
              onPress={() => setSelectedDate(dia)}
            >
              <Text style={[styles.dateText, selectedDate === dia && styles.dateTextActive]}>
                {dia}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.arrow} onPress={() => setWeekOffset(weekOffset + 1)}>
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {filters.map((filtro, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.filterBox, selectedFilter === filtro && styles.filterBoxActive]}
            onPress={() => setSelectedFilter(filtro)}
          >
            <Text style={[styles.filterText, selectedFilter === filtro && styles.filterTextActive]}>
              {filtro}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Partidas Disponíveis</Text>
      <Text style={styles.sectionSubtitle}>Escolha uma data e veja os eventos</Text>

      {eventos.length === 0 ? (
        <Text style={styles.empty}>Nenhum evento encontrado para {selectedDate}.</Text>
      ) : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <View style={styles.matchCard}>
              <Text style={styles.matchSport}>{item.esporte}</Text>
              <Text style={styles.matchTitle}>{item.nome}</Text>
              <Text style={styles.matchInfo}>Quadra: {item.quadraNome}</Text>
              <Text style={styles.matchInfo}>Endereço: {item.quadraEndereco}</Text>
              <Text style={styles.matchInfo}>Telefone: {item.quadraTelefone}</Text>
              <Text style={styles.matchInfo}>Hora: {item.hora}</Text>
              <Text style={styles.matchInfo}>Organizador: {item.criadorId}</Text>
              <Text style={styles.matchInfo}>
                Vagas restantes: {item.numJogadores - item.participantes.length}
              </Text>

              <TouchableOpacity
                style={[
                  styles.participarBtn,
                  participacoes[item.$id] && styles.participarBtnActive,
                ]}
                onPress={() => toggleParticipacao(item.$id)}
              >
                <Text style={styles.participarText}>
                  {participacoes[item.$id] ? "Sair do evento" : "Participar"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },

  greeting: { 
    color: "#fff", 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
    textAlign: "center"
  },

  dateRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  arrow: { paddingHorizontal: 10 },
  arrowText: { color: "#22c55e", fontSize: 26, fontWeight: "bold" },

  dateBox: {
    backgroundColor: "#1e293b",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginRight: 10,
  },
  dateBoxActive: { backgroundColor: "#22c55e" },
  dateText: { color: "#fff", fontSize: 16 },
  dateTextActive: { color: "#fff", fontWeight: "bold" },

  filterRow: { flexDirection: "row", marginBottom: 20 },
  filterBox: {
    backgroundColor: "#1e293b",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  filterBoxActive: { backgroundColor: "#22c55e" },
  filterText: { color: "#fff", fontSize: 15 },
  filterTextActive: { color: "#fff", fontWeight: "bold" },

  sectionTitle: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 5,
    textAlign: "center"
  },
  sectionSubtitle: { color: "#94a3b8", fontSize: 15, marginBottom: 15, textAlign: "center" },
  empty: { color: "#94a3b8", textAlign: "center", marginTop: 20 },

  matchCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#22c55e",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  matchSport: { 
    color: "#22c55e", 
    fontSize: 18, 
    fontWeight: "bold",
    marginBottom: 5 
  },

  matchTitle: { 
    color: "#fff", 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 5 
  },

  matchInfo: { 
    color: "#facc15", // amarelo para destaque
    fontSize: 16, 
    fontWeight: "600",
    marginTop: 5 
  },

  participarBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  participarBtnActive: {
    backgroundColor: "#16a34a", // verde mais escuro quando ativo
  },
  participarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase", // deixa em maiúsculas
  },
});

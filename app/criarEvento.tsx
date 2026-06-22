import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Query } from "appwrite";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { account, databases, ID } from "../appwrite";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  title: { color: "#22c55e", fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  subtitle: { color: "#fff", fontSize: 16, marginBottom: 10 },
  steps: { color: "#94a3b8", marginBottom: 20 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", marginTop: 15 },
  summary: { color: "#94a3b8", marginTop: 5 },
  button: {
    backgroundColor: "#22c55e",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  navRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  input: {
    backgroundColor: "#1e293b",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: "#1e293b",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    margin: 5,
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  optionButtonSelected: { backgroundColor: "#22c55e" },
  optionText: { color: "#fff", fontWeight: "bold" },
  quadraButton: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 6,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#22c55e",
  },
  quadraButtonSelected: { backgroundColor: "#22c55e" },
  quadraText: { color: "#fff", fontWeight: "bold" },
});

const DATABASE_ID = "69c70c7500010a3556b3";
const COLLECTION_QUADRAS = "quadras";
const COLLECTION_EVENTOS = "eventos";

export default function CriarEvento() {
  const navigation = useNavigation();
  const route: any = useRoute();
  const eventoId = route?.params?.eventoId;
const [horaSelecionada, setHoraSelecionada] = useState(new Date());

  const [step, setStep] = useState(1);
  const [quadras, setQuadras] = useState<any[]>([]);
  const [quadraId, setQuadraId] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [esporte, setEsporte] = useState("");
  const [formato, setFormato] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [nivel, setNivel] = useState("");
  const [data, setData] = useState<Date | null>(null);
  const [hora, setHora] = useState("");
  const [numJogadores, setNumJogadores] = useState("");
  const [valorPorVaga, setValorPorVaga] = useState("");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

const nextStep = () => setStep((prev) => prev + 1);
const prevStep = () => setStep((prev) => prev - 1);



const [nome, setNome] = useState(""); // campo do evento, substitui o antigo "titulo"

  useEffect(() => {
  const prepararTela = async () => {
    try {
      const user = await account.get();

      // Buscar quadras do organizador
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_QUADRAS,
        [Query.equal("organizadorId", user.$id)]
      );
      setQuadras(response.documents);

      if (!eventoId) {
        // Novo evento → limpa os campos
        setNome("");
        setEsporte("");
        setData(null);
        setHora("");
        setNumJogadores("");
        setValorPorVaga("");
        setQuadraId(null);
      } else {
        // Evento existente → carrega os dados
        const eventoRes = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_EVENTOS,
          eventoId
        );

        setNome(eventoRes.nome || "");
        setEsporte(eventoRes.esporte || "");
        setData(eventoRes.data ? new Date(eventoRes.data) : null);
        setHora(eventoRes.hora || "");
        setNumJogadores(eventoRes.numJogadores?.toString() || "");
        setValorPorVaga(eventoRes.valorPorVaga || "");
        setQuadraId(eventoRes.quadraId || null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  prepararTela();
}, [eventoId]);
const salvarEvento = async () => {
    try {
      const user = await account.get();

      if (!quadraId) {
        alert("Selecione uma quadra antes de publicar o evento.");
        return;
      }

      const evento = {
        nome,
        esporte,
        data: data ? data.toISOString().split("T")[0] : null,
        hora,
        numJogadores: parseInt(numJogadores, 10),
        valorPorVaga,
        quadraId,
        organizadorId: user.$id,
      };

      if (eventoId) {
        await databases.updateDocument(DATABASE_ID, COLLECTION_EVENTOS, eventoId, evento);
        alert("Evento atualizado com sucesso!");
      } else {
        await databases.createDocument(DATABASE_ID, COLLECTION_EVENTOS, ID.unique(), evento);
        alert("Evento criado com sucesso!");
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar evento");
    }
  };



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{eventoId ? "Editar Evento" : "Criar Evento"}</Text>
      <Text style={styles.subtitle}>
        Siga as etapas para {eventoId ? "atualizar" : "publicar"}
      </Text>
      <Text style={styles.steps}>Etapa {step} de 5</Text>
      


    {step === 1 && (
  <View>
    <Text style={styles.sectionTitle}>Selecione sua Quadra</Text>
    {quadras.length === 0 ? (
      <Text>Você ainda não cadastrou nenhuma quadra.</Text>
    ) : (
      quadras.map((q) => (
        <TouchableOpacity
          key={q.$id}
          style={[
            styles.quadraButton,
            quadraId === q.$id && styles.quadraButtonSelected
          ]}
          onPress={() => {
            setQuadraId(q.$id);
          }}
        >
          <Text style={styles.quadraText}>{q.nomeLocal}</Text>
        </TouchableOpacity>
      ))
    )}

    <Text style={styles.sectionTitle}>Nome do Evento</Text>
    <TextInput
      style={styles.input}
      value={nome}
      onChangeText={setNome}
      placeholder="Digite o nome"
      placeholderTextColor="#94a3b8"
    />

    {/* 🔑 Novo bloco para escolher o esporte */}
    <Text style={styles.sectionTitle}>Escolha o Esporte</Text>
    <View style={styles.optionsRow}>
      {["Futebol", "Futsal", "Basquete", "Vôlei", "Natação", "Tênis"].map((opcao) => (
        <TouchableOpacity
          key={opcao}
          style={[
            styles.optionButton,
            esporte === opcao && styles.optionButtonSelected,
          ]}
          onPress={() => setEsporte(opcao)}
        >
          <Text style={styles.optionText}>{opcao}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.navRow}>
      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  </View>
)}



     
      {step === 2 && (
  <View>
    <Text style={styles.sectionTitle}>FORMATO</Text>
    <View style={styles.optionsRow}>
      {["4x4", "5x5", "6x6", "7x7", "1x1"].map((opcao) => (
        <TouchableOpacity
          key={opcao}
          style={[
            styles.optionButton,
            formato === opcao && styles.optionButtonSelected,
          ]}
          onPress={() => setFormato(opcao)}
        >
          <Text style={styles.optionText}>{opcao}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.sectionTitle}>AMBIENTE</Text>
    <View style={styles.optionsRow}>
      {["Coberta", "Descoberta", "Sem informação"].map((opcao) => (
        <TouchableOpacity
          key={opcao}
          style={[
            styles.optionButton,
            ambiente === opcao && styles.optionButtonSelected,
          ]}
          onPress={() => setAmbiente(opcao)}
        >
          <Text style={styles.optionText}>{opcao}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.navRow}>
      <TouchableOpacity style={styles.button} onPress={prevStep}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  </View>
)}


  
{step === 3 && (
  <View>
    <Text style={styles.sectionTitle}>DATA</Text>

    {Platform.OS === "web" ? (
      <DatePicker
        selected={data}
        onChange={(date: Date | null) => {
          if (date) setData(date);
        }}
        dateFormat="dd/MM/yyyy"
      />
    ) : (
      <>
        <Button title="Selecionar Data" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={data || new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setData(selectedDate);
            }}
          />
        )}
      </>
    )}

    <Text style={styles.sectionTitle}>HORÁRIO</Text>

    {Platform.OS === "web" ? (
      <DatePicker
        selected={horaSelecionada}
        onChange={(date: Date | null) => {
          if (date) {
            setHoraSelecionada(date);
            setHora(
              `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
            );
          }
        }}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={30}
        timeCaption="Horário"
        dateFormat="HH:mm"
      />
    ) : (
      <>
        <Button title="Selecionar Hora" onPress={() => setShowTimePicker(true)} />
        {showTimePicker && (
          <DateTimePicker
            value={horaSelecionada} // 🔑 usa o estado separado
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                setHoraSelecionada(selectedTime);
                setHora(
                  `${selectedTime.getHours().toString().padStart(2, "0")}:${selectedTime.getMinutes().toString().padStart(2, "0")}`
                );
              }
            }}
          />
        )}
      </>
    )}

    <View style={styles.navRow}>
      <TouchableOpacity style={styles.button} onPress={prevStep}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  </View>
)}



{step === 4 && (
  <View>
    <Text style={styles.sectionTitle}>NÚMERO DE JOGADORES</Text>
    <TextInput
      style={styles.input}
      value={numJogadores}
      onChangeText={setNumJogadores}
      placeholder="Digite o número de jogadores"
      keyboardType="numeric"
      placeholderTextColor="#94a3b8"
    />

    <Text style={styles.sectionTitle}>NÍVEL</Text>
    <View style={styles.optionsRow}>
      {["Iniciante","Médio","Experiente"].map((opcao) => (
        <TouchableOpacity
          key={opcao}
          style={[styles.optionButton, nivel === opcao && styles.optionButtonSelected]}
          onPress={() => setNivel(opcao)}
        >
          <Text style={styles.optionText}>{opcao}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <Text style={styles.sectionTitle}>PREÇO POR VAGA</Text>
    <TextInput
      style={styles.input}
      value={valorPorVaga}
      onChangeText={setValorPorVaga}
      placeholder="Digite o valor"
      keyboardType="numeric"
      placeholderTextColor="#94a3b8"
    />

    <View style={styles.navRow}>
      <TouchableOpacity style={styles.button} onPress={prevStep}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={nextStep}>
        <Text style={styles.buttonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  </View>
)}


{step === 5 && (
  <View>
   <Text style={styles.sectionTitle}>DATA & HORÁRIO</Text>
<Text style={styles.summary}>
  {data
    ? `${data!.getDate().toString().padStart(2,"0")}/${(data!.getMonth()+1).toString().padStart(2,"0")}/${data!.getFullYear()}`
    : "Data não selecionada"} • às {hora || "Horário não selecionado"}
</Text>



    <Text style={styles.sectionTitle}>VAGAS & NÍVEL</Text>
    <Text style={styles.summary}>{numJogadores || "?"} vagas - {nivel || "?"}</Text>

    <Text style={styles.sectionTitle}>PREÇO POR VAGA</Text>
    <Text style={styles.summary}>R$ {valorPorVaga || "?"}</Text>

    <Text style={styles.sectionTitle}>FORMATO & AMBIENTE</Text>
    <Text style={styles.summary}>{formato || "?"} • {ambiente || "?"}</Text>

    <Text style={styles.sectionTitle}>ESPORTE</Text>
    <Text style={styles.summary}>{esporte || "?"}</Text>

    <View style={styles.navRow}>
      <TouchableOpacity style={styles.button} onPress={prevStep}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={salvarEvento}>
        <Text style={styles.buttonText}>
          {eventoId ? "✔ Atualizar Evento" : "✔ Publicar Evento Agora"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)}
</ScrollView>
   


 
  )}

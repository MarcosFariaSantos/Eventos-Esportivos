import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { account, databases, ID } from "../appwrite";

const DATABASE_ID = "69c70c7500010a3556b3"; 
const COLLECTION_ID = "quadras"; 

export default function CadastroQuadra({ route, navigation }: any) {
  const [quadraId, setQuadraId] = useState<string | null>(null);
  const [nomeLocal, setNomeLocal] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [comodidades, setComodidades] = useState<string[]>([]);

  // Se veio quadraId, buscar dados no banco
  useEffect(() => {
    if (route.params?.quadraId) {
      const fetchQuadra = async () => {
        try {
          const q = await databases.getDocument(DATABASE_ID, COLLECTION_ID, route.params.quadraId);
          setQuadraId(q.$id);
          setNomeLocal(q.nomeLocal);
          setCnpj(q.cnpj);
          setRazaoSocial(q.razaoSocial);
          setCep(q.cep);
          setEndereco(q.endereco);
          setTelefone(q.telefone);
          setDescricao(q.descricao);
          setComodidades(q.comodidades || []);
        } catch (err) {
          console.log("Erro ao carregar quadra:", err);
        }
      };
      fetchQuadra();
    }
  }, [route.params]);

  const toggleComodidade = (item: string) => {
    setComodidades((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleSalvar = async () => {
  try {
    console.log("Iniciando salvar quadra...");
    const user = await account.get();
    console.log("Usuário logado:", user);

    if (quadraId) {
      console.log("Atualizando quadra:", quadraId);
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, quadraId, {
        nomeLocal,
        cep,
        endereco,
        telefone,
        cnpj,
        razaoSocial,
        descricao,
        comodidades,
      });
      Alert.alert("Sucesso", "Quadra atualizada com sucesso!");
    } else {
      console.log("Criando nova quadra...");
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        organizadorId: user.$id,
        nomeLocal,
        cep,
        endereco,
        telefone,
        cnpj,
        razaoSocial,
        descricao,
        comodidades,
      });
      Alert.alert("Sucesso", "Quadra cadastrada com sucesso!");
    }

    navigation.goBack();
  } catch (err: any) {
    console.log("Erro ao salvar quadra:", err);
    Alert.alert("Erro", "Erro ao salvar quadra: " + (err.message || "Verifique o console"));
  }
};


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>
        {quadraId ? "EDITAR QUADRA" : "CADASTRAR QUADRA"}
      </Text>

      <TextInput style={styles.input} placeholder="Nome do Local (Ex: Arena Soccer)" value={nomeLocal} onChangeText={setNomeLocal} />
      <TextInput style={styles.input} placeholder="CNPJ" value={cnpj} onChangeText={setCnpj} />
      <TextInput style={styles.input} placeholder="Razão Social" value={razaoSocial} onChangeText={setRazaoSocial} />

      <Text style={styles.sectionTitle}>LOCALIZAÇÃO & CONTATO</Text>
      <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={setCep} />
      <TextInput style={styles.input} placeholder="Endereço Completo" value={endereco} onChangeText={setEndereco} />
      <TextInput style={styles.input} placeholder="Telefone Comercial" value={telefone} onChangeText={setTelefone} />

      <Text style={styles.sectionTitle}>SOBRE O ESPAÇO</Text>
      <TextInput style={[styles.input, { height: 100 }]} placeholder="Descreva seu espaço, diferenciais, regras..." value={descricao} onChangeText={setDescricao} multiline />

      <Text style={styles.sectionTitle}>COMODIDADES (SELECIONE)</Text>
      <View style={styles.comodidadesRow}>
        {[
          "Vestiário",
          "Estacionamento",
          "Bar/Cantina",
          "Wi-Fi",
          "Iluminação",
          "Bolas/Coletes",
          "Churrasqueira",
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.comodidade,
              comodidades.includes(item) && styles.comodidadeAtiva,
            ]}
            onPress={() => toggleComodidade(item)}
          >
            <Text
              style={[
                styles.comodidadeText,
                comodidades.includes(item) && styles.comodidadeTextAtiva,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>{quadraId ? "Atualizar Quadra" : "Salvar Quadra"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },
  sectionTitle: { color: "#22c55e", fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  input: { backgroundColor: "#1e293b", color: "#fff", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginBottom: 15 },
  comodidadesRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  comodidade: { borderWidth: 1, borderColor: "#22c55e", borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, margin: 5 },
  comodidadeAtiva: { backgroundColor: "#22c55e" },
  comodidadeText: { color: "#22c55e", fontWeight: "bold" },
  comodidadeTextAtiva: { color: "#fff" },
  button: { backgroundColor: "#22c55e", paddingVertical: 14, borderRadius: 8, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

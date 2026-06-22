import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Favoritos from "./Favoritos";
import InicioPainelJogador from "./InicioPainelJogador";
import Mapa from "./Mapa";
import Perfil from "./Perfil";

const Tab = createBottomTabNavigator();

export default function PainelJogador() {
  return (
    <Tab.Navigator
      initialRouteName="Início"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0f172a", borderTopColor: "#1e293b" },
        tabBarActiveTintColor: "#22c55e",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen name="Início" component={InicioPainelJogador} />
      <Tab.Screen name="Mapa" component={Mapa} />
      <Tab.Screen name="Favoritos" component={Favoritos} />
      <Tab.Screen name="Perfil" component={Perfil} />
    </Tab.Navigator>
  );
}
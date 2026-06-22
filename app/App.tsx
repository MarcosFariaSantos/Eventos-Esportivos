import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import Cadastro from "./cadastro";
import Inicio from "./Inicio";
import Login from "./login";

import PainelJogador from "./PainelJogador";
import PainelOrganizador from "./PainelOrganizador";

  export type RootStackParamList = {
  Inicio: undefined;
  Login: undefined;
  Cadastro: undefined;
  PainelJogador: undefined;       // jogador cai aqui
  PainelOrganizador: undefined;

};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="PainelJogador" component={PainelJogador} />   {/* jogador vai pra cá */}
        <Stack.Screen name="PainelOrganizador" component={PainelOrganizador} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
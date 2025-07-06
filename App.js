import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailsPokemonScreen from "./screens/DetailsPokemonScreen";
import Gymleaders_map from "./screens/Gymleaders_map";
import GymQuizScreen from "./screens/GymQuizScreen";
import HotspotListScreen from "./screens/HotspotListScreen";
import SettingsScreen from "./screens/SettingsScreen";
import {DarkModeProvider} from "./DarkModeContext";

const Stack = createStackNavigator();
export default function App() {
  return (
      <DarkModeProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={"Home"} component={HomeScreen} options={{"title": "Home"}}/>
          <Stack.Screen name={"DetailsPokemon"} component={DetailsPokemonScreen} options={{"title": "Details"}}/>
          <Stack.Screen name={"Gymleaders_map"} component={Gymleaders_map} options={{"title": "Gymleaders Map"}}/>
          <Stack.Screen name={"GymQuiz"} component={GymQuizScreen} options={{"title": "Gym Quiz"}}/>
            <Stack.Screen name={"HotSpotList"} component={HotspotListScreen} options={{"title": "Alle Gyms Op Een Rijtje"}}/>
          <Stack.Screen name={"Settings"} component={SettingsScreen} options={{"title": "Instellingen"}}/>
        </Stack.Navigator>
      </NavigationContainer>
      </DarkModeProvider>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

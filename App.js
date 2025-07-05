import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import DetailsPokemonScreen from "./screens/DetailsPokemonScreen";
import Gymleaders_map from "./screens/Gymleaders_map";
import GymQuizScreen from "./screens/GymQuizScreen";

const Stack = createStackNavigator();
export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={"Home"} component={HomeScreen} options={{"title": "Home"}}/>
          <Stack.Screen name={"DetailsPokemon"} component={DetailsPokemonScreen} options={{"title": "Details"}}/>
          <Stack.Screen name={"Gymleaders_map"} component={Gymleaders_map} options={{"title": "Gymleaders Map"}}/>
          <Stack.Screen name={"GymQuiz"} component={GymQuizScreen} options={{"title": "Gym Quiz"}}/>
        </Stack.Navigator>
      </NavigationContainer>

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

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import pokehotspots from '../pokehotspots.json';
import {Alert} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {getDistance} from "geolib";

function Gymleaders_map() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [history, setHistory] = useState([]);
    const [gymleaders, setGymleaders] = useState([]);
    const navigation = useNavigation();
    const [visitedGyms, setVisitedGyms] = useState([])
    const mapRef = React.useRef(null);

    useEffect(() => {
        // Gym data ophalen
        const gymArray = Object.entries(pokehotspots.gyms).map(([key, gym]) => ({
            id: key,
            ...gym,
        }));
        console.log(gymArray);
        setGymleaders(gymArray);

        async function getCurrentLocation() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Locatietoestemming geweigerd');
                return;
            }

            await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;
                    setLocation({ latitude, longitude });

                    setHistory((prev) => [...prev, { latitude, longitude }])

                    gymArray.forEach(gym => {
                        if (gym.location?.latitude && gym.location?.longitude) {
                            const distance = getDistance(
                                { latitude, longitude },
                                { latitude: gym.location.latitude, longitude: gym.location.longitude }
                            )
                            if (distance < 50 && !visitedGyms.includes(gym.id)) {
                                Alert.alert(
                                    'Gym nabij!',
                                    `Je bent in de buurt van de gym ${gym.id}, en de gym leader is ${gym.leader}. Wil je de quiz doen?`,
                                    [
                                        {
                                            text: 'Ja',
                                            onPress: () => {
                                                navigation.navigate('GymQuiz', {
                                                    gymId: gym.id, questions: gym.questions, gym_badge: gym.gym_badge,
                                                });
                                                setVisitedGyms((prev) => [
                                                    ...prev,
                                                    gym.id,
                                                ]);
                                            },
                                        },
                                        {
                                            text: 'Nee',
                                            style: 'cancel',
                                            onPress: () => {
                                                setVisitedGyms((prev) => [
                                                    ...prev,
                                                    gym.id,
                                                ]);
                                            },
                                        },
                                    ]
                                );
                            }
                        }
                    });
                }
            );
        }

        getCurrentLocation();
    }, []);

    // Rendering van de MapView met de locatie van de gebruiker en gymleaders
    return (
        <View style={styles.container}>
            {location && location.latitude && location.longitude ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="CMGT HQ"
                        description="De hoofdkantoor van CMGT"
                        pinColor="red"
                    />
                    {gymleaders.map((gym, index) => (
                        gym.location?.latitude && gym.location?.longitude ? (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: gym.location.latitude,
                                    longitude: gym.location.longitude,
                                }}
                                title={gym.leader}
                                description={`Dit is de gym van ${gym.leader} en bevindt zich bij de ${gym.id}`}
                                pinColor="blue"
                            />
                        ) : null
                    ))}
                    {history.map((location, index) => (
                        location.latitude && location.longitude ? (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                }}
                                title={`Locatie ${index + 1}`}
                                description={`Pin nummer ${index + 1} is op ${location.latitude}, ${location.longitude}`}
                                pinColor="green"
                            />
                        ) : null
                    ))}
                </MapView>
            ) : (
                <Text style={styles.text}>{errorMsg || 'Locatie ophalen...'}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    text: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18,
    },
});

export default Gymleaders_map;

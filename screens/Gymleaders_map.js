import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { getDistance } from 'geolib';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pokehotspots from '../pokehotspots.json';
import { useContext } from 'react';
import { DarkModeContext } from '../DarkModeContext';

const darkMapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
    { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
    { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#263c3f" }] },
    { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#6b9a76" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] },
    { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#212a37" }] },
    { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#9ca5b3" }] },
    { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#746855" }] },
    { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#1f2835" }] },
    { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f3d19c" }] },
    { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#2f3948" }] },
    { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#d59563" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#17263c" }] },
    { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#515c6d" }] },
    { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#17263c" }] }
];

function Gymleaders_map() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [history, setHistory] = useState([]);
    const [gymleaders, setGymleaders] = useState([]);
    const [visitedGyms, setVisitedGyms] = useState([]);
    const navigation = useNavigation();
    const mapRef = useRef(null);
    const { darkMode } = useContext(DarkModeContext);


    useEffect(() => {

        const gymArray = Object.entries(pokehotspots.gyms).map(([key, gym]) => ({
            id: key,
            ...gym,
        }));
        setGymleaders(gymArray);

        const getCurrentLocation = async () => {
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
                    setHistory((prev) => [...prev, { latitude, longitude }]);

                    gymArray.forEach((gym) => {
                        if (gym.location?.latitude && gym.location?.longitude) {
                            const distance = getDistance(
                                { latitude, longitude },
                                { latitude: gym.location.latitude, longitude: gym.location.longitude }
                            );
                            if (distance < 50 && !visitedGyms.includes(gym.id)) {
                                Alert.alert(
                                    'Gym nabij!',
                                    `Je bent in de buurt van de gym ${gym.id}, en de gym leader is ${gym.leader}. Wil je de quiz doen?`,
                                    [
                                        {
                                            text: 'Ja',
                                            onPress: () => {
                                                navigation.navigate('GymQuiz', {
                                                    gymId: gym.id,
                                                    questions: gym.questions,
                                                    gym_badge: gym.gym_badge,
                                                });
                                                setVisitedGyms((prev) => [...prev, gym.id]);
                                            },
                                        },
                                        {
                                            text: 'Nee',
                                            style: 'cancel',
                                            onPress: () => {
                                                setVisitedGyms((prev) => [...prev, gym.id]);
                                            },
                                        },
                                    ]
                                );
                            }
                        }
                    });
                }
            );
        };
        getCurrentLocation();
    }, []);

    return (
        <View style={styles.container}>
            {location ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    customMapStyle={darkMode ? darkMapStyle : []}
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
                    ))}
                    {history.map((loc, index) => (
                        <Marker
                            key={index}
                            coordinate={loc}
                            title={`Locatie ${index + 1}`}
                            description={`Pin op ${loc.latitude}, ${loc.longitude}`}
                            pinColor="green"
                        />
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

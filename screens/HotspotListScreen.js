import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import * as Location from 'expo-location';
import pokehotspots from '../pokehotspots.json';
import NavBar from "../components/NavBar";
import { useContext } from 'react';
import { DarkModeContext } from '../DarkModeContext';

function HotspotListScreen() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [hotspots, setHotspots] = useState([]);
    const { darkMode } = useContext(DarkModeContext);


    useEffect(() => {

        const fetchLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Toegang tot locatie geweigerd');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);
        };




        const hotspotArray = Object.entries(pokehotspots.gyms).map(([key, value]) => ({
            id: key,
            ...value,
        }));
        setHotspots(hotspotArray);

        fetchLocation();

    }, []);

    const openGoogleMaps = (lat, lon) => {
        if (!location) {
            alert('Huidige locatie niet beschikbaar');
            return;
        }

        const url = `https://www.google.com/maps/dir/?api=1&origin=${location.latitude},${location.longitude}&destination=${lat},${lon}&travelmode=walking`;
        Linking.openURL(url);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.item}
            onPress={() => openGoogleMaps(item.location.latitude, item.location.longitude)}
        >
            <Text style={styles.title}>{item.id} - Gym van {item.leader}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, darkMode && { backgroundColor: '#121212' }]}>
            <NavBar darkMode={darkMode} />
            <Text style={[styles.header, darkMode && { color: '#fff' }]}>Hotspotlijst</Text>
            {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
            <FlatList
                data={hotspots}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    item: {
        backgroundColor: '#e0e0e0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});

export default HotspotListScreen;

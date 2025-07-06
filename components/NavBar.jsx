import React from 'react';
import {View, StyleSheet, Pressable, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function NavBar({ darkMode }) {
    const navigation = useNavigation();

    return (
        <View style={[styles.container, darkMode && styles.containerDark]}>
            <Pressable onPress={() => navigation.navigate('Home')}>
                <Text style={[styles.link, darkMode && styles.linkDark]}>Home</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Gymleaders_map')}>
                <Text style={[styles.link, darkMode && styles.linkDark]}>Gyms Op De Map</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('HotSpotList')}>
                <Text style={[styles.link, darkMode && styles.linkDark]}>Hotspots</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Settings')}>
                <Text style={[styles.link, darkMode && styles.linkDark]}>Instellingen</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#eee',
        paddingVertical: 10,
        width: '100%',
    },
    containerDark: {
        backgroundColor: '#222',
    },
    link: {
        fontSize: 16,
        color: '#000',
    },
    linkDark: {
        color: '#fff',
    },
});
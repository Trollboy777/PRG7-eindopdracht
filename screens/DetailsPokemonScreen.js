import React, { useContext } from 'react';
import { Text, View, StyleSheet, Image, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkModeContext } from '../DarkModeContext';

function DetailsPokemonScreen({ route }) {
    const { item } = route.params;
    const navigation = useNavigation();
    const { darkMode } = useContext(DarkModeContext);

    return (
        <ScrollView contentContainerStyle={[styles.container, darkMode && styles.containerDark]}>
            <Text style={[styles.title, darkMode && styles.textDark]}>{item.name.toUpperCase()}</Text>
            <Image source={{ uri: item.image }} style={styles.image} />

            <Text style={[styles.subText, darkMode && styles.textDark]}>#{item.id}</Text>
            <Text style={[styles.subText, darkMode && styles.textDark]}>Type: {item.types.join(', ')}</Text>
            <Text style={[styles.subText, darkMode && styles.textDark]}>Height: {item.height / 10} m</Text>
            <Text style={[styles.subText, darkMode && styles.textDark]}>Weight: {item.weight / 10} kg</Text>

            <Text style={[styles.sectionTitle, darkMode && styles.textDark]}>Stats</Text>
            {item.stats?.map((statObj, index) => (
                <View key={index} style={styles.statRow}>
                    <Text style={[styles.statName, darkMode && styles.textDark]}>{statObj.name.toUpperCase()}</Text>
                    <Text style={[styles.statValue, darkMode && styles.textDark]}>{statObj.base_stat}</Text>
                </View>
            ))}

            <Button title="Back" onPress={() => navigation.goBack()} />
        </ScrollView>
    );
}

export default DetailsPokemonScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 20,
    },
    subText: {
        fontSize: 16,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        marginVertical: 2,
    },
    statName: {
        fontSize: 16,
        fontWeight: '600',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '400',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    textDark: {
        color: '#fff',
    },
});

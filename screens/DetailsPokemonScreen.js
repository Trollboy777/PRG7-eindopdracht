import React from 'react';
import {Text, View, StyleSheet, Image, Button, ScrollView} from 'react-native';
import { useNavigation } from '@react-navigation/native';

function DetailsPokemonScreen({route}) {
    const {item} = route.params;
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{item.name.toUpperCase()}</Text>
            <Image source={{uri: item.image}} style={styles.image} />

            <Text style={styles.subText}>#{item.id}</Text>
            <Text style={styles.subText}>Type: {item.types.join(', ')}</Text>
            <Text style={styles.subText}>Height: {item.height / 10} m</Text>
            <Text style={styles.subText}>Weight: {item.weight / 10} kg</Text>

            <Text style={styles.sectionTitle}>Stats</Text>
            {item.stats?.map((statObj, index) => (
                <View key={index} style={styles.statRow}>
                    <Text style={styles.statName}>{statObj.name.toUpperCase()}</Text>
                    <Text style={styles.statValue}>{statObj.base_stat}</Text>
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
});

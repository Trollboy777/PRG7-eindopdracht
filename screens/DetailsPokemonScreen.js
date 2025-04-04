import React from 'react';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function DetailsPokemonScreen({ route }) {
    const { item } = route.params;
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>#{item.id} {item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>

            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.infoBox}>
                <Text style={styles.label}>Types:</Text>
                <Text style={styles.value}>{item.types.join(', ')}</Text>

                <Text style={styles.label}>Height:</Text>
                <Text style={styles.value}>{item.height / 10} m</Text>

                <Text style={styles.label}>Weight:</Text>
                <Text style={styles.value}>{item.weight / 10} kg</Text>
            </View>

            <Pressable style={styles.button} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Back</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textTransform: 'capitalize',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    infoBox: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
    },
    button: {
        backgroundColor: '#e63946',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DetailsPokemonScreen;

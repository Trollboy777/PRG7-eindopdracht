import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View, FlatList, Image, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import pokemonData from '../pokehotspots.json'

function HomeScreen() {
    const navigation = useNavigation();
    const [pokemons, setPokemons] = useState([]);

    useEffect(() => {

        const formattedPokemons = pokemonData.pokemon_entries.map((entry) => ({
            id: entry.entry_number,
            name: entry.pokemon_species.name,
            types: entry.types,
            height: entry.height,
            weight: entry.weight,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${entry.entry_number}.png`,


        }));
        console.log(formattedPokemons[0]);


        setPokemons(formattedPokemons);
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Pressable style={item.detailButton} onPress={()=> navigation.navigate('DetailsPokemon', {item})}>


            <Text>#{item.id}</Text>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
            </View>
                </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home Screen</Text>
            <FlatList
                data={pokemons}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()} // Zorgt ervoor dat de key een string is
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        marginHorizontal: 16,
    },
    image: {
        width: 64,
        height: 64,
    },
    textContainer: {
        marginLeft: 16,
    },
    name: {
        fontSize: 16,
    },
    detailButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
    }
});

export default HomeScreen;

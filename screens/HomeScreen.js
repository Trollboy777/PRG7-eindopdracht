import React, { useEffect, useState, useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pokemonData from '../pokehotspots.json';
import NavBar from "../components/NavBar";
import { DarkModeContext } from '../DarkModeContext';

function HomeScreen() {
    const navigation = useNavigation();
    const [pokemons, setPokemons] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const PAGE_SIZE = 50;
    const { darkMode } = useContext(DarkModeContext);

    useEffect(() => {
        const formattedPokemons = pokemonData.pokemon_entries.map((entry) => ({
            id: entry.entry_number,
            name: entry.pokemon_species.name,
            types: entry.types,
            height: entry.height,
            weight: entry.weight,
            stats: entry.stats,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${entry.entry_number}.png`,
        }));
        setPokemons(formattedPokemons);
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favoritePokemons');
            if (jsonValue != null) {
                setFavorites(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error('Fout bij laden favorieten', e);
        }
    };

    const toggleFavorite = async (id) => {
        const updatedFavorites = { ...favorites, [id]: !favorites[id] };
        setFavorites(updatedFavorites);
        try {
            await AsyncStorage.setItem('favoritePokemons', JSON.stringify(updatedFavorites));
        } catch (e) {
            console.error('Fout bij opslaan favorieten', e);
        }
    };

    const renderItem = ({ item }) => {
        const isFavorite = favorites[item.id] === true;
        return (
            <View style={[styles.item, darkMode && styles.itemDark]}>
                <Text style={[styles.numberText, darkMode && styles.textDark]}>{`#${item.id}`}</Text>

                <Pressable
                    style={styles.pressableContainer}
                    onPress={() => navigation.navigate('DetailsPokemon', { item })}
                >
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <Text style={[styles.name, darkMode && styles.textDark]}>{item.name}</Text>
                </Pressable>

                <TouchableOpacity
                    onPress={() => toggleFavorite(item.id)}
                    style={styles.favoriteButton}
                >
                    <Text style={[styles.heart, isFavorite ? styles.heartFavorite : styles.heartNotFavorite]}>
                        {isFavorite ? '❤️' : '🤍'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const totalPages = Math.ceil(pokemons.length / PAGE_SIZE);
    const currentPokemons = pokemons.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <View style={[styles.container, darkMode && styles.containerDark]}>
            <NavBar darkMode={darkMode} />

            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    onPress={prevPage}
                    disabled={currentPage === 1}
                    style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                >
                    <Text style={styles.pageButtonText}>Vorige</Text>
                </TouchableOpacity>
                <Text style={[styles.pageInfo, darkMode && styles.textDark]}>
                    Pagina {currentPage} van {totalPages}
                </Text>
                <TouchableOpacity
                    onPress={nextPage}
                    disabled={currentPage === totalPages}
                    style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
                >
                    <Text style={styles.pageButtonText}>Volgende</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={currentPokemons}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
        alignItems: 'center',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    numberText: {
        width: 40,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
        marginHorizontal: 16,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
    itemDark: {
        backgroundColor: '#222',
    },
    pressableContainer: {
        flexShrink: 1,
        marginHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    image: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    name: {
        fontSize: 16,
        color: '#000',
    },
    textDark: {
        color: '#fff',
    },
    favoriteButton: {
        padding: 10,
    },
    heart: {
        fontSize: 28,
    },
    heartFavorite: {
        color: 'red',
    },
    heartNotFavorite: {
        color: 'gray',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
        width: '100%',
    },
    pageButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    disabledButton: {
        backgroundColor: '#aaa',
    },
    pageButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    pageInfo: {
        fontSize: 16,
        color: '#000',
    },
    listContent: {
        paddingBottom: 60,
        paddingHorizontal: 10,
        width: '100%',
    },
});

export default HomeScreen;
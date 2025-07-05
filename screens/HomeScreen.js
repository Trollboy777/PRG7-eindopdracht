import React, { useEffect, useState } from 'react';
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

function HomeScreen() {
    const navigation = useNavigation();
    const [pokemons, setPokemons] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const PAGE_SIZE = 50;

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
        loadDarkMode();
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

    const loadDarkMode = async () => {
        try {
            const value = await AsyncStorage.getItem('darkMode');
            if (value !== null) {
                setDarkMode(value === 'true');
            }
        } catch (e) {
            console.error('Fout bij laden dark mode', e);
        }
    };

    const toggleDarkMode = async () => {
        try {
            const newValue = !darkMode;
            setDarkMode(newValue);
            await AsyncStorage.setItem('darkMode', newValue.toString());
        } catch (e) {
            console.error('Fout bij opslaan dark mode', e);
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
            <View style={styles.item}>
                <Pressable
                    style={[styles.detailButton, darkMode && styles.detailButtonDark]}
                    onPress={() => navigation.navigate('DetailsPokemon', { item, darkMode })}
                >
                    <Text style={[styles.text, darkMode && styles.textDark]}>#{item.id}</Text>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.textContainer}>
                        <Text style={[styles.name, darkMode && styles.textDark]}>{item.name}</Text>
                    </View>
                </Pressable>

                <TouchableOpacity
                    onPress={() => toggleFavorite(item.id)}
                    style={styles.favoriteButton}
                >
                    <Text
                        style={[
                            styles.heart,
                            isFavorite ? styles.heartFavorite : styles.heartNotFavorite,
                        ]}
                    >
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

            <Pressable
                style={[styles.toggleButton, darkMode ? styles.darkToggle : styles.lightToggle]}
                onPress={toggleDarkMode}
            >
                <Text style={styles.toggleText}>
                    {darkMode ? 'Dark Mode Aan' : 'Dark Mode Uit'}
                </Text>
            </Pressable>

            {/* Pagination buttons above the list */}
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
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        marginHorizontal: 16,
        width: '100%',
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
        color: '#000',
    },
    text: {
        color: '#000',
    },
    textDark: {
        color: '#fff',
    },
    detailButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        flex: 1,
    },
    detailButtonDark: {
        backgroundColor: '#880000',
    },
    toggleButton: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    lightToggle: {
        backgroundColor: '#ddd',
    },
    darkToggle: {
        backgroundColor: '#333',
    },
    toggleText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    favoriteButton: {
        marginLeft: 12,
        padding: 8,
    },
    heart: {
        fontSize: 24,
    },
    heartFavorite: {
        color: 'red',
    },
    heartNotFavorite: {
        color: 'gray',
    },

    // Pagination styles
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

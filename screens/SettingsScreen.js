import React, { useContext } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { DarkModeContext } from '../DarkModeContext';

function SettingsScreen() {
    const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

    return (
        <View style={[styles.container, darkMode && styles.containerDark]}>
            <Text style={[styles.label, darkMode && styles.textDark]}>Dark Mode</Text>
            <Switch
                value={darkMode}
                onValueChange={toggleDarkMode}
                thumbColor={darkMode ? "#f4f3f4" : "#f4f3f4"}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    containerDark: {
        backgroundColor: '#121212',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#000',
    },
    textDark: {
        color: '#fff',
    },
});

export default SettingsScreen;

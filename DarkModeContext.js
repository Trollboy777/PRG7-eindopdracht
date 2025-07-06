import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const load = async () => {
            const value = await AsyncStorage.getItem('darkMode');
            if (value !== null) {
                setDarkMode(value === 'true');
            }
        };
        load();
    }, []);

    const toggleDarkMode = async (value) => {
        setDarkMode(value);
        await AsyncStorage.setItem('darkMode', value.toString());
    };

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

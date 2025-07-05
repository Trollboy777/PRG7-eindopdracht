import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuestionCard from '../components/QuestionCard';

function GymQuizScreen({ route }) {
    const { gymId, questions, gym_badge } = route.params;
    const [score, setScore] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCooldown, setIsCooldown] = useState(false);
    const [cooldownTime, setCooldownTime] = useState(60);
    const navigation = useNavigation();
    const currentQuestion = questions[currentQuestionIndex];

    useEffect(() => {
        const checkQuizCompletion = async () => {
            const completed = await AsyncStorage.getItem(`quizCompleted_${gymId}`);
            if (completed) {
                Alert.alert('Je hebt deze quiz al voltooid!');
                navigation.goBack();
            }
        };
        checkQuizCompletion();
    }, []);

    useEffect(() => {
        let cooldownInterval;

        if (isCooldown) {
            cooldownInterval = setInterval(() => {
                setCooldownTime((prev) => {
                    if (prev === 1) {
                        clearInterval(cooldownInterval);
                        setIsCooldown(false);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(cooldownInterval);
    }, [isCooldown]);

    const handleAnswer = async (selectedAnswer) => {
        if (selectedAnswer === currentQuestion.answer) {
            setScore(score + 1);
        } else {
            setIsCooldown(true);
            setCooldownTime(60);
            setTimeout(() => {
                Alert.alert('Fout antwoord', 'Cooldown afgelopen, probeer opnieuw.');
                navigation.goBack();
            }, 60000);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            if (score + 1 === questions.length) {
                // +1 omdat de laatste vraag ook goed was
                Alert.alert('Gefeliciteerd!', `Je hebt de ${gym_badge} Gym Badge verdiend!`);
                await AsyncStorage.setItem(`quizCompleted_${gymId}`, 'true');
                await AsyncStorage.setItem(`earnedBadge_${gymId}`, gym_badge);
                navigation.goBack();
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Quiz voor Gym: {gymId}</Text>
            {isCooldown ? (
                <Text style={styles.cooldownText}>
                    Cooldown: wacht {cooldownTime} seconden...
                </Text>
            ) : (
                <QuestionCard questionObj={currentQuestion} onAnswer={handleAnswer} />
            )}
            <Text style={styles.score}>Score: {score}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    cooldownText: {
        fontSize: 18,
        color: 'red',
        marginBottom: 20,
    },
    score: {
        fontSize: 16,
        marginTop: 20,
    },
});

export default GymQuizScreen;

// components/QuestionCard.jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function QuestionCard({ questionObj, onAnswer }) {
    return (
        <View>
            <Text style={styles.question}>{questionObj.question}</Text>
            {questionObj.options.map((option, index) => (
                <Button key={index} title={option} onPress={() => onAnswer(option)} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    question: {
        fontSize: 18,
        marginBottom: 20,
    },
});

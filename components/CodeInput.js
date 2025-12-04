import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function CodeInput({ length = 4, onCodeChange }) {
    const [code, setCode] = useState(new Array(length).fill(''));
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        onCodeChange(newCode.join(''));

        if (text && index < length - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <View style={styles.container}>
            {code.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => inputs.current[index] = ref}
                    style={styles.input}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="default"
                    autoCapitalize="characters"
                    maxLength={1}
                    selectTextOnFocus
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 32,
    },
    input: {
        width: 60,
        height: 60,
        backgroundColor: '#FFF5F0',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
});

import colors from '@/constants/colors';
import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface CodeInputProps {
    length?: number;
    onCodeChange: (code: string) => void;
}

export default function CodeInput({ length = 4, onCodeChange }: CodeInputProps) {
    const [code, setCode] = useState<string[]>(new Array(length).fill(''));
    const inputs = useRef<(TextInput | null)[]>([]);

    const handleChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        onCodeChange(newCode.join(''));

        if (text && index < length - 1) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.container}>
            {code.map((digit, index) => (
                <TextInput
                    key={index}
                    ref={(ref) => { inputs.current[index] = ref; }}
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
        backgroundColor: colors.white,
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


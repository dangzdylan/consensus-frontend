import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function CodeInput({ length = 4, onCodeChange }) {
    // Validate length
    const validLength = Math.max(4, Math.min(6, parseInt(length, 10) || 4));
    const [code, setCode] = useState(new Array(validLength).fill(''));
    const inputs = useRef([]);
    const timeoutRef = useRef(null);

    const handleChange = (text, index) => {
        // Clear previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // Only allow alphanumeric characters
        const sanitizedText = text.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 1);
        
        const newCode = [...code];
        newCode[index] = sanitizedText;
        setCode(newCode);
        
        const fullCode = newCode.join('');
        if (onCodeChange) {
            onCodeChange(fullCode);
        }

        // Auto-advance to next input
        if (sanitizedText && index < validLength - 1) {
            const nextInput = inputs.current[index + 1];
            if (nextInput) {
                timeoutRef.current = setTimeout(() => {
                    if (nextInput && nextInput.focus) {
                        nextInput.focus();
                    }
                }, 0);
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            // Clear previous timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            
            const prevInput = inputs.current[index - 1];
            if (prevInput) {
                timeoutRef.current = setTimeout(() => {
                    if (prevInput && prevInput.focus) {
                        prevInput.focus();
                    }
                }, 0);
            }
        }
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            {code.map((digit, index) => (
                <TextInput
                    key={`code-input-${index}`}
                    ref={(ref) => {
                        if (ref) {
                            inputs.current[index] = ref;
                        }
                    }}
                    style={styles.input}
                    value={digit}
                    onChangeText={(text) => handleChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="default"
                    autoCapitalize="characters"
                    maxLength={1}
                    selectTextOnFocus
                    autoCorrect={false}
                    autoComplete="off"
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

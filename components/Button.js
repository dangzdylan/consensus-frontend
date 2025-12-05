import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../constants/colors';

export default function Button({ title, onPress, variant = 'primary', style, loading = false, disabled = false }) {
    const isPrimary = variant === 'primary';
    const backgroundColor = disabled ? colors.gray : isPrimary ? colors.white : 'transparent';
    const textColor = disabled ? colors.darkGray : isPrimary ? colors.primary : colors.white;
    const borderColor = isPrimary ? 'transparent' : colors.white;
    const isDisabled = disabled || loading || !onPress;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor, borderColor, borderWidth: isPrimary ? 0 : 2 },
                style,
            ]}
            onPress={isDisabled ? undefined : (onPress || (() => {}))}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <Text style={[styles.text, { color: textColor }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

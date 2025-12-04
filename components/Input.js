import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';

export default function Input({ placeholder, value, onChangeText, secureTextEntry, style, ...props }) {
    return (
        <View style={[styles.container, style]}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.gray}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    input: {
        padding: 16,
        fontSize: 16,
        color: colors.white,
    },
});

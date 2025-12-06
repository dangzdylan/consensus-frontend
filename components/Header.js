import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import Logo from './Logo';

/**
 * Reusable Header Component
 * Displays the Consensus logo in the top left corner
 */
export default function Header({ logoSize = 40, style }) {
    return (
        <SafeAreaView style={[styles.safeArea, style]}>
            <View style={styles.header}>
                <Logo size={logoSize} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'transparent',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
});


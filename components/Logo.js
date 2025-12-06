import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../constants/colors';

/**
 * Consensus Logo Component
 * A minimalist logo with a light orange square containing a face made of darker orange shapes
 */
export default function Logo({ size = 40 }) {
    return (
        <View style={[styles.logoContainer, { width: size, height: size }]}>
            {/* Light orange/peach square with rounded corners */}
            <View style={styles.square}>
                {/* Two circular eyes at the top */}
                <View style={styles.eye} />
                <View style={[styles.eye, styles.eyeRight]} />
                {/* V-shaped or bird-beak-like mouth centered below */}
                <View style={styles.mouth} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    square: {
        width: '100%',
        height: '100%',
        backgroundColor: '#FFB88C', // Light orange/peach color
        borderRadius: 8, // Rounded corners
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    eye: {
        position: 'absolute',
        width: '20%',
        height: '20%',
        borderRadius: 50, // Circular
        backgroundColor: colors.primary, // Darker orange (#F26B3A)
        top: '25%',
        left: '30%',
    },
    eyeRight: {
        left: 'auto',
        right: '30%',
    },
    mouth: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderLeftColor: 'transparent',
        borderRightWidth: 6,
        borderRightColor: 'transparent',
        borderTopWidth: 8,
        borderTopColor: colors.primary, // Darker orange
        bottom: '30%',
        transform: [{ rotate: '180deg' }], // V-shape pointing down
    },
});


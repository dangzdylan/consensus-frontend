import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import colors from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

export default function Card({ item }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    // Get category-based placeholder image URL (free placeholder service)
    const getPlaceholderImage = (category) => {
        // Use placeholder.com - free, no API key needed
        const categoryText = category || 'Activity';
        // Use a simple, reliable placeholder service
        return `https://via.placeholder.com/400x600/F26B3A/FFFFFF?text=${encodeURIComponent(categoryText)}`;
    };

    // Validate and sanitize image URL
    const isValidImageUrl = (url) => {
        if (!url || typeof url !== 'string') return false;
        const trimmed = url.trim();
        if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'None') return false;
        // Must be a valid HTTP/HTTPS URL
        try {
            const urlObj = new URL(trimmed);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (e) {
            return false;
        }
    };

    // Check if image source is valid (URL or local asset)
    // Backend now provides hardcoded Unsplash URLs in image_url field
    const getImageSource = () => {
        // Backend Option model provides both 'image' and 'image_url' (both same value)
        // Prefer image_url as it's the primary field
        const imageUrl = item.image_url || item.image || item.photo_url || item.photo || item.hardcoded_image;
        
        console.log(`[Card] Checking image for ${item.name}:`, imageUrl ? `${imageUrl.substring(0, 80)}...` : 'null/undefined');
        console.log(`[Card] Image type:`, typeof imageUrl);
        console.log(`[Card] Item image fields:`, {
            image: item.image ? `${item.image.substring(0, 50)}...` : 'none',
            image_url: item.image_url ? `${item.image_url.substring(0, 50)}...` : 'none'
        });
        
        // If it's a number, it's a local require() asset
        if (typeof imageUrl === 'number') {
            console.log(`[Card] Using local asset (number)`);
            return imageUrl;
        }
        
        // Validate string URL (backend provides Unsplash URLs like https://images.unsplash.com/...)
        if (typeof imageUrl === 'string') {
            if (isValidImageUrl(imageUrl)) {
                const trimmedUrl = imageUrl.trim();
                console.log(`[Card] Valid image URL (Unsplash): ${trimmedUrl.substring(0, 80)}...`);
                return { uri: trimmedUrl };
            } else {
                console.warn(`[Card] Invalid image URL format:`, imageUrl);
                console.warn(`[Card] URL validation failed. URL:`, imageUrl);
            }
        }
        
        // No valid image - use placeholder
        console.log(`[Card] No valid image URL found for ${item.name}, using placeholder`);
        const placeholderUrl = getPlaceholderImage(item.category);
        return { uri: placeholderUrl };
    };

    const imageSource = getImageSource();
    const hasImage = imageSource !== null;
    
    // Reset error state when item changes
    useEffect(() => {
        setImageError(false);
        setImageLoading(true);
        console.log(`[Card] Rendering card for: ${item.name}`);
        console.log(`[Card] Image source type:`, typeof imageSource === 'object' ? 'uri object' : typeof imageSource);
        if (typeof imageSource === 'object' && imageSource.uri) {
            console.log(`[Card] Image URI: ${imageSource.uri.substring(0, 80)}...`);
        }
    }, [item.id, item.name]);

    // Always try to show an image (either from backend or placeholder)
    return (
        <View style={styles.card}>
            {imageLoading && (
                <View style={[styles.image, styles.imagePlaceholder, styles.loadingOverlay]}>
                    <Ionicons name="image-outline" size={48} color={colors.gray} />
                    <Text style={styles.placeholderText}>Loading image...</Text>
                </View>
            )}
            {imageSource && (
                <Image 
                    source={imageSource} 
                    style={[styles.image, imageLoading && styles.hidden]}
                    onError={(error) => {
                        const imageUrl = item.image || item.image_url || item.photo_url || item.photo;
                        console.error(`[Card] Failed to load image for ${item.name}`);
                        console.error(`[Card] Image URL was:`, imageUrl);
                        console.error(`[Card] Image source:`, imageSource);
                        console.error(`[Card] Error details:`, error.nativeEvent?.error || error);
                        // Fall back to placeholder on error
                        setImageError(true);
                        setImageLoading(false);
                    }}
                    onLoad={() => {
                        console.log(`[Card] Successfully loaded image for ${item.name}`);
                        setImageLoading(false);
                    }}
                    onLoadStart={() => {
                        console.log(`[Card] Starting to load image for ${item.name}`);
                    }}
                />
            )}
            {imageError && (
                <View style={[styles.image, styles.imagePlaceholder]}>
                    <Ionicons name="image-outline" size={48} color={colors.gray} />
                    <Text style={styles.placeholderText}>Image unavailable</Text>
                </View>
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name || 'Unknown Activity'}</Text>
                {item.category && (
                    <Text style={styles.category}>{item.category}</Text>
                )}
                <View style={styles.detailsRow}>
                    <Ionicons name="location-outline" size={16} color={colors.secondary} />
                    <Text style={styles.detailsText}>
                        {item.distance ? `${item.distance} miles` : 'Distance unknown'}
                    </Text>
                    {item.time && (
                        <>
                            <Ionicons name="time-outline" size={16} color={colors.secondary} style={{ marginLeft: 12 }} />
                            <Text style={styles.detailsText}>{item.time}</Text>
                        </>
                    )}
                </View>
                {item.address && (
                    <Text style={styles.address} numberOfLines={2}>
                        {item.address}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: colors.white,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '75%',
        resizeMode: 'cover',
    },
    hidden: {
        position: 'absolute',
        opacity: 0,
        width: 0,
        height: 0,
    },
    imagePlaceholder: {
        backgroundColor: colors.gray + '40',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingOverlay: {
        position: 'absolute',
        zIndex: 1,
    },
    placeholderText: {
        marginTop: 8,
        color: colors.gray,
        fontSize: 14,
    },
    infoContainer: {
        padding: 16,
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 4,
        textAlign: 'center',
    },
    category: {
        fontSize: 14,
        color: colors.gray,
        marginBottom: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    detailsText: {
        marginLeft: 4,
        color: colors.text,
        fontSize: 14,
    },
    address: {
        marginTop: 8,
        fontSize: 12,
        color: colors.gray,
        textAlign: 'center',
        paddingHorizontal: 8,
    },
});

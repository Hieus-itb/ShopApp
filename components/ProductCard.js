import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { imageMap } from '../data/imageMap';
import { Ionicons } from '@expo/vector-icons';

export default function ProductCard({ product, navigation }) {
    return (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('About', { product })}>
            <Image
                source={imageMap[product.image] || imageMap["default"]}
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.name}>{product.name}</Text>
                <Text style={styles.price}>${product.price.toLocaleString()}</Text>
                <View style={styles.row}>
                    <Text style={styles.rating}>⭐ {product.rating}</Text>
                    <Ionicons name="arrow-forward" size={18} color="#FF7F00" />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginVertical: 6,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        color: '#FF7F00',
        fontSize: 14,
        marginBottom: 4,
    },
    rating: {
        fontSize: 12,
        color: '#888',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

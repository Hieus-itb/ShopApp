import React from 'react';
import { FlatList, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { imageMap } from '../data/imageMap';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        margin: 5,
        width: '46%',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 3,
        position: 'relative',
    },
    productImage: { width: '100%', height: 100, borderRadius: 10 },
    heartIcon: {
        position: 'absolute',
        right: 12,
        top: 12,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 4,
    },
    productName: { fontWeight: 'bold', marginTop: 8, fontSize: 14 },
    rowInfo: { flexDirection: 'row', justifyContent: 'space-between' },
    productInfo: { fontSize: 12, color: '#888' },
    productPrice: { marginTop: 5, fontWeight: 'bold', color: '#FF7F00' },
});

const ProductList = ({ products }) => {
    const renderItem = ({ item }) => (
        <View style={styles.productCard}>
            <Image
                source={imageMap[item.image] || imageMap["default"]}
                style={styles.productImage}
            />
            <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart-outline" size={18} color="#FF7F00" />
            </TouchableOpacity>
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.rowInfo}>
                <Text style={styles.productInfo}>⭐ {item.rating}</Text>
                <Text style={styles.productInfo}>📍 {item.distance}</Text>
            </View>
            <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>
        </View>
    );

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            
        />
    );
};

export default ProductList;
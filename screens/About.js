import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { imageMap } from '../data/imageMap';
import { StatusBar } from 'react-native';
import { addToCart } from "../data/cartService";

export default function About({ route, navigation }) {
    const { product } = route.params;
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = async () => {
        try {
            await addToCart(product, quantity);
            alert("Da them vao gio hang");
        } catch (error) {
            alert("Loi khi them vao gio hang");
        }
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.container}>
                {/* Header anh */}
                <ImageBackground
                    source={imageMap[product.image] || imageMap["default"]}
                    style={styles.header}
                    imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
                >
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.heartIcon}>
                            <Ionicons name="heart-outline" size={24} color="#FF7F00" />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>

                {/* Thong tin san pham */}
                <View style={styles.infoContainer}>
                    <Text style={styles.productName}>{product.name} 🍔</Text>
                    <Text style={styles.productPrice}>${product.price.toLocaleString()}</Text>

                    <View style={styles.rowInfo}>
                        <Text>🚚 Free Delivery</Text>
                        <Text>⏱ 20 – 30</Text>
                        <Text>⭐ {product.rating}</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>
                        {product.description || 'This is a delicious product that is highly recommended by our chef.'}
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.boxButton}>
                <View style={styles.quantityContainer}>
                    <View style={styles.quantityRow}>
                        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                            <Ionicons name="remove-circle-outline" size={30} color="#FF7F00" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                            <Ionicons name="add-circle-outline" size={30} color="#FF7F00" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.totalPrice}>Total: ${(product.price * quantity).toLocaleString()}</Text>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                    <Text style={styles.addButtonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginBottom: 90, // Ensure that the button does not overlap with content
    },
    header: {
        width: '100%',
        height: 280,
        paddingTop: StatusBar.currentHeight || 40,
        justifyContent: 'space-between',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    heartIcon: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    backIcon: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 6,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
    },
    infoContainer: { padding: 20 },
    productName: { fontSize: 22, fontWeight: 'bold' },
    productPrice: { color: '#FF7F00', fontSize: 18, marginVertical: 8 },
    rowInfo: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10 },
    description: { fontSize: 14, color: '#555', marginVertical: 8 },
    quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    quantityText: { marginHorizontal: 20, fontSize: 18 },
    boxButton: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff', // To ensure it’s visible against other content
    },
    addButton: {
        width: '90%',
        backgroundColor: '#FF7F00',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 10,
    },
    totalPrice: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FE8C00',
    },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 
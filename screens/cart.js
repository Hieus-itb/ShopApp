import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';

const Cart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            name: 'Burger With Meat',
            price: 12230,
            quantity: 1,
            image: require('../img/burger1.jpg'),
        },
        {
            id: '2',
            name: 'Ordinary Burgers',
            price: 12230,
            quantity: 1,
            image: require('../img/burger2.jpg'),
        },
    ]);

    const handleQuantityChange = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleRemoveItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = 10900;
    const finalPrice = totalPrice - discount;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity><Ionicons name="arrow-back" size={24} /></TouchableOpacity>
                <Text style={styles.headerTitle}>My Cart</Text>
                <TouchableOpacity><Entypo name="dots-three-vertical" size={18} /></TouchableOpacity>
            </View>

            {/* Location */}
            <View style={styles.locationRow}>
                <View>
                    <Text style={styles.locationLabel}>Delivery Location</Text>
                    <Text style={styles.locationText}>Home</Text>
                </View>
                <TouchableOpacity style={styles.changeLocationBtn}>
                    <Text style={styles.changeLocationText}>Change Location</Text>
                </TouchableOpacity>
            </View>

            {/* Promo Code */}
            <View style={styles.promoRow}>
                <TextInput
                    placeholder="Promo Code..."
                    style={styles.promoInput}
                />
                <TouchableOpacity style={styles.applyBtn}>
                    <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
            </View>

            {/* Cart List */}
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <TouchableOpacity>
                            <Ionicons name="checkmark-circle" size={20} color="#FF7F00" />
                        </TouchableOpacity>
                        <Image source={item.image} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
                            <View style={styles.quantityRow}>
                                <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
                                    <Entypo name="minus" size={18} />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
                                    <Entypo name="plus" size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                            <Ionicons name="trash-outline" size={20} color="#FF7F00" />
                        </TouchableOpacity>
                    </View>
                )}
                style={{ marginTop: 10 }}
            />

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Payment Summary</Text>
                <View style={styles.summaryRow}>
                    <Text>Total Items ({totalItems})</Text>
                    <Text>${totalPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Delivery Fee</Text>
                    <Text style={{ color: 'green' }}>Free</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Discount</Text>
                    <Text style={{ color: 'red' }}>-${discount.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>${finalPrice.toLocaleString()}</Text>
                </View>
            </View>

            {/* Order Button */}
            <TouchableOpacity style={styles.orderButton}>
                <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    locationLabel: {
        color: '#666',
    },
    locationText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    changeLocationBtn: {
        borderWidth: 1,
        borderColor: '#FF7F00',
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 10,
    },
    changeLocationText: {
        color: '#FF7F00',
        fontSize: 12,
    },
    promoRow: {
        flexDirection: 'row',
        marginVertical: 15,
        alignItems: 'center',
    },
    promoInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
    },
    applyBtn: {
        backgroundColor: '#FF7F00',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    applyText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 15,
        marginBottom: 10,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    itemPrice: {
        color: '#FF7F00',
        fontWeight: 'bold',
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        gap: 10,
    },
    quantityText: {
        fontWeight: 'bold',
    },
    summaryContainer: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 15,
        marginTop: 10,
    },
    summaryTitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    totalLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    totalPrice: {
        color: '#FF7F00',
        fontWeight: 'bold',
        fontSize: 16,
    },
    orderButton: {
        backgroundColor: '#FF7F00',
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 15,
    },
    orderButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

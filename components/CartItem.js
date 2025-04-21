import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { imageMap } from '../data/imageMap';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    const [selected, setSelected] = useState(false);

    const toggleSelect = () => {
        setSelected(!selected);
    };

    return (
        <View style={styles.cartItem}>
            <Image source={imageMap[item.imageKey]} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toLocaleString()}</Text>
                <View style={styles.quantityRow}>
                    <TouchableOpacity onPress={() => onQuantityChange(item.id, -1)}>
                        <Entypo name="minus" size={18} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => onQuantityChange(item.id, 1)}>
                        <Entypo name="plus" size={18} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity onPress={() => onRemove(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#FF7F00" />
            </TouchableOpacity>
        </View>
    );
};

export default CartItem;

const styles = StyleSheet.create({
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
});

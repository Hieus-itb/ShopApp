import React, { useState } from 'react';
import {
    View, Text, FlatList, StyleSheet,
    SafeAreaView, TouchableOpacity,
    Platform, StatusBar, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getOrdersByUserId } from '../API/api';
import { useFocusEffect } from '@react-navigation/native';

const OrderHistory = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return;

            const { id } = JSON.parse(userData);
            const ordersFromApi = await getOrdersByUserId(id);
            setOrders(ordersFromApi);
        } catch (error) {
           
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadOrders();
        }, [])
    );

    const renderItem = ({ item }) => {
    const itemList = Array.isArray(item.orderItems)
        ? item.orderItems.map(i => `${i.productName} x${i.quantity}`).join(', ')
        : '';

    return (
        <View style={styles.orderCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.date}>{new Date(item.orderDate).toLocaleString()}</Text>
                <Text style={styles.status}>Trạng thái: {item.status}</Text>
            </View>
            <Text style={styles.total}>Tổng cộng: ₫{item.totalPrice.toLocaleString()}</Text>
            <Text>Thuế: ₫{item.tax.toLocaleString()}</Text>
            <Text>Sản phẩm: {itemList}</Text>
            <Text>
                Địa chỉ giao hàng: {item.address.street}, {item.address.city}, {item.address.state}, {item.address .zipCode}
            </Text>
            <Text style={item.isPaid ? styles.paid : styles.unpaid}>
                {item.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </Text>
            
        </View>
    );
};


    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Navigation Bar */}
            <View style={styles.topNavigation}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Order History</Text>
                <View style={{ width: 24 }} /> {/* Placeholder để cân đối */}
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#F14141" style={{ marginTop: 40 }} />
            ) : (
                <FlatList
                    data={[...orders].reverse()}
                    keyExtractor={(_, idx) => idx.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.container}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 40 }}>
                            No orders yet.
                        </Text>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    topNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        padding: 20,
    },
    orderCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    date: {
        color: '#777',
        marginBottom: 6,
    },
    total: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    status: {
    color: '#F14141',
    fontWeight: '600',
    },
    paid: {
    marginTop: 4,
    color: 'green',
    fontWeight: 'bold',
},
unpaid: {
    marginTop: 4,
    color: 'red',
    fontWeight: 'bold',

},

});

export default OrderHistory;

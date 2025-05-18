import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const OrderHistory = ({ navigation }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await AsyncStorage.getItem('orderHistory');
            if (data) setOrders(JSON.parse(data));
        };
        fetchOrders();
    }, []);

    const renderItem = ({ item, index }) => (
        <View style={styles.orderCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.date}>{item.date}</Text>
                <TouchableOpacity
                    onPress={async () => {
                        // Xóa đơn hàng tại vị trí index
                        const newOrders = [...orders];
                        newOrders.splice(index, 1);
                        setOrders(newOrders);
                        await AsyncStorage.setItem('orderHistory', JSON.stringify(newOrders));
                    }}
                >
                    <Ionicons name="trash" size={20} color="#F14141" />
                </TouchableOpacity>
            </View>
            <Text style={styles.total}>Total: ${item.finalPrice.toLocaleString()}</Text>
            <Text>Items: {item.cartItems.map(i => i.name).join(', ')}</Text>
            <Text style={{marginTop: 8, fontWeight: 'bold'}}>Receiver Info:</Text>
            <Text>Name: {item.userInfo?.username || 'N/A'}</Text>
            <Text>Phone: {item.userInfo?.phone || 'N/A'}</Text>
            <Text>Address: {item.userInfo?.address || 'N/A'}</Text>
            <Text>House No.: {item.userInfo?.house || 'N/A'}</Text>
            <Text>City: {item.userInfo?.city || 'N/A'}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Navigation Bar */}
            <View style={styles.topNavigation}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Order History</Text>
                <TouchableOpacity onPress={async () => {
                    await AsyncStorage.removeItem('orderHistory');
                    setOrders([]);
                }}>
                    <Ionicons name="trash" size={22} color="#F14141" />
                </TouchableOpacity>
            </View>
            <FlatList
                data={orders.reverse()}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.container}
                ListEmptyComponent={<Text style={{textAlign:'center', marginTop:40}}>No orders yet.</Text>}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Thêm dòng này
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
    container: { padding: 20 },
    orderCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    date: { color: '#777', marginBottom: 6 },
    total: { fontWeight: 'bold', marginBottom: 4 },
});

export default OrderHistory;
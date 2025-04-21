import React from 'react';
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { imageMap } from '../data/imageMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Payment = ({ route, navigation }) => {
    const { cartItems, totalItems, totalPrice, discount, finalPrice } = route.params;
    const Drive = 50000;
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            const data = await AsyncStorage.getItem('user');
            if (data) {
                setUserInfo(JSON.parse(data));
            }
        };
        fetchUser();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.itemCard}>
            <Image source={imageMap[item.imageKey]} style={styles.itemImage} />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                    ${(item.price * item.quantity).toLocaleString()}
                </Text>
            </View>
            <Text style={styles.itemQuantity}>{item.quantity} items</Text>
        </View>
    );

    const ListHeader = () => (
        <>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment</Text>
                <Entypo name="dots-three-vertical" size={18} />
            </View>

            {/* Subtext */}
            <Text style={styles.subText}>You deserve better meal</Text>

            {/* Section Title */}
            <Text style={styles.sectionTitle}>Item Ordered</Text>
        </>
    );

    const ListFooter = () => (
        <>
            {/* Transaction details */}
            <Text style={styles.sectionTitle}>Details Transaction</Text>
            <View style={styles.details}>
                <DetailRow label="Cherry Healthy" value={`$${totalPrice.toLocaleString()}`} />
                <DetailRow label="Driver" value={`$${Drive.toLocaleString()}`} />
                <DetailRow label="Tax 0%" value="$0" />
                <DetailRow label="Total Price" value={`$${finalPrice.toLocaleString()}`} highlight />
            </View>

            {/* Delivery info */}
            <View style={styles.details}>
                <DetailRow label="Name" value={userInfo.username || 'N/A'} />
                <DetailRow label="Phone No." value={userInfo.phone || 'N/A'} />
                <DetailRow label="Address" value={userInfo.address || 'N/A'} />
                <DetailRow label="House No." value={userInfo.house || 'N/A'} />
                <DetailRow label="City" value={userInfo.city || 'N/A'} />
            </View>


            {/* Checkout Button */}
            <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutText}>Checkout Now</Text>
            </TouchableOpacity>
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={ListFooter}
                renderItem={renderItem}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const DetailRow = ({ label, value, highlight }) => (
    <View style={styles.detailRow}>
        <Text>{label}</Text>
        <Text style={highlight ? styles.highlight : null}>{value}</Text>
    </View>
);

export default Payment;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subText: {
        color: '#777',
        marginVertical: 10,
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 2,
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    itemInfo: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemPrice: {
        color: '#FF7F00',
        marginTop: 4,
    },
    itemQuantity: {
        color: '#777',
        fontSize: 14,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 10,
    },
    details: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    highlight: {
        color: '#FF7F00',
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#FFA500',
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

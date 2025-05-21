import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { imageMap } from '../data/imageMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const paymentMethods = [
    {
        key: 'credit',
        label: 'Thẻ tín dụng',
        desc: 'Thanh toán bằng Visa, Mastercard, v.v.',
        icon: <Ionicons name="card-outline" size={24} color="#FE8C00" />,
    },
    {
        key: 'paypal',
        label: 'PayPal',
        desc: 'Thanh toán bằng tài khoản PayPal',
        icon: <Image source={require('../img/paypal.png')} style={{ width: 24, height: 24 }} />,
    },
    {
        key: 'apple',
        label: 'Thanh toán khi nhận hàng',
        desc: 'Thanh toán tiền mặt khi nhận hàng',
        icon: <Image source={require('../img/buy.png')} style={{ width: 24, height: 24 }} />,
    },
];

const Payment = ({ route, navigation }) => {
    const { cartItems, totalItems, totalPrice, discount, finalPrice } = route.params;
    const [userInfo, setUserInfo] = useState({});
    const [selectedMethod, setSelectedMethod] = useState('credit');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const Drive = 0; // Phí vận chuyển
    const Tax = Math.round(totalPrice * 0.1); // Thuế 10%

    useEffect(() => {
        const fetchUser = async () => {
            const data = await AsyncStorage.getItem('user');
            let arr = [];
            if (data) {
                const user = JSON.parse(data);
                arr = Array.isArray(user.address) ? user.address : [];
                setAddresses(arr);
                setUserInfo({
                    username: user.username,
                    phone: user.phone
                });
            }
            // Lấy địa chỉ đã chọn
            const selected = await AsyncStorage.getItem('selectedAddress');
            if (selected) {
                setSelectedAddress(JSON.parse(selected));
            } else if (arr.length > 0) {
                setSelectedAddress(arr[0]);
            }
        };
        fetchUser();
    }, []);

    const saveOrderHistory = async () => {
        const order = {
            cartItems,
            totalItems,
            totalPrice,
            discount,
            finalPrice: totalPrice + Drive + Tax,
            date: new Date().toLocaleString(),
            userInfo: { ...userInfo, ...(selectedAddress || {}) },
            paymentMethod: selectedMethod,
        };
        const data = await AsyncStorage.getItem('orderHistory');
        let orders = [];
        if (data) orders = JSON.parse(data);
        orders.push(order);
        await AsyncStorage.setItem('orderHistory', JSON.stringify(orders));
    };

    const handleCheckout = async () => {
        if (!selectedAddress) {
            Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng!");
            return;
        }
        await saveOrderHistory();

        // Xóa sản phẩm đã thanh toán khỏi file cart.json
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const user = JSON.parse(userData);
                const email = user.email;
                const cartFileUri = FileSystem.documentDirectory + "cart.json";
                const fileInfo = await FileSystem.getInfoAsync(cartFileUri);
                if (fileInfo.exists) {
                    const content = await FileSystem.readAsStringAsync(cartFileUri);
                    let carts = JSON.parse(content);
                    let userCart = carts[email] || [];
                    const paidIds = cartItems.map(item => item.id);
                    userCart = userCart.filter(item => !paidIds.includes(item.id));
                    carts[email] = userCart;
                    await FileSystem.writeAsStringAsync(cartFileUri, JSON.stringify(carts));
                }
            }
        } catch (e) {
            console.error("Lỗi khi xóa sản phẩm đã thanh toán khỏi giỏ hàng:", e);
        }

        Alert.alert(
            "Thành công",
            "Đặt hàng thành công!",
            [
                {
                    text: "OK",
                    onPress: () => navigation.replace('CartDetails')
                }
            ],
            { cancelable: false }
        );
    };

    const handleSelectAddress = async (addr) => {
        setSelectedAddress(addr);
        setShowDropdown(false);
        await AsyncStorage.setItem('selectedAddress', JSON.stringify(addr));
    };

    const renderItem = ({ item }) => (
        <View style={styles.productRow}>
            {/* Ảnh sản phẩm */}
            <Image
                source={imageMap[item.image] || require('../img/image34.png')}
                style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12 }}
            />
            {/* Thông tin sản phẩm */}
            <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={{ color: '#888', fontSize: 13 }}>
                    Đơn giá: ${item.price.toLocaleString()} | SL: {item.quantity || 1}
                </Text>
            </View>
            {/* Tổng giá */}
            <Text style={styles.productPrice}>
                ${(item.price * (item.quantity || 1)).toLocaleString()}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#222" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thanh toán</Text>
                <Ionicons name="cart-outline" size={28} color="#FE8C00" />
            </View>

            {/* Địa chỉ giao hàng */}
            <View style={styles.addressSection}>
                <Text style={styles.addressTitle}>Địa chỉ giao hàng</Text>
                <Text style={{ color: '#222', marginBottom: 4 }}>
                    {userInfo.username}
                    <Text style={{ color: '#888' }}> ({userInfo.phone})</Text>
                </Text>
                {addresses.length === 0 ? (
                    <Text style={{ color: '#888', marginBottom: 10 }}>Chưa có địa chỉ. Vui lòng thêm địa chỉ trong hồ sơ.</Text>
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.selectedAddressBox}
                            onPress={() => setShowDropdown(!showDropdown)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="location-outline" size={18} color="#FE8C00" style={{ marginRight: 6 }} />
                                <Text style={styles.selectedAddressText}>
                                    {selectedAddress
                                        ? `${selectedAddress.house}, ${selectedAddress.address}, ${selectedAddress.city}`
                                        : "Chọn địa chỉ"}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {showDropdown && (
                            <View style={{
                                borderWidth: 1,
                                borderColor: '#FE8C00',
                                borderRadius: 10,
                                backgroundColor: '#fff',
                                marginBottom: 8,
                                maxHeight: 200
                            }}>
                                {addresses.map((addr, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            padding: 12,
                                            borderBottomWidth: idx !== addresses.length - 1 ? 1 : 0,
                                            borderBottomColor: '#eee',
                                            backgroundColor: selectedAddress === addr ? '#FFF7F0' : '#fff'
                                        }}
                                        onPress={() => handleSelectAddress(addr)}
                                    >
                                        {/* Nút tròn radio */}
                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: '#FE8C00',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 10,
                                        }}>
                                            {selectedAddress === addr && (
                                                <View style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: '#FE8C00',
                                                }} />
                                            )}
                                        </View>
                                        <Text style={{ color: '#222', fontWeight: selectedAddress === addr ? 'bold' : 'normal' }}>
                                            {addr.house}, {addr.address}, {addr.city}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </>
                )}
            </View>

            {/* Product List */}
            <FlatList
                data={cartItems}
                keyExtractor={item => item.id?.toString() || item.name}
                renderItem={renderItem}
                ListFooterComponent={
                    <>
                        {/* Tổng kết */}
                        <View style={styles.summarySection}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Tạm tính</Text>
                                <Text style={styles.summaryValue}>${totalPrice.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
                                <Text style={styles.summaryValue}>${Drive.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Thuế</Text>
                                <Text style={styles.summaryValue}>${Tax.toLocaleString()}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryTotal}>Tổng cộng</Text>
                                <Text style={styles.summaryTotalValue}>${(totalPrice + Drive + Tax).toLocaleString()}</Text>
                            </View>
                        </View>

                        {/* Payment Method */}
                        <Text style={styles.paymentTitle}>Phương thức thanh toán</Text>
                        <View style={styles.paymentMethods}>
                            {paymentMethods.map(method => (
                                <TouchableOpacity
                                    key={method.key}
                                    style={[
                                        styles.paymentMethod,
                                        selectedMethod === method.key && styles.paymentMethodSelected
                                    ]}
                                    onPress={() => setSelectedMethod(method.key)}
                                    activeOpacity={0.8}
                                >
                                    <View style={styles.paymentIcon}>{method.icon}</View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.paymentLabel}>{method.label}</Text>
                                        <Text style={styles.paymentDesc}>{method.desc}</Text>
                                    </View>
                                    <View style={styles.radioCircle}>
                                        {selectedMethod === method.key && <View style={styles.radioDot} />}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Tổng cộng cuối + Nút đặt hàng */}
                        <View style={styles.bottomBar}>
                            <View>
                                <Text style={styles.bottomLabel}>Tổng cộng</Text>
                                <Text style={styles.bottomTotal}>${(totalPrice + Drive + Tax).toLocaleString()}</Text>
                            </View>
                            <TouchableOpacity style={styles.orderBtn} onPress={handleCheckout}>
                                <Text style={styles.orderBtnText}>Đặt hàng</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    addressSection: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#fff',
    },
    addressTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
        color: '#222',
    },
    addressItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    addressItemSelected: {
        borderColor: '#FE8C00',
        backgroundColor: '#FFF7F0',
    },
    addressText: {
        color: '#222',
        fontSize: 14,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingHorizontal: 20,
    },
    productName: {
        fontSize: 16,
        color: '#222',
    },
    productPrice: {
        fontSize: 16,
        color: '#222',
        fontWeight: 'bold',
    },
    summarySection: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 8,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        color: '#888',
        fontSize: 15,
    },
    summaryValue: {
        color: '#888',
        fontSize: 15,
    },
    summaryTotal: {
        color: '#222',
        fontWeight: 'bold',
        fontSize: 16,
    },
    summaryTotalValue: {
        color: '#FE8C00',
        fontWeight: 'bold',
        fontSize: 18,
    },
    paymentTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 18,
        marginBottom: 10,
        paddingHorizontal: 20,
        color: '#222',
    },
    paymentMethods: {
        marginBottom: 20,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 12,
    },
    paymentMethodSelected: {
        borderColor: '#FE8C00',
        backgroundColor: '#FFF7F0',
    },
    paymentIcon: {
        marginRight: 16,
    },
    paymentLabel: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#222',
    },
    paymentDesc: {
        color: '#888',
        fontSize: 13,
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#FE8C00',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    radioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FE8C00',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f2f2f2',
    },
    bottomLabel: {
        color: '#888',
        fontSize: 14,
    },
    bottomTotal: {
        color: '#FE8C00',
        fontWeight: 'bold',
        fontSize: 20,
    },
    orderBtn: {
        backgroundColor: '#FE8C00',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
    container: {
        paddingBottom: 30,
        backgroundColor: '#fff',
    },
    selectedAddressBox: {
        backgroundColor: '#FFF7F0',
        borderColor: '#FE8C00',
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginTop: 8,
        marginBottom: 8,
    },
    selectedAddressText: {
        color: '#222',
        fontSize: 14,
    },
});

export default Payment;

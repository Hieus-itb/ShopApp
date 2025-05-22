import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Ionicons, Entypo } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import CenteredItemView from '../components/CenteredItemView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imageMap } from '../data/imageMap';
import { getAddressesByUserId } from '../API/api'; 
const Cart = ({ navigation }) => {
    const cartFileUri = FileSystem.documentDirectory + "cart.json";
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressList, setShowAddressList] = useState(false);

    const updateCartFile = async (items) => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return;
            const user = JSON.parse(userData);
            const email = user.email;

            const fileInfo = await FileSystem.getInfoAsync(cartFileUri);
            let carts = {};
            if (fileInfo.exists) {
                const content = await FileSystem.readAsStringAsync(cartFileUri);
                carts = JSON.parse(content);
            }
            carts[email] = items;
            await FileSystem.writeAsStringAsync(cartFileUri, JSON.stringify(carts));
        } catch (e) {
            console.error("Loi khi cap nhat file gio hang:", e);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const loadCart = async () => {
                try {
                    const userData = await AsyncStorage.getItem('user');
                    if (!userData) return;

                    const user = JSON.parse(userData);
                    const email = user.email;

                    const fileInfo = await FileSystem.getInfoAsync(cartFileUri);
                    if (fileInfo.exists) {
                        const content = await FileSystem.readAsStringAsync(cartFileUri);
                        const carts = JSON.parse(content);
                        const userCart = carts[email] || [];
                        setCartItems(userCart);
                    }
                } catch (error) {
                    console.error("Loi khi tai gio hang:", error);
                }
            };

            loadCart();
        }, [])
    );

   
    // Lấy địa chỉ từ API
    const handleSelectAddress = async (address) => {
    setSelectedAddress(address);
    try {
        await AsyncStorage.setItem('selectedAddress', JSON.stringify(address));
    } catch (err) {
        console.error("Lỗi lưu địa chỉ đã chọn:", err.message);
    }
    };
    useFocusEffect(
    React.useCallback(() => {
        const fetchAddresses = async () => {
            try {
                const data = await AsyncStorage.getItem('user');
                if (data) {
                    const user = JSON.parse(data);
                    const addressList = await getAddressesByUserId(user.id);
                    setAddresses(addressList);

                    const selected = await AsyncStorage.getItem('selectedAddress');
                    if (selected) {
                        setSelectedAddress(JSON.parse(selected));
                    } else {
                        setSelectedAddress(addressList[0] || null);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi lấy địa chỉ người dùng:", error.message);
            }
        };
        fetchAddresses();
    }, [])
);


    const handleQuantityChange = (id, delta) => {
        setCartItems(prev => {
            const updated = prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            );
            updateCartFile(updated);
            return updated;
        });
    };

    const handleRemoveItem = (id) => {
        setCartItems(prev => {
            const updated = prev.filter(item => item.id !== id);
            updateCartFile(updated);
            return updated;
        });
    };

    const handleToggleSelectItem = (id) => {
        setSelectedItems(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const handleOrder = () => {
        const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id));
        const totalItems = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = 0;
        const finalPrice = totalPrice - discount;

        navigation.navigate('Payment', {
            cartItems: selectedCartItems,
            totalItems,
            totalPrice,
            discount,
            finalPrice,
        });
    };

    const totalItems = cartItems.reduce((sum, item) => sum + (selectedItems.has(item.id) ? item.quantity : 0), 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + (selectedItems.has(item.id) ? item.price * item.quantity : 0), 0);
    const discount = 0;
    const finalPrice = totalPrice - discount;

    const isOrderButtonDisabled = cartItems.length === 0 || selectedItems.size === 0 || totalItems < 0;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 10 }}>
                <Text style={styles.headerTitle}>Giỏ hàng của tôi</Text>
            </View>

            {/* Địa chỉ giao hàng */}
            <View style={styles.locationRow}>
                <View>
                    <Text style={styles.locationLabel}>Địa chỉ giao hàng</Text>
                    <TouchableOpacity onPress={() => setShowAddressList(true)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="location-outline" size={18} color="#FF7F00" style={{ marginRight: 6 }} />
                            <Text style={styles.locationText}>
                                {selectedAddress
                                    ? `${selectedAddress.state}, ${selectedAddress.street}, ${selectedAddress.city}`
                                    : "Chọn địa chỉ"} 
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.changeLocationBtn} onPress={() => setShowAddressList(true)}>
                    <Text style={styles.changeLocationText}>Đổi địa chỉ</Text>
                </TouchableOpacity>
            </View>

            {/* Modal chọn địa chỉ */}
            <Modal transparent visible={showAddressList} animationType="slide">
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 20,
                        width: '85%',
                        maxHeight: '60%'
                    }}>
                        <TouchableOpacity
                            style={{ alignSelf: 'flex-end', marginBottom: 10 }}
                            onPress={() => setShowAddressList(false)}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>Chọn địa chỉ giao hàng</Text>
                        {addresses.length === 0 ? (
                            <Text style={{ color: '#888', marginTop: 20 }}>Chưa có địa chỉ. Vui lòng thêm địa chỉ trong hồ sơ.</Text>
                        ) : (
                            <FlatList
                                data={addresses}
                                keyExtractor={(_, idx) => idx.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingVertical: 12,
                                            borderBottomWidth: 1,
                                            borderBottomColor: '#eee',
                                            backgroundColor: selectedAddress === item ? '#FFF7F0' : '#fff'
                                        }}
                                        onPress={async () => {
                                            setSelectedAddress(item);
                                            await AsyncStorage.setItem('selectedAddress', JSON.stringify(item));
                                            setShowAddressList(false);
                                        }}
                                    >
                                        {/* Nút tròn radio */}
                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 10,
                                            borderWidth: 2,
                                            borderColor: '#FF7F00',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 10,
                                        }}>
                                            {selectedAddress === item && (
                                                <View style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: 5,
                                                    backgroundColor: '#FF7F00',
                                                }} />
                                            )}
                                        </View>
                                        <Text style={{ color: '#222', fontWeight: selectedAddress === item ? 'bold' : 'normal' }}>
                                            {item.state}, {item.street}, {item.city}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                style={{ maxHeight: 250 }}
                            />
                        )}
                    </View>
                </View>
            </Modal>

            {/* Promo Code */}
            <View style={styles.promoRow}>
                <TextInput
                    placeholder="Nhập mã khuyến mãi..."
                    style={styles.promoInput}
                />
                <TouchableOpacity style={styles.applyBtn}>
                    <Text style={styles.applyText}>Áp dụng</Text>
                </TouchableOpacity>
            </View>

            {/* Cart List */}
            <FlatList
                data={cartItems || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                        <Checkbox
                            status={selectedItems.has(item.id) ? 'checked' : 'unchecked'}
                            onPress={() => handleToggleSelectItem(item.id)}
                            color="#FF7F00"
                        />

                        <Image source={imageMap[item.imageKey]} style={styles.itemImage} />

                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemPrice}>{item.price.toLocaleString()}₫</Text>

                            <View style={styles.quantityRow}>
                                <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
                                    <Ionicons name="remove-circle-outline" size={22} color="#FF7F00" />
                                </TouchableOpacity>

                                <Text style={styles.quantityText}>{item.quantity}</Text>

                                <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
                                    <Ionicons name="add-circle-outline" size={22} color="#FF7F00" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Nut xoa */}
                        <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                            <Ionicons name="trash-outline" size={22} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <CenteredItemView
                        ImageSrc={require("../img/not-found-img.png")}
                        mainTitle="Ôi! Giỏ hàng trống"
                        mainSubtitle="Bạn chưa thêm sản phẩm nào vào giỏ hàng."
                    />
                )}
                style={{ marginTop: 10 }}
            />

            {/* Summary */}
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryTitle}>Tóm tắt thanh toán</Text>
                <View style={styles.summaryRow}>
                    <Text>Tổng số lượng ({totalItems})</Text>
                    <Text>{totalPrice.toLocaleString()}₫</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Phí giao hàng</Text>
                    <Text style={{ color: 'green' }}>Miễn phí</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text>Giảm giá</Text>
                    <Text style={{ color: 'red' }}>-{discount.toLocaleString()}₫</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.totalLabel}>Tổng cộng</Text>
                    <Text style={styles.totalPrice}>{finalPrice.toLocaleString()}₫</Text>
                </View>
            </View>

            {/* Order Button */}
            <TouchableOpacity
                style={[
                    styles.orderButton,
                    isOrderButtonDisabled && styles.disabledOrderButton,
                ]}
                onPress={handleOrder}
                disabled={isOrderButtonDisabled}
            >
                <Text style={styles.orderButtonText}>Đặt hàng</Text>
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
        marginTop: 15,
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
    disabledOrderButton: {
        backgroundColor: '#cccccc',
    },
});
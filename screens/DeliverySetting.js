import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addAddress, getAddressesByUserId, deleteAddress } from "../API/api";

export default function DeliverySetting({ navigation }) {
    const [user, setUser] = useState(null); 
    const [addresses, setAddresses] = useState([]); 
    const [newAddress, setNewAddress] = useState({
        street: "",
        city: "",
        state: "", 
        zipCode: "", 
    });
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        async function loadUserAndAddresses() {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                  
                    const userAddresses = await getAddressesByUserId(parsedUser.id);
                    setAddresses(userAddresses);
                } else {
                    alert("Vui lòng đăng nhập để quản lý địa chỉ.");
                    navigation.navigate('Login'); 
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu người dùng hoặc địa chỉ:", error);
                alert("Đã có lỗi xảy ra khi tải dữ liệu.");
            } finally {
                setLoading(false);
            }
        }
        loadUserAndAddresses();
    }, []); 

    const handleAddAddress = async () => {
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
            alert("Vui lòng nhập đầy đủ thông tin địa chỉ (Đường, Thành phố, Tỉnh/Quận, Mã bưu điện)");
            return;
        }

        if (!user || !user.id) {
             alert("Không tìm thấy thông tin người dùng.");
             return;
        }

        try {
            const addedAddress = await addAddress(user.id, newAddress);
            setAddresses(prev => [...prev, addedAddress]); 
            setNewAddress({ street: "", city: "", state: "", zipCode: "" }); 
            alert("Địa chỉ đã được thêm thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm địa chỉ:", error);
            alert("Đã có lỗi xảy ra khi thêm địa chỉ.");
        }
    };

    const handleDeleteAddress = async (addressId) => {
        if (!user || !user.id) {
             alert("Không tìm thấy thông tin người dùng.");
             return;
        }
        try {
            await deleteAddress(user.id, addressId);
            setAddresses(prev => prev.filter(address => address.id !== addressId));
            alert("Địa chỉ đã được xóa thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa địa chỉ:", error);
            alert("Đã có lỗi xảy ra khi xóa địa chỉ.");
        }
    };

    
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Đang tải...</Text>
            </View>
        );
    }

    if (!user) {
         return (
            <View style={styles.container}>
                <Text>Không tìm thấy thông tin người dùng.</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách địa chỉ</Text>
            <FlatList
                data={addresses} 
                keyExtractor={(item) => item.id.toString()} 
                renderItem={({ item }) => ( 
                    <View style={styles.addressItem}>
                        <View style={{ flex: 1 }}>
                            <Text>{item.street}, {item.city}, {item.state}, {item.zipCode}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteAddress(item.id)} 
                        >
                            <Text style={{ color: "#fff" }}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text>Chưa có địa chỉ nào</Text>}
            />

            <Text style={styles.title}>Thêm địa chỉ mới</Text>
            <TextInput
                style={styles.input}
                value={newAddress.street}
                onChangeText={text => setNewAddress({ ...newAddress, street: text })}
                placeholder="Đường"
            />
            <TextInput
                style={styles.input}
                value={newAddress.city}
                onChangeText={text => setNewAddress({ ...newAddress, city: text })}
                placeholder="Thành phố"
            />
            <TextInput
                style={styles.input}
                value={newAddress.state}
                onChangeText={text => setNewAddress({ ...newAddress, state: text })}
                placeholder="Tỉnh/Quận"
            />
            <TextInput
                style={styles.input}
                value={newAddress.zipCode}
                onChangeText={text => setNewAddress({ ...newAddress, zipCode: text })}
                placeholder="Mã bưu điện"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
                <Text style={styles.saveText}>Thêm địa chỉ</Text>
            </TouchableOpacity>
        </View>
    );
 }

 const styles = StyleSheet.create({
     container: {
         flex: 1,
         padding: 20,
         backgroundColor: "#fff"
     },
     title: {
         fontSize: 18,
         fontWeight: "bold",
         marginVertical: 10
     },
     input: {
         borderWidth: 1,
         borderColor: "#ddd",
         borderRadius: 10,
         padding: 12,
         marginVertical: 8
     },
     addressItem: {
         flexDirection: "row",
         alignItems: "center",
         backgroundColor: "#f5f5f5",
         padding: 10,
         borderRadius: 8,
         marginVertical: 5
     },
     deleteButton: {
         backgroundColor: "#FF3333",
         padding: 8,
         borderRadius: 8,
         marginLeft: 10
     },
     addButton: {
         backgroundColor: "#0099FF",
         padding: 15,
         borderRadius: 10,
         marginTop: 10
     },
     saveButton: {
         backgroundColor: "#FF9900",
         padding: 15,
         borderRadius: 10,
         marginTop: 20
     },
     saveText: {
         color: "#fff",
         textAlign: "center",
         fontWeight: "bold"
     }
 });

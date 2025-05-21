import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUser } from "../data/userService";

export default function DeliverySetting({ navigation }) {
    const [user, setUser] = useState({
        avatar: "",
        username: "",
        date: "",
        gender: "",
        phone: "",
        email: "",
        address: [], // Đổi thành mảng
    });

    const [newAddress, setNewAddress] = useState({
        address: "",
        city: "",
        house: "",
    });

    useEffect(() => {
        async function loadUser() {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsed = JSON.parse(userData);
                // Đảm bảo address là mảng
                setUser({ ...parsed, address: Array.isArray(parsed.address) ? parsed.address : [] });
            }
        }
        loadUser();
    }, []);

    const handleAddAddress = () => {
        if (!newAddress.address || !newAddress.city || !newAddress.house) {
            alert("Vui lòng nhập đầy đủ thông tin địa chỉ");
            return;
        }
        setUser(prev => ({
            ...prev,
            address: [...prev.address, newAddress]
        }));
        setNewAddress({ address: "", city: "", house: "" });
    };

    const handleDeleteAddress = (index) => {
        setUser(prev => ({
            ...prev,
            address: prev.address.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        try {
            await saveUser(user);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            alert("Thông tin đã được lưu");
            navigation.goBack();
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Đã có lỗi xảy ra khi lưu thông tin");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Danh sách địa chỉ</Text>
            <FlatList
                data={user.address}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.addressItem}>
                        <View style={{ flex: 1 }}>
                            <Text>{item.address}, {item.house}, {item.city}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteAddress(index)}
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
                value={newAddress.address}
                onChangeText={text => setNewAddress({ ...newAddress, address: text })}
                placeholder="Address"
            />
            <TextInput
                style={styles.input}
                value={newAddress.city}
                onChangeText={text => setNewAddress({ ...newAddress, city: text })}
                placeholder="City"
            />
            <TextInput
                style={styles.input}
                value={newAddress.house}
                onChangeText={text => setNewAddress({ ...newAddress, house: text })}
                placeholder="House"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
                <Text style={styles.saveText}>Thêm địa chỉ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Lưu tất cả</Text>
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

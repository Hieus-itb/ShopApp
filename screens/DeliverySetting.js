import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { updateUser, getUserById } from "../API/api"; // Import updateUser and getUserById


export default function DeliverySetting({ navigation }) {
    const [user, setUser] = useState({
        id: null, // Add id field
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
        async function fetchUser() {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
             
                const userFromStorage = JSON.parse(userData);
                 if (userFromStorage.id) {
                    try {
                        const userFromApi = await getUserById(userFromStorage.id);
                        setUser(userFromApi);
                    } catch (error) {
                        console.error("Lỗi khi lấy thông tin người dùng từ API:", error);
                        // Optionally, fall back to AsyncStorage data if API call fails
                         setUser(userFromStorage);
                    }
                } else {
                     // If no user ID in storage, just set state from storage
                     setUser(userFromStorage);
                }
            }
        }
        fetchUser();
    }, []); // Empty dependency array means this runs once on mount


    const handleChange = (field, value) => {
        setUser({ ...user, [field]: value });

    };

    const handleSave = async () => {
        try {
            // Use updateUser from API
            await updateUser(user);
            // Update AsyncStorage with the potentially updated user data (excluding password)
            const userToStore = { ...user };
            delete userToStore.password; // Ensure password is not stored in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userToStore));
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

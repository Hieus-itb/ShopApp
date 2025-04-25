import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { saveUser } from "../data/userService";  // Import hàm saveUser

export default function DeliverySetting({navigation }) {
    const [user, setUser] = useState({
        avatar: "",
        username: "",
        date: "",
        gender: "",
        phone: "",
        email: "",
        address:  "",
        city: "",
        house:"",
    });

    useEffect(() => {
        async function loadUser() {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
        loadUser();
    }, []);

    
    const handleChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    const handleSave = async () => {
        try {
            await saveUser(user);  // Lưu thông tin người dùng vào file JSON
            await AsyncStorage.setItem('user', JSON.stringify(user)); // Cập nhật AsyncStorage
            alert("Thông tin đã được lưu");
            navigation.goBack();
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Đã có lỗi xảy ra khi lưu thông tin");
        }
    };

    return (
        <View style={styles.container}>


            <TextInput
                style={styles.input}
                value={user.address}
                onChangeText={(text) => handleChange("address", text)}
                placeholder="Address"
            />

            <TextInput
                style={styles.input}
                value={user.city}
                onChangeText={(text) => handleChange("city", text)}
                placeholder="City"
            />


            <TextInput
                style={styles.input}
                value={user.house}
                onChangeText={(text) => handleChange("house", text)}
                placeholder="House "
            />


            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveText}>Save</Text>
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
        fontSize: 22,
        fontWeight: "bold",
        alignSelf: "center",
        marginVertical: 20
    },
    
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginVertical: 8
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

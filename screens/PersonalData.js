import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { saveUser } from "../data/userService";  // Import hàm saveUser

export default function PersonalDataScreen() {
    const [user, setUser] = useState({
        avatar: "",
        username: "",
        date: "",
        gender: "",
        phone: "",
        email: ""
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

    const pickAvatar = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setUser({ ...user, avatar: result.assets[0].uri });
        }
    };

    const handleChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    const handleSave = async () => {
        try {
            await saveUser(user);  // Lưu thông tin người dùng vào file JSON
            alert("Thông tin đã được lưu");
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Đã có lỗi xảy ra khi lưu thông tin");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Personal Date</Text>

            <TouchableOpacity style={styles.avatarContainer} onPress={pickAvatar}>
                <Image
                    source={user.avatar ? { uri: user.avatar } : require("../img/apple.png")}
                    style={styles.avatar}
                />
                <View style={styles.cameraIcon}>
                    <Text style={{ color: "#fff", fontSize: 12 }}>📷</Text>
                </View>
            </TouchableOpacity>

            <TextInput
                style={styles.input}
                value={user.username}
                onChangeText={(text) => handleChange("username", text)}
                placeholder="Full Name"
            />

            <TextInput
                style={styles.input}
                value={user.date}
                onChangeText={(text) => handleChange("date", text)}
                placeholder="Date of Birth"
            />

            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={user.gender}
                    onValueChange={(value) => handleChange("gender", value)}
                >
                    <Picker.Item label="Select Gender" value="" />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                value={user.phone}
                onChangeText={(text) => handleChange("phone", text)}
                placeholder="Phone"
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                value={user.email}
                onChangeText={(text) => handleChange("email", text)}
                placeholder="Email"
                keyboardType="email-address"
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
    avatarContainer: {
        alignSelf: "center",
        position: "relative"
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#FF9900",
        borderRadius: 20,
        padding: 5
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        padding: 12,
        marginVertical: 8
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginVertical: 8,
        overflow: "hidden"
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

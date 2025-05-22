import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { updateUser, getUserById } from "../API/api"; // Import updateUser and getUserById

export default function PersonalDataScreen({navigation }) {
    const [user, setUser] = useState({
        id: null,
        avatar: "",
        username: "",
        date: "",
        gender: "",
        phone: "",
        email: "",
        // password:"" // Password should not be in frontend state for updates
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
            // Use updateUser from API
            await updateUser(user);
            // Update AsyncStorage with the potentially updated user data (excluding password)
            const userToStore = { ...user };
            delete userToStore.password; // Ensure password is not stored in AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(userToStore));
            alert("Thông tin đã được lưu");
            navigation.goBack();
        } catch (error) {
            // console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Đã có lỗi xảy ra khi lưu thông tin");
        }
    };

    return (
        <View style={styles.container}>

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
                editable={false}
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

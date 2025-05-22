import React, { useState } from "react";

import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert } from "react-native";
import { loginUser } from "../API/api";


import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({ navigation }) {
    const [showPassword, setShowPassword] = useState(false);
    const backgroundImg = require("../img/burger1.jpg");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showToast, setShowToast] = useState(false);

    return (
        <ImageBackground source={backgroundImg} style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.subtitle}>Đăng nhập tài khoản</Text>
                <Text style={styles.description}>Vui lòng đăng nhập để tiếp tục</Text>

                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                    />

                </View>

                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập mật khẩu"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                            source={require("../img/eye.png")}
                            style={styles.eyeIcon}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.rememberContainer}>
                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={async () => {

                        try {
                            const user = await loginUser(email, password);
                            await AsyncStorage.setItem('user', JSON.stringify(user));
                            Alert.alert("Đăng nhập thành công");
                            navigation.replace('MainApp');
                        } catch (error) {
                            Alert.alert("Đăng nhập thất bại", "Email hoặc mật khẩu không đúng.");
                        }

                    }}
                >
                    <Text style={styles.buttonText}>Đăng nhập</Text>
                </TouchableOpacity>


                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.socialRow}>
                    <TouchableOpacity>
                        <Image
                            source={require("../img/google.png")}
                            style={styles.socialIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require("../img/facebook.png")}
                            style={styles.socialIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require("../img/apple.png")}
                            style={styles.socialIcon}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.description}>
                    Bạn chưa có tài khoản?{" "}
                    <Text
                        style={styles.linkText}
                        onPress={() => navigation.navigate("Register")}
                    >
                        Đăng ký
                    </Text>
                </Text>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    inner: {
        padding: 20,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        margin: 20,
        borderRadius: 20,
    },
    subtitle: {
        width: "70%",
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        marginBottom: 15,
        color: "#555",
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    eyeIcon: {
        width: 20,
        height: 20,
        tintColor: "#999",
    },
    rememberContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 15,
    },
    forgotPassword: {
        fontSize: 14,
        color: "#FF7F00",
        fontWeight: "bold",
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#FF7F00",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    orText: {
        marginHorizontal: 10,
        color: "#666",
        fontSize: 14,
    },
    socialRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 20,
    },
    socialIcon: {
        width: 40,
        height: 40,
    },
    linkText: {
        color: "#FE8C00",
        fontWeight: "bold",
    },
});

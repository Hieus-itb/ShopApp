import React, { useState } from "react";
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Image, ImageBackground, CheckBox, Platform, } from "react-native";
import { registerUser } from "../API/api";
import { Alert } from "react-native";         

export default function Register({ navigation }) {
  const [isChecked, setIsChecked] = useState(false);
  const backgroundImg = require("../img/burger1.jpg");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ImageBackground source={backgroundImg} style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Tạo tài khoản mới</Text>
        <Text style={styles.description}>
          Đăng ký tài khoản để bắt đầu tìm kiếm món ăn bạn yêu thích
        </Text>

        <Text>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />

        <Text>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
        />

        <Text>Mật khẩu</Text>
        <View style={styles.passwordInput}>
          <TextInput
            style={{ flex: 1 }}
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

        <View style={styles.checkboxContainer}>
          <TouchableOpacity onPress={() => setIsChecked(!isChecked)} style={styles.checkbox}>
            <View style={[styles.box, isChecked && styles.boxChecked]} />
            <Text style={styles.termsText}>
              Tôi đồng ý với <Text style={styles.link}>Điều khoản dịch vụ</Text> và{" "}
              <Text style={styles.link}>Chính sách bảo mật</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={async () => {
            if (!email || !username || !password) {
              Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
              return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              Alert.alert("Lỗi", "Email không hợp lệ!");
              return;
            }

            if (password.length < 6) {
              Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
              return;
            }

            if (!isChecked) {
              Alert.alert("Lỗi", "Vui lòng đồng ý với điều khoản sử dụng!");
              return;
            }

           try {
              const newUser = { email, username, password };
              await registerUser(newUser);
              Alert.alert("Đăng ký thành công!");
              navigation.navigate("Login");
            } catch (error) {
              if (error.response?.status === 409) {
                Alert.alert("Lỗi", "Email này đã được sử dụng.");
              } else {
                Alert.alert("Lỗi", error.message || "Đăng ký thất bại");
              }
            }
          }}
        >
          <Text style={styles.registerText}>Đăng ký</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity>
            <Image source={require("../img/google.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../img/facebook.png")} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../img/apple.png")} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.signinText}>
          Đã có tài khoản?{" "}
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            Đăng nhập
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: "#999",
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  box: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#FF7F00",
    marginRight: 10,
    borderRadius: 4,
  },
  boxChecked: {
    backgroundColor: "#FF7F00",
  },
  termsText: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  link: {
    color: "#FF7F00",
    fontWeight: "bold",
  },
  registerBtn: {
    backgroundColor: "#FF7F00",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
  signinText: {
    textAlign: "center",
    color: "#333",
  },
});

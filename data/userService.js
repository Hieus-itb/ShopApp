import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
const fileUri = FileSystem.documentDirectory + "users.json";

// Lưu hoặc cập nhật thông tin người dùng
export async function saveUser(user) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    let users = [];

    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(fileUri);
      users = JSON.parse(content);
    }

    // Kiểm tra nếu email đã tồn tại thì cập nhật người dùng, nếu không thì thêm mới
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex === -1) {
      // Nếu không tìm thấy, thêm người dùng mới
      const newUser = {
        id: users.length + 1,
        username: user.username,  // Không thay đổi username
        date: user.date || "",
        gender: user.gender || "",
        phone: user.phone || "",
        email: user.email,  // Không thay đổi email
        password: user.password,
        avatar: user.avatar || "",
        address: user.address || "",
        city: user.city || "",
        house: user.house || "",
      };

      users.push(newUser);
    } else {
      // Nếu tìm thấy, cập nhật người dùng (trừ username và email)
      users[userIndex] = {
        ...users[userIndex],
        date: user.date || users[userIndex].date, // Cập nhật nếu có
        gender: user.gender || users[userIndex].gender, // Cập nhật nếu có
        phone: user.phone || users[userIndex].phone, // Cập nhật nếu có
        avatar: user.avatar || users[userIndex].avatar, // Cập nhật nếu có
        username: user.username || users[userIndex].username, // Cập nhật username nếu có
        address: user.address || users[userIndex].address, // Cập nhật nếu có
        city: user.city || users[userIndex].city, // Cập nhật nếu có
        house: user.house || user[userIndex].house, // Cập nhật nếu có
      };
    }

    // Lưu lại danh sách người dùng đã được cập nhật hoặc thêm mới
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(users));
    return true;
  } catch (error) {
    throw error;
  }
}

// Lấy danh sách tất cả người dùng
export async function getUsers() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) return [];
    Alert.alert("fileUri", fileUri); // Display the file path
    const content = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(content);
  } catch (error) {
    console.error("Loi doc file: ", error);
    return [];
  }
}



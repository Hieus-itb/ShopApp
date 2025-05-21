import axios from "axios";

// 👇 Dùng IP máy bạn (nếu test trên điện thoại thật) hoặc 10.0.2.2 nếu dùng Android emulator
const API_BASE_URL = "http://192.168.1.10:5000/api";

export async function registerUser(user) {
    const newUser = {
    email: user.email,
    username: user.username,
    password: user.password,
    address: "",
    avatar: "",
    city: "",
    date: new Date().toISOString(), // hoặc null nếu backend chấp nhận
    gender: "",
    house: "",
    phone: "",
    };
  try {
    const res = await axios.post(`${API_BASE_URL}/users`, newUser);
    return res.data; // trả về user đã lưu
  } catch (err) {
    console.error("Lỗi đăng ký:", err.response?.data || err.message);
    throw err;
  }
}

export async function loginUser(email, password) {
  try {
    const res = await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      password,
    });
    return res.data; // trả về user (không có password)
  } catch (err) {
    if (err.response?.status === 401) {
      throw new Error("Sai email hoặc mật khẩu");
    }
    console.error("Lỗi đăng nhập:", err.message);
    throw err;
  }
}
export async function getUserById(id) {
  try {
    const res = await axios.get(`${API_BASE_URL}/users/${id}`);
    return res.data; // trả về user
  } catch (err) {
    console.error("Lỗi lấy thông tin người dùng:", err.message);
    throw err;
  }
}
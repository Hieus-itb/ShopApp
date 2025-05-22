import axios from "axios";

// 👇 Dùng IP máy bạn (nếu test trên điện thoại thật) hoặc 10.0.2.2 nếu dùng Android emulator
const API_BASE_URL = "http://192.168.0.102:5000/api";

export async function registerUser(user) {
    const newUser = {
    email: user.email,
    username: user.username,
    password: user.password,
    addresses: [],
    avatar: "",
    date: new Date().toISOString(), // hoặc null nếu backend chấp nhận
    gender: "",
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

// PRODUCTS

export const getCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return await res.json();
};

export const getProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    return await res.json();
};

export const getProductsByCategory = async (categoryId) => {
    try {
        const res = await axios.get(`${API_BASE_URL}/products`);
        
        return res.data.filter((p) => p.categoryId.toLowerCase() === categoryId.toLowerCase());
    } catch (error) {
        console.error("Error fetching products by category:", error.message);
        return [];
    }
};


export const getProductById = async (productId) => {
    const allProducts = await getProducts();
    return allProducts.find(p => p.id === productId);
};

export const getProductsBySearch = async (searchTerm) => {
    const allProducts = await getProducts();
    return allProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const getRecentProducts = async (count = 3) => {
    const allProducts = await getProducts();
    return [...allProducts]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, count);
};
// ORDERS

export async function checkoutOrder(checkoutRequest) {
  try {
    const res = await axios.post(`${API_BASE_URL}/Orders/Checkout`, checkoutRequest);
    return res.data;
  } catch (err) {
    console.error("Lỗi thanh toán:", err.response?.data || err.message);
    throw err;
  }
}

export async function getOrdersByUserId(userId) {
  try {
    const res = await axios.get(`${API_BASE_URL}/Orders/ByUser/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Lỗi lấy lịch sử đơn hàng:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateUser(user) {
  try {
    // Create a new object with only the fields to update, excluding password
    const userDataToUpdate = {
      id: user.id,
      username: user.username,
      date: user.date,
      gender: user.gender,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
      address: user.address,
      city: user.city,
      house: user.house,

    };
    const res = await axios.put(`${API_BASE_URL}/users/${user.id}`, userDataToUpdate);
    return res.data; // Or handle the 204 No Content response
  } catch (err) {
    console.error("Lỗi cập nhật người dùng:", err.response?.data || err.message);
    throw err;
  }
}

// ADDRESSES
export async function addAddress(userId, addressData) {
  try {
    const res = await axios.post(`${API_BASE_URL}/Users/${userId}/Addresses`, addressData);
    return res.data;
  } catch (err) {
    console.error("Lỗi thêm địa chỉ:", err.response?.data || err.message);
    throw err;
  }
}

export async function getAddressesByUserId(userId) {
  try {
    const res = await axios.get(`${API_BASE_URL}/Users/${userId}/Addresses`);
    return res.data;
  } catch (err) {
    console.error("Lỗi lấy danh sách địa chỉ:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteAddress(userId, addressId) {
  try {
    const res = await axios.delete(`${API_BASE_URL}/Users/${userId}/Addresses/${addressId}`);
    return res.data; // Should be empty or success indicator based on API
  } catch (err) {
    console.error("Lỗi xóa địa chỉ:", err.response?.data || err.message);
    throw err;
  }
}
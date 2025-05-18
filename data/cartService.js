import * as FileSystem from "expo-file-system";
import AsyncStorage from '@react-native-async-storage/async-storage';

const cartFileUri = FileSystem.documentDirectory + "cart.json";

export async function addToCart(product, quantity = 1) {
    try {
        // Lay thong tin user dang dang nhap
        const userData = await AsyncStorage.getItem('user');
        if (!userData) throw new Error("Chua dang nhap");

        const user = JSON.parse(userData);
        const email = user.email;

        let carts = {};
        const fileInfo = await FileSystem.getInfoAsync(cartFileUri);

        if (fileInfo.exists) {
            const content = await FileSystem.readAsStringAsync(cartFileUri);
            carts = JSON.parse(content);
        }

        // Neu user chua co gio hang thi tao moi
        if (!carts[email]) {
            carts[email] = [];
        }

        // Kiem tra neu san pham da co trong gio hang thi tang so luong
        const existingIndex = carts[email].findIndex(p => p.id === product.id);
        if (existingIndex !== -1) {
            carts[email][existingIndex].quantity += quantity;
        } else {
            carts[email].push({
                ...product,
                imageKey: product.image, // Lưu tên ảnh, không phải object require
                quantity
            });
        }

        await FileSystem.writeAsStringAsync(cartFileUri, JSON.stringify(carts));
        return true;
    } catch (error) {
        console.error("Loi khi them vao gio hang:", error);
        throw error;
    }
}

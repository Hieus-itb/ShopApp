import * as FileSystem from "expo-file-system";

const fileUri = FileSystem.documentDirectory + "users.json";

export async function saveUser(user) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    let users = [];

    if (fileInfo.exists) {
      const content = await FileSystem.readAsStringAsync(fileUri);
      users = JSON.parse(content);
    }

    const emailExists = users.some(u => u.email === user.email);
    if (emailExists) {
      throw new Error("Email da ton tai");
    }

    users.push(user);
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(users));
    return true;
  } catch (error) {
    throw error;
  }
}

export async function getUsers() {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (!fileInfo.exists) return [];
    const content = await FileSystem.readAsStringAsync(fileUri);
    return JSON.parse(content);
  } catch (error) {
    console.error("Loi doc file: ", error);
    return [];
  }
}



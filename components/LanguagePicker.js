import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image
} from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

const LANGUAGES = [
  { code: 'vn', name: 'Tiếng Việt', },
  { code: 'id', name: 'Indonesia',  },
  { code: 'us', name: 'English (US)',  },
  { code: 'th', name: 'Thailand',  },
  { code: 'cn', name: 'Chinese',  },
];

const LanguagePicker = ({ isShow, onClose, onLanguageChange }) => {
  const [selectedLang, setSelectedLang] = useState('en');

  const handleSelect = () => {
    if (onLanguageChange) {
      const selectedLanguageName = LANGUAGES.find(lang => lang.code === selectedLang)?.name || 'English';
      onLanguageChange(selectedLanguageName);
    }
    if (onClose) {
      onClose(); // Gọi hàm đóng modal từ component cha
    }
  };

  return (
    <View style={styles.wrapper}>
      <Modal
        isVisible={isShow} // Sử dụng prop isVisible để điều khiển modal
        onBackdropPress={onClose} // Đóng modal khi nhấn ngoài
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.handleBar} />

          <Text style={styles.title}>Select Language</Text>

          <FlatList
            data={LANGUAGES}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.langItem,
                  item.code === selectedLang && styles.selectedLangItem,
                ]}
                onPress={() => {
                  setSelectedLang(item.code);
                }}
              >
                <View style={styles.row}>
                <Image
                  source={{ uri: `https://flagcdn.com/w40/${item.code}.png` }}
                  style={styles.flag}
                  resizeMode="contain"
                />

                  <Text>{item.name}</Text>
                </View>
                {item.code === selectedLang && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#FE8C00"
                  />
                )}
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Select</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 2.5,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 15,
  },
  langItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedLangItem: {
    borderColor: '#FE8C00',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flag: {
    width: 24,
    height: 16,
    resizeMode: 'contain',
  },
  selectButton: {
    backgroundColor: '#FE8C00',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default LanguagePicker;
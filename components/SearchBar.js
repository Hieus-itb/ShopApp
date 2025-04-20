// components/SearchSuggestionsInput.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // nếu dùng Expo, bạn có thể đổi icon nếu muốn

export default function SearchBar({ suggestions, onSelect }) {
  const [query, setQuery] = useState('');

  const filtered = suggestions
    .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 7);
    const match = suggestions.find(
      (s) =>
        typeof s === 'string' &&
        s.toLowerCase().startsWith(query.trim().toLowerCase())
    );
  const handleSearch = () => {
    if (query.trim()) {
      if (match) {
        setQuery(match);
        onSelect(match);
      } else {
        onSelect(query.trim());
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Nhập tên món ăn..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {query.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                setQuery(item);
                onSelect(item);
              }}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  suggestionText: {
    fontSize: 16,
  },
});

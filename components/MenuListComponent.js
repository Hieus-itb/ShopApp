import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


function MenuList({ title, onPress, icon, rightText }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {icon && (
          <View style={{
            backgroundColor: '#F5F5FF',
            padding: 2,
            borderRadius: 5,       
          }}>
            <Ionicons name={icon} size={20} color="#aaa" />
          </View>
        )}
          <Text style={styles.menuItemText}>{title}</Text>
          </View>
         {/* Phần bên phải */}
         <View style={styles.rightSection}>
          {rightText && <Text style={styles.rightText}>{rightText}</Text>}
          <Ionicons name="chevron-forward-outline" size={20} color="black" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  menuItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, 
  },
  rightText: {
    fontSize: 14,
    
  },
});

export default MenuList;
import React, { useEffect, useState } from 'react';
import { View, TouchableWithoutFeedback, Animated, StyleSheet } from 'react-native';

const CustomSwitch = ({ onToggle = () => {}, initial = false }) => {
  const [isOn, setIsOn] = useState(initial);
  const offsetX = useState(new Animated.Value(initial ? 1 : 0))[0];

  // Đồng bộ initial với state khi initial thay đổi
  useEffect(() => {
    setIsOn(initial);
    Animated.timing(offsetX, {
      toValue: initial ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [initial]);

  const toggleSwitch = () => {
    const newValue = !isOn;
    const toValue = newValue ? 1 : 0;

    Animated.timing(offsetX, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();

    setIsOn(newValue);
    onToggle(newValue); // Truyền giá trị mới thay vì !isOn
  };

  const translateX = offsetX.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28], // Vị trí hình tròn
  });

  const bgColor = offsetX.interpolate({
    inputRange: [0, 1],
    outputRange: ['#DFE0F3', '#FE8C00'], // Màu nền
  });

  return (
    <TouchableWithoutFeedback onPress={toggleSwitch}>
      <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
        <Animated.View style={[styles.circle, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 25,
    borderRadius: 15,
    padding: 2,
    justifyContent: 'center',
  },
  circle: {
    width: 21,
    height: 21,
    borderRadius: 10.5,
    backgroundColor: '#fff',
  },
});

export default CustomSwitch;
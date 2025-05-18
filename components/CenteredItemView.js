import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CenteredItemView = ({ ImageSrc, mainTitle, mainSubtitle }) => {
  return (
    <View style={styles.centeredContainer}>
      <Image
        source={ImageSrc}
        style={styles.mainImage}
      />
      <Text style={styles.mainTitle}>{mainTitle}</Text>
      <Text style={styles.mainSubtitle}>{mainSubtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  mainImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mainSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
});

export default CenteredItemView;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Separator = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#d9d9d9',
    marginHorizontal: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#d9d9d9',
  },
});

export default Separator;
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { rem } from '../helper';

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
    marginVertical: 10 * rem,
  },
  line: {
    flex: 1,
    height: 1 * rem,
    backgroundColor: '#d9d9d9',
    marginHorizontal: 10 * rem,
  },
  text: {
    fontSize: 15 * rem,
    fontWeight: '600',
    color: '#d9d9d9',
  },
});

export default Separator;
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { rem, styles } from '../helper';

function Separator ({ text }) {
  return (
    <View style={styles2.container}>
      <View style={styles2.line} />
      <Text style={[styles.text, styles2.text]}>{text}</Text>
      <View style={styles2.line} />
    </View>
  );
};

const styles2 = StyleSheet.create({
  container: {
    ...styles.flexRow,
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
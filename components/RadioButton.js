import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { styles, palette } from "../helper";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const RadioButton = ({ value, displayText, selectedValue, onSelect, iconName, iconSize = 26, iconColor }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(value)} style={buttonStyles.radioContainer}>
        {iconName ? (
          <View style={[styles.flexOne, styles.flexRow, styles.spaceBetween]}>
            <View style={[styles.flexRow, styles.fullCenter]}>
              <MaterialIcon name={iconName} size={iconSize} color={iconColor ? iconColor : palette.primary} />
              <Text style={[buttonStyles.buttonLabel, styles.mh5]}>{displayText}</Text>
            </View>
            <View style={[buttonStyles.radioButton]}>
              {selectedValue === value && <View style={buttonStyles.radioButtonInner} />}
            </View>
          </View>
        ) : (
          <>
            <View style={[buttonStyles.radioButton]}>
              {selectedValue === value && <View style={buttonStyles.radioButtonInner} />}
            </View>
            <Text style={buttonStyles.buttonLabel}>{displayText}</Text>
          </>
        )}
    </TouchableOpacity>
  );
};

export default RadioButton;

const buttonStyles = StyleSheet.create({
  radioContainer: {
    ...styles.flexRow,
    ...styles.alignCenter,
    ...styles.mb10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderColor: palette.primary,
    ...styles.border1,
    ...styles.fullCenter,
    ...styles.mr10,
    ...styles.br8,
    ...styles.mr5
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 4,
    borderColor: palette.white,
    backgroundColor: palette.primary,
  },
  buttonLabel: {
    ...styles.text, 
    ...styles.font16,
    color: palette.dark,
    flexShrink: 1
  }
})
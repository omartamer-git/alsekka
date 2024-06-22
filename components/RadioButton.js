import React from 'react'
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { styles, palette, rem } from "../helper";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const RadioButton = ({ value, displayText, selectedValue, onSelect, iconName, iconSize = 26, iconColor }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(value)} style={[buttonStyles.radioContainer, iconName ? styles.spaceBetween : styles.justifyStart]}>
          {iconName ? (
            <>
              <View style={[styles.flexRow, styles.fullCenter]}>
                <MaterialIcon name={iconName} size={iconSize} color={iconColor ? iconColor : palette.primary} />
                <Text style={[buttonStyles.buttonLabel]}>{displayText}</Text>
              </View>
              <View style={buttonStyles.radioButton}>
                {selectedValue === value && <View style={buttonStyles.radioButtonInner} />}
              </View>
            </>
          ) : (
            <>
              <View style={buttonStyles.radioButton}>
                {selectedValue === value && <View style={buttonStyles.radioButtonInner} />}
              </View>
              <Text style={[buttonStyles.buttonLabel, styles.font16]}>{displayText}</Text>
            </>
          )}
    </TouchableOpacity>
  );
};

export default RadioButton;

const buttonStyles = StyleSheet.create({
  radioContainer: {
    ...styles.flexRow,
    ...styles.fullCenter,
    ...styles.mb10,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderColor: palette.primary,
    ...styles.border1,
    ...styles.fullCenter,
    ...styles.br8,
    ...styles.mh5,
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
    ...styles.font14,
    ...styles.ml5,
    color: palette.dark,
  }
})
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { styles, palette } from "../helper";


const RadioButton = ({ value, selectedValue, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(value)} style={buttonStyles.radioContainer}>
      <View style={[buttonStyles.radioButton]}>
        {selectedValue === value && <View style={buttonStyles.radioButtonInner} />}
      </View>
      <Text style={buttonStyles.buttonLabel}>{value}</Text>
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
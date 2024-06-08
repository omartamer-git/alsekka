import { View, Text, StyleSheet } from "react-native";
import { styles, palette } from "../helper";
import { useTranslation } from "react-i18next";

export default function AccountSections({ title, style, textStyle, innerStyle, children }) {
  const {t} = useTranslation();

  return (
    <>
      <View style={[styles.w100, style]}>
        <Text style={[sectionStyles.text, textStyle]}>{t(title)}</Text>
        <View style = {innerStyle}>
          {children}
        </View>
      </View>
      
      <View style={styles.breakline} />
    </>
  );
}

const sectionStyles = StyleSheet.create({
  breakline: {
    ...styles.w100,
    ...styles.mt5,
    borderWidth: 0.8,
    borderColor: palette.light
  },
  text: {
    ...styles.text,
    ...styles.headerText,
    ...styles.font24,
    ...styles.mb15,
    color: palette.primary,
  }
})

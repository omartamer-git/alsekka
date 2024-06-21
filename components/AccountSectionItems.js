import { useTranslation } from "react-i18next"
import { TouchableOpacity, Text, I18nManager, View} from "react-native"
import { styles, palette } from "../helper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
export default function AccountSectionItems({text, style, textStyle, navIcon, icon, onPress}) {
  const {t} = useTranslation();


  return (
    <TouchableOpacity
    activeOpacity={0.3}
    onPress={onPress}
    style={[styles.flexRow, styles.spaceBetween, styles.alignCenter, style]}
  >
    <>
      <View style={[styles.flexRow, styles.fullCenter]}>
        <MaterialIcons
          size={24}
          name={icon}
          color={palette.primary}
          style={styles.mr10}
        />
        <Text style={[styles.text, styles.font18, styles.mt10, styles.mb10, textStyle]}>
          {t(text)}
        </Text>
      </View>
      <MaterialIcons
        size={30}
        name={navIcon ? navIcon : (I18nManager.isRTL ? 'chevron-left' : 'chevron-right')}
        color={palette.accent}
      />
    </>
  </TouchableOpacity>
  )
}
import { useTranslation } from "react-i18next"
import { TouchableOpacity, Text, I18nManager} from "react-native"
import { styles, palette } from "../helper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
export default function AccountSectionItems({text, style, textStyle, icon, onPress}) {
  const {t} = useTranslation();


  return (
    <TouchableOpacity
    activeOpacity={0.3}
    onPress={() => console.log('hello world')}
    style={[styles.flexRow, styles.spaceBetween, styles.alignCenter, style]}
  >
    <>
      <Text style={[styles.text, styles.font18, styles.mt10, styles.mb10, textStyle]}>
        {t(text)}
      </Text>
      <MaterialIcons
        size={30}
        name={icon ? icon : (I18nManager.isRTL ? 'chevron-left' : 'chevron-right')}
        color={palette.accent}
      />
    </>
  </TouchableOpacity>
  )
}
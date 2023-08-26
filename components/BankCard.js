import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { palette, rem, styles } from "../helper";

export default function BankCard({ type, number, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{ ...styles.flexRow, width: '100%', height: 48 * rem, alignItems: 'center', borderBottomWidth: 1, borderColor: palette.light }}>
            {
                (type == 'mastercard') ?
                    <FontsAwesome5 name="cc-mastercard" size={24 * rem} color={palette.accent}/>
                    :
                    <FontsAwesome5 name="cc-visa" size={24 * rem} color={palette.accent}/>
            }
            <Text style={[styles.ml15, styles.semiBold]}>•••• {number}</Text>
            <View style={[styles.flexOne, styles.alignEnd]}>
                <FontsAwesome5 name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={18 * rem} color={palette.dark}/>
            </View>
        </TouchableOpacity>
    );
};
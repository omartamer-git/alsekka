import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import { palette, rem, styles } from "../helper";
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

function WithdrawalMethod({ type, number, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={[styles.flexRow, styles.w100, styles.alignCenter, styles.borderLight, { height: 48 * rem, borderBottomWidth: 1 }]}>
            <Text numberOfLines={1} style={[styles.text, styles.ml15, styles.bold, styles.dark, { width: '15%' }]}>{type}</Text>
            <Text style={[styles.ml15, styles.semiBold, styles.text, styles.dark]}>{number}</Text>
        </TouchableOpacity>
    );
};

export default WithdrawalMethod;
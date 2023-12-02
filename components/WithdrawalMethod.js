import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import { palette, rem, styles } from "../helper";
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

function WithdrawalMethod ({ type, number, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{ ...styles.flexRow, width: '100%', height: 48 * rem, alignItems: 'center', borderBottomWidth: 1, borderColor: palette.light }}>
            <Text numberOfLines={1} style={[styles.text, styles.ml15, styles.bold, {width: '15%'}]}>{type}</Text>
            <Text style={[styles.ml15, styles.semiBold, styles.text]}>{number}</Text>
        </TouchableOpacity>
    );
};

export default WithdrawalMethod;
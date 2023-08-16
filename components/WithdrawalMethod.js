import { I18nManager, Text, TouchableOpacity, View } from "react-native";
import { palette, rem, styles } from "../helper";
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

const WithdrawalMethod = ({ type, number, onPress }) => {
    console.log(styles.flexRow);
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{ ...styles.flexRow, width: '100%', height: 48 * rem, alignItems: 'center', borderBottomWidth: 1, borderColor: palette.light }}>
            <Text style={[styles.ml15, styles.bold]}>{type}</Text>
            <Text style={[styles.ml15, styles.semiBold]}>{number}</Text>
            <View style={[styles.flexOne, styles.alignEnd]}>
                <FontsAwesome5 name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={18 * rem} color={palette.dark}/>
            </View>
        </TouchableOpacity>
    );
};

export default WithdrawalMethod;
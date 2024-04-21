import { View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { rem, styles } from '../helper';

const HeaderLip =  function () {
    return (
        <View style={[styles.w100, LipStyles.style]}>
        </View>
    );
};

const LipStyles = EStyleSheet.create({
    style: {
        zIndex: 4,
        elevation: 4,
        ...styles.bgSecondary,
        height: 20 * rem,
        borderBottomLeftRadius: 20 * rem,
        borderBottomRightRadius: 20 * rem
    }
});

export default HeaderLip;

  
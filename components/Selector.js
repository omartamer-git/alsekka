import { Text, TouchableOpacity, View } from "react-native";
import { palette, rem, styles } from "../helper";

export default function Selector({ options, value, setValue }) {
    return (
        <>
            <View style={[styles.flexRow, styles.w100, styles.mv10]}>
                {
                    options.map((option, index) => (
                        <TouchableOpacity key={"option" + index} onPress={ function () { setValue(option.value) }} activeOpacity={0.9} style={[styles.flexOne, styles.fullCenter, { height: 48 * rem, backgroundColor: value === option.value ? palette.secondary : palette.dark }]}>
                            <Text style={[styles.text, styles.white, styles.bold]}>{option.text}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </>
    );
}
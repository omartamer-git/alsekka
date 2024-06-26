import { Text, TouchableOpacity } from "react-native";
import { styles, palette } from "../helper";

export default function RoundedButton({icon, active, children, onPress, dark, activeColor, activeBgColor, textStyle=[], style}) {
    return (
        <>
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.brFull, styles.flexRow, styles.gap10, styles.ph24, styles.pv8, styles.fullCenter, ...style, { backgroundColor: active ? activeBgColor : (style.backgroundColor || palette.lighter), borderWidth: 2, borderColor: active ? (activeColor || palette.accent) : 'transparent' }]}>
                {
                    icon &&
                    icon
                }
                <Text style={[styles.text, styles.semiBold, styles.textCenter, { color: active && activeColor ? activeColor : (dark ? palette.white : palette.dark) }, ...textStyle]}>
                    {children}
                </Text>
            </TouchableOpacity>
        </>
    )
}
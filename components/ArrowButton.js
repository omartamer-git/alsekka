import React from 'react';
import { I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { palette, rem, styles } from '../helper';

const ArrowButton = ({ text, onPress, bgColor, disabled, textColor, style, icon, iconColor, borderColor, children }) => {
    let borderColor_ = borderColor;
    if(borderColor_ === undefined) {
        borderColor_ = bgColor;
    }

    return (
        <TouchableOpacity
            style={[styles2.button, { backgroundColor: disabled ? palette.dark : bgColor, borderColor: disabled ? palette.dark : borderColor_}, style]}
            activeOpacity={0.9}
            onPress={onPress}
            disabled={disabled}
        >
            {icon === undefined ? null : <FontsAwesome5 style={styles2.icon} name={icon} size={13 * rem} color={iconColor} />}
            <View style={[styles2.viewStyle, icon ? {} : { marginEnd: 20 }]}>
                { text && <Text style={[styles2.continueBtnText, styles2.text, { color: textColor }]}>{text}</Text> }
            </View>
            <View style={{alignItems: 'flex-end'}}>
                <FontsAwesome5 name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={13 * rem} color={iconColor || palette.black} />
            </View>
        </TouchableOpacity>
    );
};

const styles2 = StyleSheet.create({
    viewStyle: {
        ...styles.flexRow,
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1
    },
    button: {
        height: 44 * rem,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6 * rem,
        paddingStart: 16 * rem,
        ...styles.flexRow,
        paddingEnd: 16 * rem,
        marginTop: 8 * rem,
        marginBottom: 8 * rem,
        borderWidth: 1,
    },
    continueBtnText: {
        fontSize: 13 * rem,
        textAlign: 'center'
    },
    icon: {
        marginEnd: 8
    }
});

export default ArrowButton;
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { palette, rem, styles } from '../helper';

const Button = ({ text, onPress, bgColor, disabled, textColor, style, icon, iconColor, borderColor, children }) => {
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
            {icon === undefined ? null : <FontsAwesome5 style={styles2.icon} name={icon} size={20} color={iconColor} />}
            <View style={[styles2.viewStyle, icon === undefined ? {} : { marginEnd: 20 }]}>
                { text && <Text style={[styles2.continueBtnText, styles.text, { color: textColor }]}>{text}</Text> }
                { children }
            </View>
        </TouchableOpacity>
    );
};

const styles2 = StyleSheet.create({
    viewStyle: {
        ...styles.flexRow,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    button: {
        height: 44 * rem,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6 * rem,
        paddingStart: 24 * rem,
        ...styles.flexRow,
        paddingEnd: 24 * rem,
        marginTop: 8 * rem,
        marginBottom: 8 * rem,
        borderWidth: 1,
    },
    continueBtnText: {
        fontSize: 15 * rem,
        fontWeight: '600',
        textAlign: 'center'
    },
    icon: {
        marginEnd: 8
    }
});

export default Button;
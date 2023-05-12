import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { rem } from '../helper';

const Button = ({ text, onPress, bgColor, textColor, style, icon, iconColor, borderColor, children }) => {
    let borderColor_ = borderColor;
    if(borderColor_ === undefined) {
        borderColor_ = bgColor;
    }
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: bgColor, borderColor: borderColor_}, style]}
            activeOpacity={0.9}
            onPress={onPress}
        >
            {icon === undefined ? null : <FontsAwesome5 style={styles.icon} name={icon} size={20} color={iconColor} />}
            <View style={[styles.viewStyle, icon === undefined ? {} : { marginRight: 20 }]}>
                { text && <Text style={[styles.continueBtnText, { color: textColor }]}>{text}</Text> }
                { children }
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    button: {
        height: 48 * rem,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4 * rem,
        paddingLeft: 24 * rem,
        flexDirection: 'row',
        paddingRight: 24 * rem,
        marginTop: 8 * rem,
        marginBottom: 8 * rem,
        borderWidth: 1,
    },
    continueBtnText: {
        fontSize: 17 * rem,
        fontWeight: '600',
        textAlign: 'center'
    },
    icon: {
        marginRight: 8
    }
});

export default Button;
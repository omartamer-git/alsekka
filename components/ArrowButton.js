import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { palette, rem } from '../helper';

const ArrowButton = ({ text, onPress, bgColor, disabled, textColor, style, icon, iconColor, borderColor, children }) => {
    let borderColor_ = borderColor;
    if(borderColor_ === undefined) {
        borderColor_ = bgColor;
    }

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: disabled ? palette.dark : bgColor, borderColor: disabled ? palette.dark : borderColor_}, style]}
            activeOpacity={0.9}
            onPress={onPress}
            disabled={disabled}
        >
            {icon === undefined ? null : <FontsAwesome5 style={styles.icon} name={icon} size={13 * rem} color={iconColor} />}
            <View style={[styles.viewStyle, icon ? {} : { marginRight: 20 }]}>
                { text && <Text style={[styles.continueBtnText, { color: textColor }]}>{text}</Text> }
            </View>
            <View style={{alignItems: 'flex-end'}}>
                <FontsAwesome5 name="chevron-right" size={13 * rem} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    viewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1
    },
    button: {
        height: 44 * rem,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6 * rem,
        paddingLeft: 16 * rem,
        flexDirection: 'row',
        paddingRight: 16 * rem,
        marginTop: 8 * rem,
        marginBottom: 8 * rem,
        borderWidth: 1,
    },
    continueBtnText: {
        fontSize: 13 * rem,
        textAlign: 'center'
    },
    icon: {
        marginRight: 8
    }
});

export default ArrowButton;
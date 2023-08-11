import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { palette, rem, styles } from '../helper';


const textAreaStyles = StyleSheet.create({
    warningBorder: {
        borderColor: palette.red,
        borderWidth: 1,
    },

    successBorder: {
        borderColor: palette.green,
        borderWidth: 1
    }
});


export default function TextArea(props) {
    const validationStyles = props.error ? textAreaStyles.warningBorder : null;

    return (
        <>
            <View style={[styles.alignCenter, styles.justifyCenter, styles.flexRow, styles.ph24, styles.bgWhite, {marginTop: 8 * rem, marginBottom: 8 * rem, borderRadius: 4, minHeight: 48 * rem}, validationStyles, props.style]}>
                <TextInput
                    {...props}
                    multiline={true}
                    numberOfLines={4}
                    style={[styles.accent, styles.flexOne, styles.semiBold, styles.textStart, {lineHeight: 16 * rem}]}
                />
            </View>
            {props.error && <Text adjustsFontSizeToFit numberOfLines={2} style={{ color: palette.red, fontSize: 12 * rem }}>{props.error}</Text>}
        </>
    )
}

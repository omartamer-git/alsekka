import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem } from '../helper';

const CustomTextInput = ({ value,
    onChangeText, placeholder, style,
    editable, keyboardType, selectTextOnFocus,
    secureTextEntry, onFocus, onPressIn,
    iconLeft, iconRight, inputRef,
    onKeyPress, textStyles, onBlur, error }) => {
    const validationStyles = error ? styles.warningBorder : null;
    let key;

    return (
        <>
            <TouchableOpacity activeOpacity={1} onPress={onPressIn} style={[styles.container, validationStyles, style]}>
                {
                    iconLeft &&
                    <MaterialIcons name={iconLeft} size={18} style={{ paddingRight: 16 }} color={palette.primary} />
                }
                <TextInput
                    style={[styles.input, textStyles]}
                    placeholder={placeholder}
                    value={value}
                    keyboardType={keyboardType}
                    editable={editable}
                    onChangeText={onChangeText}
                    selectTextOnFocus={selectTextOnFocus}
                    secureTextEntry={secureTextEntry}
                    onFocus={onFocus}
                    autoCorrect={false}
                    autoCapitalize='none'
                    blurOnSubmit={true}
                    onBlur={onBlur}
                    placeholderTextColor={palette.light}
                    ref={inputRef}
                    onKeyPress={onKeyPress}
                    onPressIn={onPressIn}
                />
                {
                    iconRight &&
                    <MaterialIcons name={iconRight} size={18} style={{ paddingLeft: 16 }} color={palette.primary} />
                }
            </TouchableOpacity>
            {error && <Text adjustsFontSizeToFit numberOfLines={2} style={{ color: palette.red, fontSize: 12 * rem }}>{error}</Text>}
        </>
    );
};

CustomTextInput.defaultProps = {
    placeholder: '',
    value: '',
    editable: true,
    selectTextOnFocus: false,
    secureTextEntry: false,
    onPressIn: () => { },
};

const styles = StyleSheet.create({
    container: {
        height: 48 * rem,
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 4,
        flexDirection: 'row',
        paddingLeft: 24,
        paddingRight: 24,
        marginTop: 8,
        marginBottom: 8,
        backgroundColor: palette.white
    },
    input: {
        height: 23,
        textAlign: 'left',
        fontWeight: '500',
        color: palette.accent,
        flex: 1
    },

    warningBorder: {
        borderColor: palette.red,
        borderWidth: 1,
    },

    successBorder: {
        borderColor: palette.green,
        borderWidth: 1
    }
});

export default CustomTextInput;
import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Keyboard, Text } from 'react-native';
import { palette, rem } from '../helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomTextInput = ({ value,
    onChangeText, placeholder, style,
    editable, keyboardType, selectTextOnFocus,
    secureTextEntry, onFocus, onPressIn,
    iconLeft, iconRight, inputRef,
    onKeyPress, textStyles, validated = false, validationFunction, validationText = "" }) => {
    const [error, setError] = useState(false);
    const validationStyles = validated ? (error ? styles.warningBorder : styles.successBorder) : null;

    // const onChangeText_ = (text) => {
    //     onChangeText(text);
    //     // validationFunction && validationFunction(text) ? setError(false) : setError(true);
    // };

    return (
        <>
            <View style={[styles.container, validationStyles, style]}>
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
                    onPressIn={onPressIn}
                    placeholderTextColor={palette.light}
                    ref={inputRef}
                    onKeyPress={onKeyPress}
                />
                {
                    iconRight &&
                    <MaterialIcons name={iconRight} size={18} style={{ paddingLeft: 16 }} color={palette.primary} />
                }
            </View>
            {validated && error && <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: palette.red, fontSize: 12 * rem }}>{validationText}</Text>}

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
        height: 23 * rem,
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
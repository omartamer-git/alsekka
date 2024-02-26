import React, { memo, useEffect, useRef } from 'react';
import { I18nManager, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem, styles } from '../helper';

function CustomTextInput({ value,
    onChangeText, placeholder, style,
    editable, keyboardType, selectTextOnFocus,
    secureTextEntry, onFocus, onPressIn, role,
    iconLeft, emojiLeft, iconRight, inputRef,
    returnKeyType, onSubmitEditing,
    onKeyPress, textStyles, onBlur, error, autoCapitalize, disabled = false }) {

    const styles2 = StyleSheet.create({
        container: {
            height: 48 * rem,
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 4 * rem,
            ...styles.flexRow,
            paddingStart: 24 * rem,
            paddingEnd: 24 * rem,
            marginTop: 8 * rem,
            marginBottom: 8 * rem,
            backgroundColor: disabled ? palette.light : palette.white
        },
        input: {
            borderWidth: 1,
            height: 24 * rem,
            lineHeight: Platform.OS === 'ios' ? 16 * rem : 1,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
            fontWeight: '500',
            textAlignVertical: 'bottom',
            marginHorizontal: 8 * rem,
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

    
    const validationStyles = error ? styles2.warningBorder : null;
    let key;



    if (!inputRef) {
        inputRef = useRef(null);
    }

    function onPressIn_(e) {
        if (onFocus) {
            onFocus();
        }

        if (role === "button") {
            onPressIn(e);
            inputRef.current.blur();
            return;
        }

        inputRef.current.focus();
    }

    return (
        <>
            <TouchableOpacity activeOpacity={1} onPress={onPressIn_} style={[styles2.container, validationStyles, style]}>
                {
                    iconLeft && !emojiLeft &&
                    <MaterialIcons name={iconLeft} size={18} color={palette.primary} />
                }
                {
                    emojiLeft &&
                    <Text style={[styles.font14]}>{emojiLeft}</Text>
                }
                <TextInput
                    style={[styles2.input, textStyles]}
                    placeholder={placeholder}
                    value={value}
                    keyboardType={keyboardType}
                    editable={role === "button" ? true : editable}
                    onChangeText={onChangeText}
                    selectTextOnFocus={selectTextOnFocus}
                    secureTextEntry={secureTextEntry}
                    onFocus={onFocus}
                    autoCorrect={false}
                    blurOnSubmit={true}
                    onBlur={onBlur}
                    placeholderTextColor={palette.light}
                    ref={inputRef}
                    onKeyPress={onKeyPress}
                    textContentType={secureTextEntry ? 'oneTimeCode' : 'none'}
                    onFocus={onPressIn_}
                    numberOfLines={1}
                    returnKeyType={returnKeyType}
                    ellipsizeMode='tail'
                    autoCapitalize={autoCapitalize || 'sentences'}
                />
                {
                    iconRight &&
                    <MaterialIcons name={iconRight} size={18} color={palette.primary} />
                }
            </TouchableOpacity>
            {error && <Text adjustsFontSizeToFit numberOfLines={3} style={[styles.text, { color: palette.red, fontSize: 12 * rem }]}>{error}</Text>}
        </>
    );
};

CustomTextInput.defaultProps = {
    placeholder: '',
    value: '',
    editable: true,
    selectTextOnFocus: false,
    secureTextEntry: false,
    onPressIn: function () { },
};



export default memo(CustomTextInput);
import React, { memo, useRef } from 'react';
import { I18nManager, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem, styles, translateEnglishNumbers } from '../helper';
import useLocale from '../locale/localeContext';

function CustomTextInput({ value, prefix,
    onChangeText, placeholder, style,
    editable, keyboardType, selectTextOnFocus,
    secureTextEntry, onFocus, onPressIn, role,
    iconLeft, emojiLeft, iconRight, inputRef,
    returnKeyType, onSubmitEditing, textContentType,
    onKeyPress, textStyles, onBlur, error, autoCapitalize, disabled = false, blurOnSubmit = true, overrideRTL = false }) {

    const { language } = useLocale();
    const styles2 = StyleSheet.create({
        container: {
            height: 48 * rem,
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 8 * rem,
            flexDirection: (overrideRTL && I18nManager.isRTL) ? 'row-reverse' : 'row',
            paddingStart: 24 * rem,
            paddingEnd: 24 * rem,
            marginTop: 8 * rem,
            marginBottom: 8 * rem,
            // shadowRadius: 8,
            // shadowColor: '#000',
            // shadowOpacity: 0.05,
            // shadowOffset: { width: 5, height: 5 },
            backgroundColor: disabled ? palette.light : palette.white
        },
        input: {
            height: 24 * rem,
            lineHeight: Platform.OS === 'ios' ? 16 * rem : undefined,
            textAlign: (I18nManager.isRTL && !overrideRTL) ? 'right' : 'left',
            paddingTop: Platform.OS === 'android' ? 0 : undefined,
            paddingBottom: Platform.OS === 'android' ? 0 : undefined,
            fontWeight: '500',
            textAlignVertical: 'center',
            marginHorizontal: 8 * rem,
            color: palette.dark,
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
            <TouchableOpacity activeOpacity={1} onPress={onPressIn_} style={[styles2.container, validationStyles, styles.shadow, style]}>
                {
                    iconLeft && !emojiLeft &&
                    <MaterialIcons name={iconLeft} size={18} color={palette.primary} />
                }
                {
                    emojiLeft &&
                    <Text style={[styles.font14, styles.dark]}>{emojiLeft}</Text>
                }
                {
                    (prefix) &&
                    <View style={[{height: 24 * rem}, styles.fullCenter, styles.flexRow]}>
                        <Text style={[styles.bgWhite, styles.text, styles.ml5, { fontWeight: '500', textAlignVertical: 'bottom', paddingVertical: Platform.OS === 'android' ? 0 : undefined, lineHeight: Platform.OS === 'ios' ? 16 * rem : undefined }]}>
                            {prefix}
                        </Text>
                    </View>
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
                    autoCorrect={false}
                    blurOnSubmit={blurOnSubmit}
                    onBlur={onBlur}
                    placeholderTextColor={palette.light}
                    ref={inputRef}
                    onKeyPress={onKeyPress}
                    textContentType={textContentType || 'none'}
                    onFocus={onPressIn_}
                    numberOfLines={1}
                    returnKeyType={returnKeyType}
                    ellipsizeMode='tail'
                    autoCapitalize={autoCapitalize || 'sentences'}
                    onSubmitEditing={onSubmitEditing}
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
import React from 'react';
import { TextInput, View, StyleSheet, Keyboard } from 'react-native';
import { palette } from '../helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomTextInput = ({ value, onChangeText, placeholder, style, editable, keyboardType, selectTextOnFocus, secureTextEntry, onFocus, onPressIn, iconLeft, iconRight, inputRef, onKeyPress, textStyles }) => {
    return (
        <View style={[styles.container, style]}>
            {
                iconLeft &&
                <MaterialIcons name={iconLeft} size={18} style={{paddingRight: 16}} color={palette.primary} />
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
                <MaterialIcons name={iconRight} size={18} style={{paddingLeft: 16}} color={palette.primary} />
            }
        </View>
    );
};

CustomTextInput.defaultProps = {
    placeholder: '',
    value: '',
    editable: true,
    selectTextOnFocus: false,
    secureTextEntry: false,
    onPressIn: () => {},
};

const styles = StyleSheet.create({
    container: {
        height: 48,
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
    }
});

export default CustomTextInput;
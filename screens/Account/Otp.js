import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    I18nManager,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import useUserStore from '../../api/accountAPI';
import ErrorMessage from '../../components/ErrorMessage';
import { containerStyle, palette, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import FastImage from 'react-native-fast-image';

function Otp({ route, navigation }) {
    const firstName = route.params?.firstName;
    const lastName = route.params?.lastName;
    const phone = route.params?.phone;
    const email = route.params?.email;
    const password = route.params?.password;
    const gender = route.params?.gender;
    const onVerify = route.params?.onVerify;
    const [currentInput, setCurrentInput] = useState(0);
    const [error, setError] = useState(null);
    let countdownInterval = null;
    const { getOtp, sendOtp, sendOtpSecurity, isVerified, createAccount, login } = useUserStore();
    const [uri, setUri] = useState('');
    const [token, setToken] = useState('');

    const otpInputs = [useRef(), useRef(), useRef(), useRef(), useRef()]
    const [otpValue0, setOtpValue0] = useState("");
    const [otpValue1, setOtpValue1] = useState("");
    const [otpValue2, setOtpValue2] = useState("");
    const [otpValue3, setOtpValue3] = useState("");
    const [otpValue4, setOtpValue4] = useState("");

    const clockTick = function () {
        isVerified(phone).then(response => {
            if (response === true) {
                if (onVerify === 'login') {
                    createAccount(firstName, lastName, phone, email, password, gender).then((data) => {
                        login(phone, password).then(function () {
                            navigation.popToTop();
                            navigation.replace("LoggedIn", {
                                screen: 'TabScreen',
                                params: {
                                    screen: 'Home',
                                }
                            });
                            clearInterval(countdownInterval);
                        })
                    }).catch(err => {
                        const errorMessage = I18nManager.isRTL ? err.response.data.error.message_ar : err.response.data.error.message;
                        setError(errorMessage);
                    })
                } else {
                    navigation.popToTop();
                    navigation.replace("Change Password", { token });
                }
            }
        }).catch(err => {
            console.log(err);
            const errorMessage = I18nManager.isRTL ? err.response.data.error.message_ar : err.response.data.error.message;
            setError(errorMessage);
        })
    };

    const [time, setTime] = useState(0);
    const [triggerCountdown, setTriggerCountdown] = useState(false);

    useEffect(function () {
        if (!triggerCountdown) return;
        const timer = setTimeout(function () {
            clockTick();
            setTime(time + 1);
        }, 5000);
        return function () {
            clearTimeout(timer);
        };
    }, [triggerCountdown, time])


    const resendOtp = function () {
        getOtp(phone).then((response) => {
            setUri(response.uri);
            setToken(response.token);
            setTriggerCountdown(true);
        }).catch(err => {
            const errorMessage = I18nManager.isRTL ? err.response.data.error.message_ar : err.response.data.error.message;
            setError(errorMessage);
        });
    };

    const openWhatsapp = function () {
        Linking.openURL(uri);
    };

    useEffect(function () {
        resendOtp();
    }, [])

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    function setOtpValue(index, text) {
        if (index === 0) {
            setOtpValue0(text);
        } else if (index === 1) {
            setOtpValue1(text);
        } else if (index === 2) {
            setOtpValue2(text);
        } else if (index === 3) {
            setOtpValue3(text);
        } else {
            setOtpValue4(text);
        }
    }

    function changeOTP(index, text) {
        setOtpValue(index, text);

        if ((index === 0 && text.length === 0) || (index === 4 && text.length === 1)) {
            return;
        }

        if (text.length === 0) {
            otpInputs[index - 1].current.focus();
        } else {
            otpInputs[index + 1].current.focus();
        }
    }

    function handleKeyPress(index, { nativeEvent }) {
        if (nativeEvent.key === 'Backspace') {
            otpInputs[index - 1].current.focus();
        }
    }

    useFocusEffect(onFocusEffect); // register callback to focus events    

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('verification_code')} navType="back" navAction={function () { navigation.goBack() }} lip={false}>
            <View style={[styles.bgPrimary, styles.w100, styles.p24]}>
                <Text style={[styles.text, styles.white, styles.bold, styles.font28]}>
                    {t('verification_code')}
                </Text>
                <Text style={[styles.text, styles.white, styles.bold, styles.font12, styles.mt5]}>
                    +2{phone}
                </Text>
                <Text style={[styles.text, styles.white, styles.font12, styles.mt5]}>
                    {t('code_sent')}
                </Text>
            </View>
            {/* <View style={[styles.w100, styles.bgPrimary, { height: 48 }]}>
                <View style={[styles.w100, styles.bgLightGray, styles.h100, { borderTopLeftRadius: 16, borderTopRightRadius: 16 }]} />
            </View> */}
            <View style={[styles.flexOne, styles.w100, styles.bgPrimary]}>
                <View style={[styles.flexOne, styles.w100, styles.defaultPadding, styles.bgLightGray, styles.fullCenter, { borderTopLeftRadius: 16, borderTopRightRadius: 16 }]}>

                    <View style={[styles.flexRow, styles.w100, styles.gap10]}>
                        <TextInput style={OTPStyles.inputStyle} value={otpValue0} onChangeText={(text) => changeOTP(0, text)} keyboardType='number-pad' maxLength={1} ref={otpInputs[0]}></TextInput>
                        <TextInput onKeyPress={(e) => handleKeyPress(1, e)} style={OTPStyles.inputStyle} value={otpValue1} onChangeText={(text) => changeOTP(1, text)} keyboardType='number-pad' maxLength={1} ref={otpInputs[1]}></TextInput>
                        <TextInput onKeyPress={(e) => handleKeyPress(2, e)} style={OTPStyles.inputStyle} value={otpValue2} onChangeText={(text) => changeOTP(2, text)} keyboardType='number-pad' maxLength={1} ref={otpInputs[2]}></TextInput>
                        <TextInput onKeyPress={(e) => handleKeyPress(3, e)} style={OTPStyles.inputStyle} value={otpValue3} onChangeText={(text) => changeOTP(3, text)} keyboardType='number-pad' maxLength={1} ref={otpInputs[3]}></TextInput>
                        <TextInput onKeyPress={(e) => handleKeyPress(4, e)} style={OTPStyles.inputStyle} value={otpValue4} onChangeText={(text) => changeOTP(4, text)} keyboardType='number-pad' maxLength={1} ref={otpInputs[4]}></TextInput>
                    </View>

                    <Button disabled={!uri} onPress={openWhatsapp} bgColor={palette.accent} textColor={palette.white} text={t('verify_phone')} />
                    {/* <FastImage source={{ uri: 'https://seaats.app/img/create_acc_guide.png' }} style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }} /> */}
                </View>
            </View>
        </ScreenWrapper>
    );
};

const OTPStyles = StyleSheet.create({
    inputStyle: {
        ...styles.flexOne,
        ...styles.border1,
        ...styles.br8,
        ...styles.borderLight,
        ...styles.text,
        ...styles.textCenter,
        ...styles.font28,
        ...styles.p8,
        aspectRatio: 1,
        lineHeight: null
    }
})

export default Otp;
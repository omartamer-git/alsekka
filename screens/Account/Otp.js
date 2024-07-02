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
    TouchableOpacity,
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
    const [otpType, setOtpType] = useState(phone.startsWith('10') ? 'whatsapp' : 'sms');
    let countdownInterval = null;

    const getOtp = useUserStore(state => state.getOtp);
    const sendOtp = useUserStore(state => state.sendOtp);
    const sendOtpSecurity = useUserStore(state => state.sendOtpSecurity);
    const isVerified = useUserStore(state => state.isVerified);
    const verified = useUserStore(state => state.verified);
    const createAccount = useUserStore(state => state.createAccount);
    const confirmOtp = useUserStore(state => state.confirmOtp);
    const login = useUserStore(state => state.login);

    const [uri, setUri] = useState('');
    const [token, setToken] = useState('');

    const otpInputs = [useRef(), useRef(), useRef(), useRef(), useRef()]
    const [otpValue0, setOtpValue0] = useState("");
    const [otpValue1, setOtpValue1] = useState("");
    const [otpValue2, setOtpValue2] = useState("");
    const [otpValue3, setOtpValue3] = useState("");
    const [otpValue4, setOtpValue4] = useState("");

    function createAccountAndLogin() {
        if (onVerify === 'login') {
            console.log('sd')
            console.log(firstName, lastName, phone, email, password, gender);
            createAccount(firstName, lastName, phone, email, password, gender).then((data) => {
                login(phone, password);
            }).catch(err => {
                console.log(err);
                const errorMessage = I18nManager.isRTL ? err.response.data.error.message_ar : err.response.data.error.message;
                setError(errorMessage);
            })
        } else {
            console.log("token: " + token);
            navigation.popToTop();
            navigation.replace("Change Password", { token });
        }
    }    

    const clockTick = function () {
        isVerified(phone).then(response => {
            if (response === true) {
                createAccountAndLogin();
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

    useEffect(() => {
        if(otpInputs[0].current) {
            otpInputs[0].current.focus();
        }
    }, [])


    const resendOtp = function () {
        console.log('resending otp');
        getOtp(phone, otpType).then((response) => {
            if (response.type === "sms") {
                setToken(response.token);
            } else {
                setUri(response.uri);
                setToken(response.token);
                setTriggerCountdown(true);
            }
        }).catch(err => {
            const errorMessage = I18nManager.isRTL ? err.response.data.error.message_ar : err.response.data.error.message;
            setError(errorMessage);
        });
    };

    function verifyOtp() {
        const otp = otpValue0 + otpValue1 + otpValue2 + otpValue3 + otpValue4;
        confirmOtp(phone, otp).then(function (response) {
            createAccountAndLogin();
        }).catch(err => {
            const errorMessage = I18nManager.isRTL ? err.response.data.error.message_ar : err.response.data.error.message;
            setError(errorMessage);
        })
    }

    const openWhatsapp = function () {
        Linking.openURL(uri);
    };

    useEffect(function () {
        resendOtp();

        return () => {
            console.log("OTP Unmounting")
        }
    }, [otpType])

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    function setOtpValue(index, text) {
        // console.log(text);
        let firstChar;
        if(text.length === 1) {
            firstChar = text;
            text = '';
        } else {
            firstChar = text.charAt(0);
            text = text.slice(1);
        }
        // const firstChar = text.charAt(0);

        if (index === 0) {
            setOtpValue0(firstChar);
        } else if (index === 1) {
            setOtpValue1(firstChar);
        } else if (index === 2) {
            setOtpValue2(firstChar);
        } else if (index === 3) {
            setOtpValue3(firstChar);
        } else {
            setOtpValue4(firstChar);
        }

        return text;
    }

    function changeOTP(index, text) {
        const remainingText = setOtpValue(index, text);

        if ((index === 0 && text.length === 0) || (index === 4 && text.length === 1)) {
            return;
        }

        if (text.length === 0) {
            otpInputs[index - 1].current.focus();
        } else {
            otpInputs[index + 1].current.focus();
        }

        if(remainingText.length > 0) {
            changeOTP(index + 1, remainingText);
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

                    {otpType === 'sms' &&
                        <>
                            <View style={[styles.flexRow, styles.w100, styles.gap10]}>
                                <TextInput textContentType='oneTimeCode' style={OTPStyles.inputStyle} value={otpValue0} onChangeText={(text) => changeOTP(0, text)} keyboardType='number-pad' ref={otpInputs[0]}></TextInput>
                                <TextInput textContentType='oneTimeCode' onKeyPress={(e) => handleKeyPress(1, e)} style={OTPStyles.inputStyle} value={otpValue1} onChangeText={(text) => changeOTP(1, text)} keyboardType='number-pad' ref={otpInputs[1]}></TextInput>
                                <TextInput textContentType='oneTimeCode' onKeyPress={(e) => handleKeyPress(2, e)} style={OTPStyles.inputStyle} value={otpValue2} onChangeText={(text) => changeOTP(2, text)} keyboardType='number-pad' ref={otpInputs[2]}></TextInput>
                                <TextInput textContentType='oneTimeCode' onKeyPress={(e) => handleKeyPress(3, e)} style={OTPStyles.inputStyle} value={otpValue3} onChangeText={(text) => changeOTP(3, text)} keyboardType='number-pad' ref={otpInputs[3]}></TextInput>
                                <TextInput textContentType='oneTimeCode' onKeyPress={(e) => handleKeyPress(4, e)} style={OTPStyles.inputStyle} value={otpValue4} onChangeText={(text) => changeOTP(4, text)} keyboardType='number-pad' ref={otpInputs[4]}></TextInput>
                            </View>
                            <Button onPress={verifyOtp} bgColor={palette.accent} textColor={palette.white} text={t('verify_phone')} />


                            <TouchableOpacity onPress={() => setOtpType('whatsapp')} activeOpacity={0.8} style={[styles.w100, styles.p8, styles.fullCenter]}>
                                <Text style={[styles.text, styles.textCenter, styles.bold, styles.font14, styles.primary]}>
                                    {t('sms_failsafe')}
                                </Text>
                            </TouchableOpacity>
                        </>
                    }
                    {
                        otpType === 'whatsapp' &&
                        <Button disabled={!uri} onPress={openWhatsapp} bgColor={palette.accent} textColor={palette.white} text={t('verify_whatsapp')} />
                    }
                    {/* <FastImage source={{ uri: 'https://seaats.app/img/create_acc_guide.png' }} style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }} /> */}
                </View>
            </View>
        </ScreenWrapper>
    );
};

const OTPStyles = StyleSheet.create({
    inputStyle: {
        ...styles.flexOne,
        ...styles.border2,
        ...styles.br8,
        ...styles.borderLight,
        ...styles.text,
        ...styles.textCenter,
        ...styles.font28,
        ...styles.ph8,
        ...styles.pv8,
        ...styles.shadow,
        aspectRatio: 1,
        lineHeight: null
    }
})

export default Otp;
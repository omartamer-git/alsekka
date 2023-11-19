import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Linking,
    Platform,
    ScrollView,
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

const DigitBox = ({ swap, onFocus, inputRef }) => {
    const [digit, setDigit] = useState('');

    const onKeyPress = (e) => {
        const key = e.nativeEvent.key;
        if (key === 'Backspace') {
            setDigit('');
            swap('', -1);
            return;
        }
        if (!isNaN(parseInt(key))) {
            setDigit(key);
            swap(key, 1);
        }
    }

    return (
        <TextInput
            value={digit}
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            ref={inputRef}
            style={[styles.border1, styles.font28, styles.br8, styles.borderDark, styles.flexOne, styles.mh10, styles.p8, styles.alignCenter, styles.justifyCenter, { textAlign: 'center', textAlignVertical: 'center', lineHeight: 32 }]} />
    );
}

const Otp = ({ route, navigation }) => {
    const firstName = route.params?.firstName;
    const lastName = route.params?.lastName;
    const phone = route.params?.phone;
    const email = route.params?.email;
    const password = route.params?.password;
    const gender = route.params?.gender;
    const onVerify = route.params?.onVerify;
    const [currentInput, setCurrentInput] = useState(0);
    const numDigits = 4;
    const [error, setError] = useState(null);
    let countdownInterval = null;
    const { getOtp, sendOtp, sendOtpSecurity, isVerified, createAccount, login } = useUserStore();
    const [uri, setUri] = useState('');
    const [token, setToken] = useState('');

    const clockTick = () => {
        isVerified(phone).then(response => {
            if (response === true) {
                if (onVerify === 'login') {
                    createAccount(firstName, lastName, phone, email, password, gender).then((data) => {
                        login(phone, password).then(() => {
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
                        console.log(err);
                        setErrorMessage(err.response.data.error.message);
                    })
                } else {
                    navigation.popToTop();
                    console.log('hello token')
                    console.log(token);
                    navigation.replace("Change Password", { token });
                }
            }
        }).catch(err => {
            console.log(err);
            setError(err.response.data.error.message);
        })
    };

    const [time, setTime] = useState(0);
    const [triggerCountdown, setTriggerCountdown] = useState(false);

    useEffect(() => {
        if(!triggerCountdown) return;
        const timer = setTimeout(() => {
            clockTick();
            setTime(time + 1);
        }, 5000);
        return () => {
            clearTimeout(timer);
        };
    }, [triggerCountdown, time])


    const resendOtp = () => {
        console.log('hello ' + phone);
        getOtp(phone).then((response) => {
            console.log('resp');
            console.log(response);
            setUri(response.uri);
            setToken(response.token);
            setTriggerCountdown(true);
        }).catch(err => {
            console.log(err);
            setError(err.response.data.error.message)
        });
    };

    const openWhatsapp = () => {
        Linking.openURL(uri);
    };

    useEffect(() => {
        resendOtp();
    }, [])

    if (Platform.OS === 'ios') {
        const onFocusEffect = useCallback(() => {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return () => {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }, []);

        useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('verification_code')} navType="back" navAction={() => { navigation.goBack() }} lip={false}>
            <View style={[styles.bgPrimary, styles.w100, styles.p24]}>
                <Text style={[styles.white, styles.bold, styles.font28]}>
                    {t('verification_code')}
                </Text>
                <Text style={[styles.white, styles.bold, styles.font12, styles.mt5]}>
                    +2{phone}
                </Text>
                <Text style={[styles.white, styles.font12, styles.mt5]}>
                    {t('code_sent')}
                </Text>
            </View>
            <View style={[styles.w100, styles.bgPrimary, { height: 48 }]}>
                <View style={[styles.w100, styles.bgLightGray, styles.h100, { borderTopLeftRadius: 16, borderTopRightRadius: 16 }]} />
            </View>
            <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle]}>
                <Button disabled={!uri} onPress={openWhatsapp} bgColor={palette.success} textColor={palette.white} text="Verify Using WhatsApp" />
            </ScrollView>
        </ScreenWrapper>
    );
};

export default Otp;
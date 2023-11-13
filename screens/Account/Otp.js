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
    const { firstName, lastName, phone, email, password, gender, onVerify } = route.params;
    const [currentInput, setCurrentInput] = useState(0);
    const numDigits = 4;
    const [error, setError] = useState(null);
    let countdownInterval = null;
    const { getOtp, sendOtp, sendOtpSecurity, isVerified, createAccount, login } = useUserStore();
    // let filledInputs = useRef(Array(numDigits).fill(false));

    // const verifyOtp = () => {
    //     if (onVerify === 'login') {
    //         sendOtp(phone, otpInput.current.join('')).then(response => {
    //             if (response) {
    //                 navigation.popToTop();
    //                 navigation.replace("LoggedIn", {
    //                     screen: 'TabScreen',
    //                     params: {
    //                         screen: 'Home',
    //                     }
    //                 });
    //             }
    //         }).catch(err => {
    //             setError(err.response.data.error.message)
    //         });
    //     } else if (onVerify === 'changePassword') {
    //         sendOtpSecurity(phone, otpInput.current.join('')).then(token => {
    //             if (token) {
    //                 navigation.popToTop();
    //                 navigation.replace("Change Password", { token });
    //             }
    //         }).catch(err => {
    //             setError(err.response.data.error.message)
    //         });
    //     }
    // }

    const triggerCountdown = () => {
        countdownInterval = setInterval(
            () => {
                isVerified(phone).then(response => {
                    if (response === true) {
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
                    }
                }).catch(err => {
                    setError(err.response.data.error.message);
                })
            }, 5000
        );
    };


    useEffect(() => {
        return () => {
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        };
    }, []);


    const [uri, setUri] = useState('');
    const resendOtp = () => {
        getOtp(phone).then((uri) => {
            setUri(uri);
            triggerCountdown();
        }).catch(err => {
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
                {/* <View style={[styles.w100, styles.flexRow]}>
                    {
                        otpInput.current.map((_, index) => {
                            return (<DigitBox key={"digitbox" + index} inputRef={ref => otpRef.current.push(ref)} onFocus={() => setCurrentInput(index)} swap={swap} />);
                        })
                    }
                </View>

                <View style={[styles.w100, styles.justifyCenter, styles.alignCenter, styles.mt10]}>
                    <ErrorMessage message={error} condition={error} style={styles.mb10} />
                    {!resendAvailable && <Text style={[styles.font12, styles.dark]}>{t('please_wait')} {countdown} {t('seconds_before_requesting')}</Text>}
                    {resendAvailable && <Text style={[styles.font12, styles.dark, styles.bold]} onPress={resendOtp}>{t('resend')} {t('verification_code')}</Text>}
                </View> */}
                <Button disabled={!uri} onPress={openWhatsapp} bgColor={palette.success} textColor={palette.white} text="Verify Using WhatsApp" />
            </ScrollView>
        </ScreenWrapper>
    );
};

export default Otp;
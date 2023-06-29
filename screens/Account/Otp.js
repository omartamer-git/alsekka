import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { styles, rem, containerStyle } from '../../helper';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import * as globalVars from '../../globalVars';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../../components/ErrorMessage';
import ScreenWrapper from '../ScreenWrapper';
import { getOtp, sendOtp } from '../../api/accountAPI';

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
    const { phone } = route.params;
    const [currentInput, setCurrentInput] = useState(0);
    const numDigits = 4;
    let otpInput = useRef(Array(numDigits).fill(""));
    let otpRef = useRef([]);
    const [countdown, setCountdown] = useState(5);
    const [error, setError] = useState(null);
    const [resendAvailable, setResendAvailable] = useState(false);
    let countdownInterval = null;
    // let filledInputs = useRef(Array(numDigits).fill(false));

    const verifyOtp = () => {
        console.log("verifying otp " + otpInput.current)
        sendOtp(otpInput.current.join('')).then(response => {
            if (response) {
                globalVars.setVerified(true);
                navigation.popToTop();
                navigation.replace("LoggedIn", {
                  screen: 'TabScreen',
                  params: {
                    screen: 'Home',
                  }
                });
            }
        }).catch(err => {
            setError(err.response.data.error.message)
        });
    }

    const swap = (key, offset) => {
        otpInput.current[currentInput] = key;
        const result = otpInput.current.every((element) => element);
        if (result) {
            return verifyOtp();
        }

        const currentInput_ = Math.max(0, Math.min(currentInput + offset, 3));
        setCurrentInput(
            currentInput_
        );
        otpRef.current[currentInput_].focus();
    };

    const triggerCountdown = () => {
        setResendAvailable(false);
        setCountdown(60);
        countdownInterval = setInterval(
            () => {
                setCountdown(c => {
                    if (c === 0) {
                        clearInterval(countdownInterval);
                        setResendAvailable(true);
                        return 0;
                    }
                    return c - 1;
                });
            }, 1000
        );
    };

    const resendOtp = () => {
        getOtp().then(() => {
            triggerCountdown();
        }).catch(err => {
            setError(err.response.data.error.message)
        });
    };

    useEffect(() => {
        resendOtp();
    }, [])

    return (
        <ScreenWrapper screenName="" navType="back" navAction={() => { navigation.goBack() }} lip={false}>
            <View style={[styles.bgPrimary, styles.w100, styles.p24]}>
                <Text style={[styles.white, styles.bold, styles.font28]}>
                    Verification Code
                </Text>
                <Text style={[styles.white, styles.font12, styles.mt5]}>
                    We have sent an SMS with the verification code to
                </Text>
                <Text style={[styles.white, styles.bold, styles.font12, styles.mt5]}>
                    +2{phone}
                </Text>
            </View>
            <View style={[styles.w100, styles.bgPrimary, { height: 48 }]}>
                <View style={[styles.w100, styles.bgLightGray, styles.h100, { borderTopLeftRadius: 16, borderTopRightRadius: 16 }]} />
            </View>
            <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle]}>
                <View style={[styles.w100, styles.flexRow]}>
                    {
                        otpInput.current.map((_, index) => {
                            return (<DigitBox key={"digitbox" + index} inputRef={ref => otpRef.current.push(ref)} onFocus={() => setCurrentInput(index)} swap={swap} />);
                        })
                    }
                </View>

                <View style={[styles.w100, styles.justifyCenter, styles.alignCenter, styles.mt10]}>
                    <ErrorMessage message={error} condition={error} style={styles.mb10} />
                    { !resendAvailable && <Text style={[styles.font12, styles.dark]}>Please wait {countdown} seconds before requesting a new code</Text> }
                    { resendAvailable && <Text style={[styles.font12, styles.dark, styles.bold]} onPress={resendOtp}>Resend Verification Code</Text> }
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default Otp;
import React, { useCallback, useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    Image,
    TextInput,
    TouchableWithoutFeedback,
} from 'react-native';
import { styles, SERVER_URL, palette, isPhoneNumberValid } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import HeaderView from '../../components/HeaderView';
import { config } from '../../config';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../../components/ErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';


const ForgotPasswordScreen = ({ route, navigation }) => {
    const { phone } = route.params;
    console.log(route.params);
    const isDarkMode = useColorScheme === 'dark';
    const [errorMessage, setErrorMessage] = useState(null);
    const loginSchema = Yup.object().shape({
        phoneInput: Yup.string().matches(
            /^01[0-2,5]{1}[0-9]{8}$/,
            'Please enter a valid phone number in international format'
        )
            .required('This field is required'),
    });

    const handleContinueClick = (phoneInput) => {
        navigation.navigate('Otp', {phone: phoneInput, onVerify: 'changePassword'})
    };

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



    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" borderVisible={false} action={() => { navigation.goBack() }}>
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>
            <View style={styles.wrapper}>
                <View style={[styles.defaultPadding, styles.headerTextMargins]}>
                    <Text style={[styles.headerText, styles.white]}>Forgot Password</Text>
                </View>
                <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexOne, styles.br16]}>
                    <View style={[styles.defaultContainer, styles.defaultPadding, styles.bgLightGray, styles.br16, styles.w100]}>
                        <View style={[styles.w100, styles.flexOne, styles.defaultPaddingVertical]}>
                            <Formik
                                initialValues={{ phoneInput: phone }}
                                validationSchema={loginSchema}
                                onSubmit={(values) => { handleContinueClick(values.phoneInput) }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                                    <>
                                        <Text style={styles.inputText}>Phone Number</Text>
                                        <CustomTextInput
                                            value={values.phoneInput}
                                            onChangeText={handleChange('phoneInput')}
                                            onBlur={handleBlur('phoneInput')}
                                            placeholder="Enter your phone number"
                                            error={touched.phoneInput && errors.phoneInput}
                                        />

                                        <Button
                                            style={[styles.continueBtn, styles.mt20]}
                                            text="Send Verification Code"
                                            bgColor={palette.primary}
                                            textColor={palette.white}
                                            onPress={handleSubmit}
                                            disabled={!isValid}
                                        />
                                    </>
                                )}
                            </Formik>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
};

export default ForgotPasswordScreen;
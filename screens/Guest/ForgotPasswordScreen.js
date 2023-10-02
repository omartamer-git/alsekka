import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Platform,
    SafeAreaView,
    Text,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import HeaderView from '../../components/HeaderView';
import { palette, styles } from '../../helper';


const ForgotPasswordScreen = ({ route, navigation }) => {
    const { phone } = route.params;
    console.log(route.params);
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

    if(Platform.OS === 'ios') {
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
    
        // useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    const {t} = useTranslation();



    return (
        <View style={styles.backgroundStyle}>
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
                    <Text style={[styles.headerText, styles.white]}>{t('forgot_password')}</Text>
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
                                        <Text style={styles.inputText}>{t('phone_number')}</Text>
                                        <CustomTextInput
                                            value={values.phoneInput}
                                            onChangeText={handleChange('phoneInput')}
                                            onBlur={handleBlur('phoneInput')}
                                            placeholder={t('enter_phone')}
                                            error={touched.phoneInput && errors.phoneInput}
                                        />

                                        <Button
                                            style={[styles.continueBtn, styles.mt20]}
                                            text={t('send_verification_code')}
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
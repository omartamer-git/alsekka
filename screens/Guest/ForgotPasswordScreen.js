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


function ForgotPasswordScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { phone } = route.params;
    const [errorMessage, setErrorMessage] = useState(null);
    const loginSchema = Yup.object().shape({
        phoneInput: Yup.string().matches(
            /^1[0-2,5]{1}[0-9]{8}$/,
            t('error_invalid_phone')
        )
            .required(t('error_required')),
    });

    const handleContinueClick = (phoneInput) => {
        navigation.navigate('Otp', { phone: "0" + phoneInput, onVerify: 'changePassword' })
    };

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events    




    return (
        <View style={styles.backgroundStyle}>
            <SafeAreaView>
                <HeaderView navType="back" borderVisible={false} action={function () { navigation.goBack() }}>
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={[styles.text, styles.locale]}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>
            <View style={styles.wrapper}>
                <View style={[styles.defaultPadding, styles.headerTextMargins]}>
                    <Text style={[styles.text, styles.headerText, styles.white]}>{t('forgot_password')}</Text>
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
                                        <Text style={[styles.text, styles.inputText]}>{t('phone_number')}</Text>
                                        <CustomTextInput
                                            value={"+20 " + values.phoneInput}
                                            emojiLeft={"🇪🇬"}
                                            onChangeText={(text) => {
                                                if (text == '') return;
                                                let sanitizedText = text.replace("+20", "").trim();
                                                handleChange('phoneInput')(sanitizedText);
                                            }}
                                            onBlur={handleBlur('phoneInput')}
                                            error={touched.phoneInput && errors.phoneInput}
                                            placeholder={t('enter_phone')}
                                            keyboardType="number-pad"
                                        />

                                        <Button
                                            style={[styles.continueBtn, styles.mt20]}
                                            text={t('send_verification_code')}
                                            bgColor={palette.primary}
                                            textColor={palette.white}
                                            onPress={handleSubmit}
                                            disabled={!isValid || !values.phoneInput.trim()}
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
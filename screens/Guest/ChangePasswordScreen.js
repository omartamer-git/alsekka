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
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import ErrorMessage from '../../components/ErrorMessage';
import HeaderView from '../../components/HeaderView';
import { palette, styles } from '../../helper';


function ChangePasswordScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { token } = route.params;
    const [errorMessage, setErrorMessage] = useState(null);
    const { resetPassword } = useUserStore();
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const changePasswordSchema = Yup.object().shape({
        passwordInput: Yup.string().min(8, t('error_password')).required(t('error_required')),
        password2Input: Yup.string().min(8, t('error_password')).oneOf([Yup.ref('passwordInput'), null], t('error_confirm_password')).required(t('error_required')),
    });


    const handleContinueClick = (newPassword) => {
        setSubmitDisabled(true);
        resetPassword(token, newPassword).then(function () {
            navigation.replace("Guest");
        }).catch(err => {
            setErrorMessage(err.response.data.error.message);
        }).finally(function () {
            setSubmitDisabled(false);
        });
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
                    <Text style={[styles.text, styles.headerText, styles.white]}>{t('reset_password')}</Text>
                </View>
                <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexOne, styles.br16]}>
                    <View style={[styles.defaultContainer, styles.defaultPadding, styles.bgLightGray, styles.br16, styles.w100]}>
                        <View style={[styles.w100, styles.flexOne, styles.defaultPaddingVertical]}>
                            <ErrorMessage condition={errorMessage} message={errorMessage} />
                            <Formik
                                initialValues={{ passwordInput: '', password2Input: '' }}
                                validationSchema={changePasswordSchema}
                                onSubmit={(values) => { handleContinueClick(values.passwordInput) }}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                                    <>
                                        <Text style={[styles.text, styles.inputText]}>{t('password')}</Text>
                                        <CustomTextInput
                                            value={values.passwordInput}
                                            onChangeText={handleChange('passwordInput')}
                                            onBlur={handleBlur('passwordInput')}
                                            placeholder={t('password')}
                                            error={touched.passwordInput && errors.passwordInput}
                                            secureTextEntry={true}
                                        />

                                        <Text style={[styles.text, styles.inputText]}>{t('confirm_password')}</Text>
                                        <CustomTextInput
                                            value={values.password2Input}
                                            onChangeText={handleChange('password2Input')}
                                            onBlur={handleBlur('password2Input')}
                                            placeholder={t('confirm_password')}
                                            error={touched.password2Input && errors.password2Input}
                                            secureTextEntry={true}
                                        />

                                        <Button
                                            style={[styles.continueBtn, styles.mt20]}
                                            text={t('reset_password')}
                                            bgColor={palette.primary}
                                            textColor={palette.white}
                                            onPress={handleSubmit}
                                            disabled={!isValid || submitDisabled}
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

export default ChangePasswordScreen;
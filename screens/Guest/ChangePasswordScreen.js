import React, { useState } from 'react';
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


const ChangePasswordScreen = ({ route, navigation }) => {
    const { token } = route.params;
    const isDarkMode = useColorScheme === 'dark';
    const [errorMessage, setErrorMessage] = useState(null);
    const { resetPassword } = useUserStore();

    const changePasswordSchema = Yup.object().shape({
        passwordInput: Yup.string().min(8, 'Your password should be at least 8 characters long').required('This field is required'),
        password2Input: Yup.string().min(8, 'Your password should be at least 8 characters long').oneOf([Yup.ref('passwordInput'), null], "Passwords don't match").required('This field is required'),
    });


    const handleContinueClick = (newPassword) => {
        resetPassword(token, newPassword).then(() => {
            navigation.replace("Guest");
        }).catch(err => {
            console.log(err);
            //setErrorMessage(err.response.data.error.message);
        });
    };


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
                    <Text style={[styles.headerText, styles.white]}>Reset Password</Text>
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
                                        <Text style={styles.inputText}>Password</Text>
                                        <CustomTextInput
                                            value={values.passwordInput}
                                            onChangeText={handleChange('passwordInput')}
                                            onBlur={handleBlur('passwordInput')}
                                            placeholder="Password"
                                            error={touched.passwordInput && errors.passwordInput}
                                            secureTextEntry={true}
                                        />

                                        <Text style={styles.inputText}>Confirm Password</Text>
                                        <CustomTextInput
                                            value={values.password2Input}
                                            onChangeText={handleChange('password2Input')}
                                            onBlur={handleBlur('password2Input')}
                                            placeholder="Confirm Password"
                                            error={touched.password2Input && errors.password2Input}
                                            secureTextEntry={true}
                                        />

                                        <Button
                                            style={[styles.continueBtn, styles.mt20]}
                                            text="Reset Password"
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

export default ChangePasswordScreen;
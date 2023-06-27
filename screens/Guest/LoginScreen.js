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
} from 'react-native';
import { styles, SERVER_URL, palette, isPhoneNumberValid } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as globalVars from '../../globalVars';
import * as accountAPI from '../../api/accountAPI';
import HeaderView from '../../components/HeaderView';
import axios from 'axios';
import { config } from '../../config';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../../components/ErrorMessage';


const LoginScreen = ({ route, navigation }) => {

  const isDarkMode = useColorScheme === 'dark';
  const [errorMessage, setErrorMessage] = useState(null);
  // const objForm = new Form();

  const handleContinueClick = (phoneNum, password) => {

    if (password.length < config.PASSWORD_MIN_LENGTH) {
      setPasswordError(true);
      returnAfterValidation = true;
    }

    accountAPI.login(phoneNum, password).then(
      () => {
        navigation.popToTop();
        navigation.replace("LoggedIn", {
          screen: 'TabScreen',
          params: {
            screen: 'Home',
          }
        });
      }).catch(err => {
        setErrorMessage(err.response.data.error.message);
      });
  };

  const phoneTextChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhone(numericValue);
  }

  const passwordTextChange = (text) => {
    setPassword(text);
  }

  const loginSchema = Yup.object().shape({
    phoneInput: Yup.string().matches(
      /^01[0-2,5]{1}[0-9]{8}$/,
      'Please enter a valid phone number in international format'
    )
      .required('This field is required'),
    passwordInput: Yup.string().min(0, 'Your password should be at least 8 characters long').required('This field is required'),
  });


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
          <Text style={[styles.headerText, styles.white]}>Sign In</Text>
        </View>
        <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexOne, styles.br16]}>
          <View style={[styles.defaultContainer, styles.defaultPadding, styles.bgLightGray, styles.br16, styles.w100]}>
            <View style={[styles.w100, styles.flexOne, styles.defaultPaddingVertical]}>
              <Text style={[styles.headerText, styles.black]}>Welcome Back</Text>
              <Text style={[styles.dark, styles.mt10, styles.font14, styles.normal]}>Hello there, sign in to continue!</Text>
              <ErrorMessage message={errorMessage} condition={errorMessage} />
              <Formik
                initialValues={{ phoneInput: '', passwordInput: '' }}
                validationSchema={loginSchema}
                onSubmit={(values) => { handleContinueClick(values.phoneInput, values.passwordInput) }}
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

                    <Text style={styles.inputText}>Password</Text>

                    <CustomTextInput
                      value={values.passwordInput}
                      onChangeText={handleChange('passwordInput')}
                      onBlur={handleBlur('passwordInput')}
                      placeholder="Enter your password"
                      secureTextEntry={true}
                      error={touched.passwordInput && errors.passwordInput}
                    />


                    <Button
                      style={[styles.continueBtn, styles.mt20]}
                      text="Sign in"
                      bgColor={palette.primary}
                      textColor={palette.white}
                      onPress={handleSubmit}
                      disabled={!isValid}
                    />
                  </>
                )}
              </Formik>


              <View style={[styles.justifyEnd, styles.alignCenter, styles.flexOne]}>
                <Text style={styles.light}>Don't have an account? <Text style={[styles.primary, styles.bold]}>Sign up</Text></Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

export default LoginScreen;
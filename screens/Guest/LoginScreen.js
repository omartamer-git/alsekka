import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useRef, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
  useColorScheme
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import ErrorMessage from '../../components/ErrorMessage';
import HeaderView from '../../components/HeaderView';
import { config } from '../../config';
import { palette, styles } from '../../helper';


const LoginScreen = ({ route, navigation }) => {

  const isDarkMode = useColorScheme === 'dark';
  const [errorMessage, setErrorMessage] = useState(null);
  const userStore = useUserStore();
  const formRef = useRef(null);
  // const objForm = new Form();

  const handleContinueClick = (phoneNum, password) => {

    if (password.length < config.PASSWORD_MIN_LENGTH) {
      setPasswordError(true);
      returnAfterValidation = true;
    }

    userStore.login(phoneNum, password).then(
      (data) => {
        userStore.getAvailableCards();
        userStore.getBankAccounts();
        userStore.getMobileWallets();
        
        if (data.verified) {
          navigation.popToTop();
          navigation.replace("LoggedIn", {
            screen: 'TabScreen',
            params: {
              screen: 'Home',
            }
          });
        } else {
          navigation.navigate('Otp',
            {
              uid: data.id,
              phone: phoneNum,
              onVerify: 'login'
            });
        }
      }).catch(err => {
        console.log(err);
        setErrorMessage(err.response.data.error.message);
      });
  };

  const loginSchema = Yup.object().shape({
    phoneInput: Yup.string().matches(
      /^01[0-2,5]{1}[0-9]{8}$/,
      'Please enter a valid phone number in international format'
    )
      .required('This field is required'),
    passwordInput: Yup.string().min(0, 'Your password should be at least 8 characters long').required('This field is required'),
  });

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

    useFocusEffect(onFocusEffect); // register callback to focus events    
}



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
                innerRef={formRef}
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

              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('Forgot Password', { phone: formRef.current.values.phoneInput });
                }}
                style={[styles.justifyCenter, styles.alignCenter, styles.w100]}>
                <Text style={[styles.textStart, styles.dark]}>Forgot your password?</Text>
              </TouchableWithoutFeedback>

              <View style={[styles.justifyEnd, styles.alignCenter, styles.flexOne]}>
                <TouchableWithoutFeedback onPress={() => {
                  navigation.navigate('Sign Up');
                }} style={[styles.justifyEnd, styles.alignCenter]}>
                  <Text style={[styles.dark, styles.textCenter]}>
                    Don't have an account?
                    <Text style={[styles.primary, styles.bold, styles.ml10]}> Sign up</Text>
                  </Text>
                </TouchableWithoutFeedback>

              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

export default LoginScreen;
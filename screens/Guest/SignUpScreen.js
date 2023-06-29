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
  TouchableOpacity
} from 'react-native';
import { styles, SERVER_URL, palette, rem } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import { ScrollView } from 'react-native-gesture-handler';
import { getVerified, setUserId } from '../../globalVars';
import * as accountAPI from '../../api/accountAPI';
import HeaderLip from '../../components/HeaderLip';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../../components/ErrorMessage';

const SignUpScreen = ({ route, navigation }) => {
  const [gender, setGender] = useState('MALE');

  const [phoneNumExists, setPhoneNumExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const isDarkMode = useColorScheme === 'dark';

  const handleContinueClick = (firstName, lastName, phoneNum, email, password) => {
    accountAPI.createAccount(firstName, lastName, phoneNum, email, password, gender).then((data) => {
      accountAPI.loadUserInfo().then(() => {
        if (getVerified()) {
          navigation.popToTop();
          navigation.replace("LoggedIn", {
            screen: 'TabScreen',
            params: {
              screen: 'Home',
            }
          });
        } else {
          navigation.navigate('Otp', { phone: phoneNum });
        }
      });
    }).catch(err => {
      setErrorMessage(err.response.data.error.message);
    });
  };

  const toggleGender = (e) => {
    if (gender == 'FEMALE') {
      setGender('MALE');
    } else {
      setGender('FEMALE');
    }
  }
  const signUpSchema = Yup.object().shape({
    phoneInput: Yup.string().matches(
      /^01[0-2,5]{1}[0-9]{8}$/,
      'Please enter a valid phone number in international format'
    )
      .required('This field is required'),
    passwordInput: Yup.string().min(8, 'Your password should be at least 8 characters long').required('This field is required'),
    emailInput: Yup.string().email('Please enter a valid email address').required('This field is required'),
    firstNameInput: Yup.string().min(2, 'First name is too short').max(20, 'First name is too long').required('This field is required'),
    lastNameInput: Yup.string().min(2, 'Last name is too short').max(20, 'Last name is too long').required('This field is required')
  });

  return (
    <View style={styles.backgroundStyle} >
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
      <SafeAreaView>
        <HeaderView navType="back" borderVisible={false} action={() => { navigation.goBack() }}>
          <View style={styles.localeWrapper}>
            <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
            <Text style={styles.locale}>EN</Text>
          </View>
        </HeaderView>
      </SafeAreaView>

      <ScrollView style={styles.wrapper} contentContainerStyle={[styles.flexGrow, { paddingBottom: 40 }]}>
        <View style={[styles.defaultPadding, styles.headerTextMargins]}>
          <Text style={[styles.headerText, styles.white]}>Sign Up</Text>
        </View>
        <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexOne, styles.br16]}>
          <View style={[styles.defaultContainer, styles.defaultPadding, styles.bgLightGray, styles.br16, styles.w100]}>
            <View style={[styles.flexOne, styles.w100, styles.defaultPaddingVertical]}>
              <Text style={[styles.headerText, styles.black]}>Let's get started!</Text>
              <Text style={[styles.dark, styles.mt10, styles.font14, styles.normal]}>Hello there, you'll need to create an account to continue!</Text>
              <ErrorMessage condition={errorMessage} message={errorMessage} />
              <Formik
                initialValues={{ phoneInput: '', passwordInput: '', emailInput: '', firstNameInput: '', lastNameInput: '' }}
                validationSchema={signUpSchema}
                onSubmit={(values) => { handleContinueClick(values.firstNameInput, values.lastNameInput, values.phoneInput, values.emailInput, values.passwordInput) }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                  <>
                    <View style={styles.flexRow}>
                      <View style={[styles.flexOne, styles.pr8]}>
                        <Text style={styles.inputText}>First Name</Text>
                        <CustomTextInput
                          value={values.firstNameInput}
                          onChangeText={handleChange('firstNameInput')}
                          onBlur={handleBlur('firstNameInput')}
                          error={touched.firstNameInput && errors.firstNameInput}
                          placeholder="First Name"
                        />
                      </View>

                      <View style={[styles.flexOne, styles.pl8]}>
                        <Text style={styles.inputText}>Last Name</Text>
                        <CustomTextInput
                          value={values.lastNameInput}
                          onChangeText={handleChange('lastNameInput')}
                          onBlur={handleBlur('lastNameInput')}
                          error={touched.lastNameInput && errors.lastNameInput}
                          placeholder="Last Name"
                        />
                      </View>

                    </View>


                    <Text style={styles.inputText}>Phone Number</Text>
                    <CustomTextInput
                      value={values.phoneInput}
                      onChangeText={handleChange('phoneInput')}
                      onBlur={handleBlur('phoneInput')}
                      error={touched.phoneInput && errors.phoneInput}
                      placeholder="Enter your phone number"
                    />

                    <Text style={styles.inputText}>
                      Email
                    </Text>
                    <CustomTextInput
                      value={values.emailInput}
                      onChangeText={handleChange('emailInput')}
                      placeholder="Enter your email address"
                      onBlur={handleBlur('emailInput')}
                      error={touched.emailInput && errors.emailInput}
                    />

                    <Text style={styles.inputText}>Password</Text>
                    <CustomTextInput
                      value={values.passwordInput}
                      onChangeText={handleChange('passwordInput')}
                      placeholder="Enter your password"
                      secureTextEntry={true}
                      onBlur={handleBlur('passwordInput')}
                      error={touched.passwordInput && errors.passwordInput}
                    />

                    <View style={[styles.flexRow, styles.w100, styles.mt20]}>
                      <TouchableOpacity style={[signupScreenStyles.genderButton, { backgroundColor: (gender === 'MALE') ? palette.primary : palette.white }]}
                        onPress={toggleGender}>
                        <Text style={[signupScreenStyles.genderText, { color: (gender === 'MALE') ? palette.white : palette.black }]}>Male</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[signupScreenStyles.genderButton, { backgroundColor: (gender === 'FEMALE') ? palette.primary : palette.white }]}
                        onPress={toggleGender}>
                        <Text style={[signupScreenStyles.genderText, { color: (gender === 'FEMALE') ? palette.white : palette.black }]}>Female</Text>
                      </TouchableOpacity>
                    </View>


                    <Button
                      style={[styles.continueBtn, styles.mt20]}
                      text="Create Account"
                      bgColor={palette.primary}
                      textColor={palette.white}
                      onPress={handleSubmit}
                      disabled={!isValid}
                    />
                  </>
                )}
              </Formik>


              <View style={[styles.justifyEnd, styles.alignCenter, styles.flexOne]}>
                <Text style={styles.light}>Already have an account? <Text style={[styles.primary, styles.bold]}>Sign up</Text></Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const signupScreenStyles = StyleSheet.create({
  genderButton: {
    ...styles.flexOne,
    ...styles.fullCenter,
    height: 48 * rem,
  },

  genderText: {
    ...styles.bold
  }
});

export default SignUpScreen;
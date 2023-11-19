import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
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
import { palette, rem, styles } from '../../helper';

const SignUpScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const [gender, setGender] = useState('MALE');

  const [phoneNumExists, setPhoneNumExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const userStore = useUserStore();

  const handleContinueClick = (firstName, lastName, phoneNum, email, password) => {
    setSubmitDisabled(true);
    phoneNum = "0" + phoneNum;

    navigation.navigate('Otp', {
      firstName: firstName,
      lastName: lastName,
      phone: phoneNum,
      email: email,
      password: password,
      gender: gender,
      onVerify: 'login'
    });

  };

  const toggleGender = (e) => {
    if (gender == 'FEMALE') {
      setGender('MALE');
    } else {
      setGender('FEMALE');
    }
  }
  const allowedEmailDomains = ['student.guc.edu.eg'];

  const emailValidationRegex = new RegExp(`@(${allowedEmailDomains.join('|')})$`);

  const signUpSchema = Yup.object().shape({
    phoneInput: Yup.string().matches(
      /^1[0-2,5]{1}[0-9]{8}$/,
      t('error_invalid_phone')
    )
      .required(t('error_required')),
    passwordInput: Yup.string().min(8, t('error_invalid_password')).required(t('error_required')),
    emailInput: Yup.string().email(t('error_invalid_email')).matches(emailValidationRegex, t('error_university_mail')).required(t('error_required')),
    firstNameInput: Yup.string().min(2, t('error_name_short')).max(20, t('error_name_long')).required(t('error_required')),
    lastNameInput: Yup.string().min(2, t('error_name_short')).max(20, t('error_name_long')).required(t('error_required'))
  });

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



  return (
    <View style={styles.backgroundStyle} >
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
          <Text style={[styles.headerText, styles.white]}>{t('sign_up')}</Text>
        </View>
        <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexOne, styles.br16]}>
          <View style={[styles.defaultContainer, styles.defaultPadding, styles.bgLightGray, styles.br16, styles.w100]}>
            <View style={[styles.flexOne, styles.w100, styles.defaultPaddingVertical]}>
              <Text style={[styles.headerText, styles.black]}>{t('get_started')}</Text>
              <Text style={[styles.dark, styles.mt10, styles.font14, styles.normal]}>{t('account_needed')}</Text>
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
                        <Text style={styles.inputText}>{t('first_name')}</Text>
                        <CustomTextInput
                          value={values.firstNameInput}
                          onChangeText={handleChange('firstNameInput')}
                          onBlur={handleBlur('firstNameInput')}
                          error={touched.firstNameInput && errors.firstNameInput}
                          placeholder={t('first_name')}
                        />
                      </View>

                      <View style={[styles.flexOne, styles.pl8]}>
                        <Text style={styles.inputText}>{t('last_name')}</Text>
                        <CustomTextInput
                          value={values.lastNameInput}
                          onChangeText={handleChange('lastNameInput')}
                          onBlur={handleBlur('lastNameInput')}
                          error={touched.lastNameInput && errors.lastNameInput}
                          placeholder={t('last_name')}
                        />
                      </View>

                    </View>


                    <Text style={styles.inputText}>{t('phone_number')}</Text>
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
                    />

                    <Text style={styles.inputText}>
                      {t('email')}
                    </Text>
                    <CustomTextInput
                      value={values.emailInput}
                      onChangeText={handleChange('emailInput')}
                      placeholder={t('enter_email')}
                      onBlur={handleBlur('emailInput')}
                      error={touched.emailInput && errors.emailInput}
                    />

                    <Text style={styles.inputText}>{t('password')}</Text>
                    <CustomTextInput
                      value={values.passwordInput}
                      onChangeText={handleChange('passwordInput')}
                      placeholder={t('enter_password')}
                      secureTextEntry={true}
                      onBlur={handleBlur('passwordInput')}
                      error={touched.passwordInput && errors.passwordInput}
                    />

                    <View style={[styles.flexRow, styles.w100, styles.mt20]}>
                      <TouchableOpacity style={[signupScreenStyles.genderButton, { backgroundColor: (gender === 'MALE') ? palette.primary : palette.white }]}
                        onPress={toggleGender}>
                        <Text style={[signupScreenStyles.genderText, { color: (gender === 'MALE') ? palette.white : palette.black }]}>{t('male')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[signupScreenStyles.genderButton, { backgroundColor: (gender === 'FEMALE') ? palette.primary : palette.white }]}
                        onPress={toggleGender}>
                        <Text style={[signupScreenStyles.genderText, { color: (gender === 'FEMALE') ? palette.white : palette.black }]}>{t('female')}</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.mt5, styles.smallText, styles.dark]}>
                      {t('by_continuing')} <Text style={styles.primary} onPress={() => { Linking.openURL('https://seaats.app/terms.pdf') }}>{t('terms')}</Text> {t('and')} <Text style={styles.primary} onPress={() => { Linking.openURL('https://seaats.app/privacy.pdf') }}>{t('privacy_policy')}</Text>.
                    </Text>


                    <Button
                      style={[styles.continueBtn, styles.mt20]}
                      text={t('create_account')}
                      bgColor={palette.primary}
                      textColor={palette.white}
                      onPress={handleSubmit}
                      disabled={!isValid || submitDisabled}
                    />
                  </>
                )}
              </Formik>


              <TouchableOpacity style={[styles.justifyEnd, styles.alignCenter, styles.flexOne]} onPress={() => navigation.navigate('Login')} activeOpacity={0.7}>
                <Text style={styles.dark}>{t('account_exists')} <Text style={[styles.primary, styles.bold]}>{t('sign_in')}</Text></Text>
              </TouchableOpacity>
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
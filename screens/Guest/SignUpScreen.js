import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { memo, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import HeaderView from '../../components/HeaderView';
import useAppManager from '../../context/appManager';
import { palette, rem, styles } from '../../helper';
import useErrorManager from '../../context/errorManager';

function SignUpScreen({ route, navigation }) {
  const { t } = useTranslation();
  const [gender, setGender] = useState('MALE');

  const [phoneNumExists, setPhoneNumExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { allowedEmails } = useAppManager();

  const userStore = useUserStore();
  const errorManager = useErrorManager();

  async function handleContinueClick(firstName, lastName, phoneNum, email, password) {
    setSubmitDisabled(true);
    phoneNum = "0" + phoneNum;

    const available = await userStore.accountAvailable(phoneNum, email);
    if (available.phone == false) {
      setSubmitDisabled(false);
      errorManager.setError(t('error_phone_in_use'));
      return;
    } else if (available.email == false) {
      errorManager.setError(t('error_email_in_use'));
      setSubmitDisabled(false);
      return;
    }

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

  function toggleGender(gender) {
    setGender(gender);
  }
  // const allowedEmailDomains = ['student.guc.edu.eg'];

  const emailValidationRegex = new RegExp(`@(${allowedEmails})$`);

  const signUpSchema = Yup.object().shape({
    phoneInput: Yup.string().matches(
      /^1[0-2,5]{1}[0-9]{8}$/,
      t('error_invalid_phone')
    )
      .required(t('error_required')),
    passwordInput: Yup.string().min(8, t('error_invalid_password')).required(t('error_required')),
    emailInput: Yup.string().email(t('error_invalid_email')).required(t('error_required')),
    firstNameInput: Yup.string().min(2, t('error_name_short')).max(20, t('error_name_long')).required(t('error_required')),
    lastNameInput: Yup.string().min(2, t('error_name_short')).max(20, t('error_name_long')).required(t('error_required'))
  });

  const onFocusEffect = useCallback(function () {
    // This should be run when screen gains focus - enable the module where it's needed
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    AvoidSoftInput.setEnabled(true);
    return function () {
      // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
      AvoidSoftInput.setEnabled(false);
    };
  }, []);

  useFocusEffect(onFocusEffect); // register callback to focus events    

  const refFirstName = useRef();
  const refLastName = useRef();
  const refPhone = useRef();
  const refEmail = useRef();
  const refPassword = useRef();

  return (
    <View style={styles.backgroundStyle} >
      <SafeAreaView style={[styles.AndroidSafeArea]}>
        <HeaderView navType="back" borderVisible={false} action={function () { navigation.goBack() }}>
          <View style={styles.localeWrapper}>
            <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
            <Text style={[styles.text, styles.locale]}>EN</Text>
          </View>
        </HeaderView>
      </SafeAreaView>

      <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.wrapper} contentContainerStyle={[styles.flexGrow, { paddingBottom: 40 }]}>
        <View style={[styles.defaultPadding, styles.headerTextMargins]}>
          <Text style={[styles.text, styles.headerText, styles.white]}>{t('sign_up')}</Text>
        </View>
        <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexOne, styles.br16]}>
          <View style={[styles.defaultContainer, styles.defaultPadding, styles.bgLightGray, styles.br16, styles.w100]}>
            <View style={[styles.flexOne, styles.w100, styles.defaultPaddingVertical]}>
              <Text style={[styles.text, styles.headerText, styles.black]}>{t('get_started')}</Text>
              <Text style={[styles.text, styles.dark, styles.mt10, styles.font14, styles.normal]}>{t('account_needed')}</Text>
              <Formik
                initialValues={{ phoneInput: '', passwordInput: '', emailInput: '', firstNameInput: '', lastNameInput: '' }}
                validationSchema={signUpSchema}
                onSubmit={(values) => { handleContinueClick(values.firstNameInput, values.lastNameInput, values.phoneInput, values.emailInput, values.passwordInput) }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                  <>
                    <View style={styles.flexRow}>
                      <View style={[styles.flexOne, styles.pr8]}>
                        <Text style={[styles.text, styles.inputText]}>{t('first_name')}</Text>
                        <CustomTextInput
                          value={values.firstNameInput}
                          onChangeText={handleChange('firstNameInput')}
                          onBlur={handleBlur('firstNameInput')}
                          error={touched.firstNameInput && errors.firstNameInput}
                          placeholder={t('first_name')}
                          returnKeyType={'next'}
                          blurOnSubmit={false}
                          onSubmitEditing={() => refLastName.current.focus()}
                        />
                      </View>

                      <View style={[styles.flexOne, styles.pl8]}>
                        <Text style={[styles.text, styles.inputText]}>{t('last_name')}</Text>
                        <CustomTextInput
                          value={values.lastNameInput}
                          onChangeText={handleChange('lastNameInput')}
                          onBlur={handleBlur('lastNameInput')}
                          error={touched.lastNameInput && errors.lastNameInput}
                          placeholder={t('last_name')}
                          blurOnSubmit={false}
                          returnKeyType={'next'}
                          inputRef={refLastName}
                          onSubmitEditing={() => refPhone.current.focus()}
                        />
                      </View>

                    </View>


                    <Text style={[styles.text, styles.inputText]}>{t('phone_number')}</Text>
                    <CustomTextInput
                      value={values.phoneInput}
                      prefix={"+20"}
                      overrideRTL
                      emojiLeft={"🇪🇬"}
                      onChangeText={(text) => {
                          handleChange('phoneInput')(text);
                      }}
                      prefix='+20'
                      emojiLeft={'🇪🇬'}
                      overrideRTL
                      onBlur={handleBlur('phoneInput')}
                      error={touched.phoneInput && errors.phoneInput}
                      placeholder={t('enter_phone')}
                      keyboardType="number-pad"
                      blurOnSubmit={false}
                      returnKeyType={'next'}
                      inputRef={refPhone}
                      onSubmitEditing={() => refEmail.current.focus()}
                    />

                    <Text style={[styles.text, styles.inputText]}>
                      {t('email')}
                    </Text>
                    <CustomTextInput
                      value={values.emailInput}
                      onChangeText={handleChange('emailInput')}
                      placeholder={t('enter_email')}
                      onBlur={handleBlur('emailInput')}
                      error={touched.emailInput && errors.emailInput}
                      autoCapitalize='none'
                      blurOnSubmit={false}
                      returnKeyType={'next'}
                      inputRef={refEmail}
                      onSubmitEditing={() => refPassword.current.focus()}
                    />

                    <Text style={[styles.text, styles.inputText]}>{t('password')}</Text>
                    <CustomTextInput
                      value={values.passwordInput}
                      onChangeText={handleChange('passwordInput')}
                      placeholder={t('enter_password')}
                      secureTextEntry={true}
                      onBlur={handleBlur('passwordInput')}
                      error={touched.passwordInput && errors.passwordInput}
                      blurOnSubmit={false}
                      textContentType={'newPassword'}
                      returnKeyType={'next'}
                      inputRef={refPassword}
                    />

                    <View style={[styles.flexRow, styles.w100, styles.mt20, styles.br8, styles.overflowHidden]}>
                      <TouchableOpacity activeOpacity={0.9} style={[signupScreenStyles.genderButton, { backgroundColor: (gender === 'MALE') ? palette.primary : palette.white }]}
                        onPress={() => toggleGender('MALE')}>
                        <Text style={[styles.text, signupScreenStyles.genderText, { color: (gender === 'MALE') ? palette.white : palette.black }]}>{t('male')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.9} style={[signupScreenStyles.genderButton, { backgroundColor: (gender === 'FEMALE') ? palette.primary : palette.white }]}
                        onPress={() => toggleGender('FEMALE')}>
                        <Text style={[styles.text, signupScreenStyles.genderText, { color: (gender === 'FEMALE') ? palette.white : palette.black }]}>{t('female')}</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.text, styles.mt5, styles.smallText, styles.dark]}>
                      {t('by_continuing')} <Text style={[styles.text, styles.primary]} onPress={function () { Linking.openURL('https://seaats.app/terms.html') }}>{t('terms')}</Text> {t('and')} <Text style={[styles.text, styles.primary]} onPress={function () { Linking.openURL('https://seaats.app/privacy.html') }}>{t('privacy_policy')}</Text>.
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
                <Text style={[styles.text, styles.dark]}>{t('account_exists')} <Text style={[styles.primary, styles.bold]}>{t('sign_in')}</Text></Text>
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

export default memo(SignUpScreen);
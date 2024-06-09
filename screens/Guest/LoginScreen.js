import { useFocusEffect } from "@react-navigation/native";
import { Formik } from "formik";
import React, { useCallback, useRef, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  AvoidSoftInput,
  AvoidSoftInputView,
} from "react-native-avoid-softinput";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Yup from "yup";
import useUserStore from "../../api/accountAPI";
import Button from "../../components/Button";
import CustomTextInput from "../../components/CustomTextInput";
import ErrorMessage from "../../components/ErrorMessage";
import HeaderView from "../../components/HeaderView";
// import { config } from "../../config";
import { palette, styles } from "../../helper";

function LoginScreen({ route, navigation }) {
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const userStore = useUserStore();
  const formRef = useRef(null);
  // const objForm = new Form();

  function handleContinueClick(phoneNum, password) {
    if (password.length < config.PASSWORD_MIN_LENGTH) {
      setPasswordError(true);
      returnAfterValidation = true;
    }

    phoneNum = "0" + phoneNum;
    // console.log("phone num");
    userStore
      .login(phoneNum, password)
      .then((data) => {
        console.log(data);
        setSubmitDisabled(true);
        userStore.getAvailableCards();
        userStore.getBankAccounts();
        userStore.getMobileWallets();

        if (!data.verified) {
          navigation.navigate("Otp", {
            uid: data.id,
            phone: phoneNum,
            onVerify: "login",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        // setErrorMessage(err.response.data.error.message);
      })
      .finally(function () {
        setSubmitDisabled(false);
      });
  }

  const loginSchema = Yup.object().shape({
    phoneInput: Yup.string()
      .matches(/^1[0-2,5]{1}[0-9]{8}$/, t("error_invalid_phone"))
      .required(t("error_required")),
    passwordInput: Yup.string()
      .min(0, t("error_password"))
      .required(t("error_required")),
  });

  const onFocusEffect = React.useCallback(function () {
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
      <SafeAreaView style={[styles.AndroidSafeArea]}>
        <HeaderView
          navType="back"
          borderVisible={false}
          action={function () {
            navigation.goBack();
          }}
        >
          <View style={styles.localeWrapper}>
            <MaterialIcons
              style={styles.icon}
              name="language"
              size={18}
              color="rgba(255,255,255,255)"
            />
            <Text style={[styles.text, styles.locale]}>EN</Text>
          </View>
        </HeaderView>
      </SafeAreaView>
      <View style={styles.wrapper}>
        <View style={[styles.defaultPadding, styles.headerTextMargins]}>
          <Text style={[styles.text, styles.headerText, styles.white]}>
            {t("sign_in")}
          </Text>
        </View>
        <SafeAreaView
          style={[styles.bgLightGray, styles.w100, styles.flexOne, styles.br16]}
        >
          <View
            style={[
              styles.defaultContainer,
              styles.defaultPadding,
              styles.bgLightGray,
              styles.br16,
              styles.w100,
            ]}
          >
            <View
              style={[
                styles.w100,
                styles.flexOne,
                styles.defaultPaddingVertical,
              ]}
            >
              <Text style={[styles.text, styles.headerText, styles.black]}>
                {t("welcome_back")}
              </Text>
              <Text
                style={[
                  styles.text,
                  styles.dark,
                  styles.mt10,
                  styles.font14,
                  styles.normal,
                ]}
              >
                {t("welcome_message")}
              </Text>
              {/* <ErrorMessage message={errorMessage} condition={errorMessage} /> */}
              <Formik
                initialValues={{ phoneInput: "", passwordInput: "" }}
                validationSchema={loginSchema}
                onSubmit={(values) => {
                  handleContinueClick(values.phoneInput, values.passwordInput);
                }}
                innerRef={formRef}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  isValid,
                  touched,
                }) => (
                  <>
                    <Text
                      style={[
                        styles.text,
                        styles.inputText,
                        { fontFamily: "GeneralSans-Bold" },
                        styles.bold,
                      ]}
                    >
                      {t("phone_number")}
                    </Text>
                    <CustomTextInput
                      value={values.phoneInput}
                      onChangeText={(text) => {
                        let sanitizedText = text.replace("+20", "").trim();
                        handleChange("phoneInput")(sanitizedText);
                      }}
                      onBlur={handleBlur("phoneInput")}
                      placeholder={t("enter_phone")}
                      error={touched.phoneInput && errors.phoneInput}
                      keyboardType="number-pad"
                      prefix='20'
                    />

                    <Text style={[styles.text, styles.inputText]}>
                      {t("password")}
                    </Text>
                    <CustomTextInput
                      value={values.passwordInput}
                      onChangeText={handleChange("passwordInput")}
                      onBlur={handleBlur("passwordInput")}
                      placeholder={t("enter_password")}
                      secureTextEntry={true}
                      textContentType={"oneTimeCode"}
                      error={touched.passwordInput && errors.passwordInput}
                    />

                    <Button
                      style={[styles.continueBtn, styles.mt20]}
                      text={t("sign_in")}
                      bgColor={palette.primary}
                      textColor={palette.white}
                      onPress={handleSubmit}
                      disabled={!isValid || submitDisabled}
                    />
                  </>
                )}
              </Formik>

              <TouchableWithoutFeedback
                onPress={function () {
                  navigation.navigate("Forgot Password", {
                    phone: formRef.current.values.phoneInput,
                  });
                }}
                style={[styles.justifyCenter, styles.alignCenter, styles.w100]}
              >
                <Text style={[styles.text, styles.textStart, styles.dark]}>
                  {t("forgot_password")}
                </Text>
              </TouchableWithoutFeedback>

              <View
                style={[styles.justifyEnd, styles.alignCenter, styles.flexOne]}
              >
                <TouchableWithoutFeedback
                  onPress={function () {
                    navigation.navigate("Sign Up");
                  }}
                  style={[styles.justifyEnd, styles.alignCenter]}
                >
                  <Text style={[styles.text, styles.dark, styles.textCenter]}>
                    {t("no_account")}
                    <Text
                      style={[
                        styles.text,
                        styles.primary,
                        styles.bold,
                        styles.ml10,
                      ]}
                    >
                      {" "}
                      {t("sign_up")}
                    </Text>
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

export default memo(LoginScreen);

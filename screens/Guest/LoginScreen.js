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
import { styles, SERVER_URL, palette } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as globalVars from '../../globalVars';
import * as accountAPI from '../../api/accountAPI';
import HeaderView from '../../components/HeaderView';
import axios from 'axios';


const LoginScreen = ({ route, navigation }) => {

  const [phoneNum, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const isDarkMode = useColorScheme === 'dark';

  const handleContinueClick = (e) => {

    accountAPI.login(phoneNum, password).then(
      () => {
        navigation.popToTop();
        navigation.replace("LoggedIn", {
          screen: 'Rides Home',
          params: {
            screen: 'Find a Ride',
          }
        });
      });
  };

  const phoneTextChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    setPhone(numericValue);
  }

  const passwordTextChange = (text) => {
    setPassword(text);
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

              <Text style={styles.inputText}>Phone Number</Text>
              <CustomTextInput
                value={phoneNum}
                onChangeText={phoneTextChange}
                selectTextOnFocus={false}
                editable={true}
                placeholder="Enter your phone number"
              />

              <Text style={styles.inputText}>Password</Text>

              <CustomTextInput
                value={password}
                onChangeText={passwordTextChange}
                selectTextOnFocus={false}
                editable={true}
                placeholder="Enter your password"
                secureTextEntry={true}
              />

              <Text style={[styles.primary, styles.mt20, styles.font14, styles.bold]}>Forgot your password?</Text>


              <Button
                style={[styles.continueBtn, styles.mt20]}
                text="Sign in"
                bgColor={palette.primary}
                textColor={palette.white}
                onPress={handleContinueClick}
              />

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
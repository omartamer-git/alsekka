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
import { setUserId } from '../../globalVars';
import * as accountAPI from '../../api/accountAPI';
import HeaderLip from '../../components/HeaderLip';

const SignUpScreen = ({ route, navigation }) => {
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('MALE');

  const isDarkMode = useColorScheme === 'dark';

  const handleContinueClick = (e) => {
    accountAPI.createAccount(firstName, lastName, phoneNum, email, password, gender).then((data) => {
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
    setPhoneNum(numericValue);
  }

  const onChangeEmail = (text) => {
    setEmail(text);
  }

  const passwordTextChange = (text) => {
    setPassword(text);
  }

  const firstNameChange = (text) => {
    setFirstName(text);
  }

  const lastNameChange = (text) => {
    setLastName(text);
  }

  const toggleGender = (e) => {
    if (gender == 'FEMALE') {
      setGender('MALE');
    } else {
      setGender('FEMALE');
    }
  }

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

              <View style={styles.flexRow}>
                <View style={[styles.flexOne, styles.pr8]}>
                  <Text style={styles.inputText}>First Name</Text>
                  <CustomTextInput
                    value={firstName}
                    onChangeText={firstNameChange}
                    selectTextOnFocus={false}
                    editable={true}
                    placeholder="First Name"
                  />
                </View>

                <View style={[styles.flexOne, styles.pl8]}>
                  <Text style={styles.inputText}>Last Name</Text>
                  <CustomTextInput
                    value={lastName}
                    onChangeText={lastNameChange}
                    selectTextOnFocus={false}
                    editable={true}
                    placeholder="Last Name"
                  />
                </View>

              </View>


              <Text style={styles.inputText}>Phone Number</Text>
              <CustomTextInput
                value={phoneNum}
                onChangeText={phoneTextChange}
                selectTextOnFocus={false}
                editable={true}
                placeholder="Enter your phone number"
              />

              <Text style={styles.inputText}>
                Email
              </Text>
              <CustomTextInput
                value={email}
                onChangeText={onChangeEmail}
                selectTextOnFocus={false}
                editable={true}
                placeholder="Enter your email address"
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

              <View style={[styles.flexRow, styles.w100, styles.mt20]}>
                <TouchableOpacity style={[signupScreenStyles.genderButton, { backgroundColor: (gender === 'MALE') ? palette.secondary : palette.white }]}
                  onPress={toggleGender}>
                  <Text style={[signupScreenStyles.genderText, { color: (gender === 'MALE') ? palette.white : palette.black }]}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[signupScreenStyles.genderButton, { backgroundColor: (gender === 'FEMALE') ? palette.secondary : palette.white }]}
                  onPress={toggleGender}>
                  <Text style={[signupScreenStyles.genderText, { color: (gender === 'FEMALE') ? palette.white : palette.black }]}>Female</Text>
                </TouchableOpacity>
              </View>


              <Button
                style={[styles.continueBtn, styles.mt20]}
                text="Create Account"
                bgColor={palette.secondary}
                textColor={palette.white}
                onPress={handleContinueClick}
              />

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
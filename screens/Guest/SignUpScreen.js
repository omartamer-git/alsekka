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
import { styles, SERVER_URL, palette } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import { ScrollView } from 'react-native-gesture-handler';
import { setUserId } from '../../globalVars';
import * as accountAPI from '../../api/accountAPI';

const SignUpScreen = ({ route, navigation }) => {
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(0);

  const isDarkMode = useColorScheme === 'dark';

  const handleContinueClick = (e) => {
    const url = SERVER_URL + `/createaccount?fname=${firstName}&lname=${lastName}&phone=${phoneNum}&email=${email}&password=${password}&gender=${gender}`;
    console.log(url);
    accountAPI.createAccount(firstName, lastName, phoneNum, email, gender).then((data) => {
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
    if (gender == 1) {
      setGender(0);
    } else {
      setGender(1);
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

      <ScrollView style={styles.wrapper} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[styles.defaultPadding, styles.headerTextMargins, { flexDirection: 'column' }]}>
          <Text style={[styles.headerText, styles.white]}>Sign Up</Text>
        </View>
        <SafeAreaView style={{ backgroundColor: palette.white, borderRadius: 10, width: '100%', flex: 1 }}>
          <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.white, borderRadius: 30, width: '100%' }]}>
            <View style={[{ width: '100%', flex: 1 }, styles.defaultPaddingVertical]}>
              <Text style={[styles.headerText, styles.black]}>Let's get started!</Text>
              <Text style={{ color: palette.light, marginTop: 10, fontSize: 15, fontWeight: '400' }}>Hello there, you'll need to create an account to continue!</Text>

              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.5, paddingRight: '2.5%' }}>
                  <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>First Name</Text>
                  <CustomTextInput
                    value={firstName}
                    onChangeText={firstNameChange}
                    selectTextOnFocus={false}
                    editable={true}
                    placeholder="First Name"
                  />
                </View>

                <View style={{ flex: 0.5, paddingLeft: '2.5%' }}>
                  <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Last Name</Text>
                  <CustomTextInput
                    value={lastName}
                    onChangeText={lastNameChange}
                    selectTextOnFocus={false}
                    editable={true}
                    placeholder="Last Name"
                  />
                </View>

              </View>


              <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Phone Number</Text>
              <CustomTextInput
                value={phoneNum}
                onChangeText={phoneTextChange}
                selectTextOnFocus={false}
                editable={true}
                placeholder="Enter your phone number"
              />

              <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>
                Email
              </Text>
              <CustomTextInput
                value={email}
                onChangeText={onChangeEmail}
                selectTextOnFocus={false}
                editable={true}
                placeholder="Enter your email address"
              />

              <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Password</Text>
              <CustomTextInput
                value={password}
                onChangeText={passwordTextChange}
                selectTextOnFocus={false}
                editable={true}
                placeholder="Enter your password"
                secureTextEntry={true}
              />

              <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: (gender == 0) ? palette.secondary : palette.inputbg, height: 48 }}
                  onPress={toggleGender}>
                  <Text style={{ color: (gender == 0) ? palette.white : palette.black, fontWeight: 'bold' }}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: (gender == 1) ? palette.secondary : palette.inputbg, height: 48 }}
                  onPress={toggleGender}>
                  <Text style={{ color: (gender == 1) ? palette.white : palette.black, fontWeight: 'bold' }}>Female</Text>
                </TouchableOpacity>
              </View>


              <Button
                style={[styles.continueBtn, { marginTop: 30 }]}
                text="Create Account"
                bgColor={palette.secondary}
                textColor={palette.white}
                onPress={handleContinueClick}
              />

              <View style={{ flexDirection: 'column-reverse', alignItems: 'center', flex: 1, marginTop: 10 }}>
                <Text style={{ color: palette.light }}>Already have an account? <Text style={{ color: palette.primary, fontWeight: '600' }}>Sign in</Text></Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>

  );
}

export default SignUpScreen;
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import HeaderView from '../../components/HeaderView';

const HomeScreen = ({ navigation }) => {
  const [phoneNumberText, setPhone] = useState('');
  const isDarkMode = useColorScheme === 'dark';



  const handleLoginClick = (e) => {
    navigation.navigate('Login');
  };
  const handleSignUpClick = (e) => {
    navigation.navigate('Sign Up');
  };

  return (
    <View style={styles.backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />

      <SafeAreaView style={styles.wrapper}>
        <HeaderView borderVisible={false}>
          <View style={styles.localeWrapper}>
            <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
            <Text style={styles.locale}>EN</Text>
          </View>
        </HeaderView>
        <View style={[styles.defaultContainer, styles.defaultPadding]}>
          <Image source={require('../../assets/homescreen_car.png')} style={styles.logo} />
          <View style={[styles.w100, styles.alignStart, styles.flexOne, styles.justifyCenter]}>
            <Text style={[styles.headerText, styles.homeScreenHeaderTextMargin, styles.white]}>Welcome</Text>

            <Text style={styles.subText}>Omar's Carpooling</Text>
            <Text style={[styles.subText, { fontWeight: 'bold' }]}>Ride together.. Save together</Text>

          </View>

          <Button
            text="Sign in with Google"
            bgColor={palette.white}
            textColor={palette.primary}
            icon="google"
            iconColor={palette.primary}
          />

          <Button
            style={styles.continueBtn}
            text="Create an account"
            bgColor={palette.primary}
            textColor={palette.white}
            borderColor={palette.white}
            onPress={handleSignUpClick}
          />

          <View style={styles.footer}>
            <Text style={styles.smallText} onPress={handleLoginClick}>Already have an account? <Text style={[styles.white, styles.bold]}>Sign in</Text></Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;
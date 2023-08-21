import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  useColorScheme
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from '../../components/Button';
import { palette, styles } from '../../helper';

import HeaderView from '../../components/HeaderView';
import { useTranslation } from 'react-i18next';

const HomeScreen = ({ navigation }) => {
  const [phoneNumberText, setPhone] = useState('');
  const isDarkMode = useColorScheme === 'dark';



  const handleLoginClick = (e) => {
    navigation.navigate('Login');
  };
  const handleSignUpClick = (e) => {
    navigation.navigate('Sign Up');
  };

  const {t} = useTranslation();

  return (
    <View style={styles.backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

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

            <Text style={styles.subText}>{t('seaats')}</Text>
            <Text style={[styles.subText, { fontWeight: 'bold' }]}>{t('seaats_slogan')}</Text>

          </View>

          <Button
            style={styles.continueBtn}
            text={t('create_account')}
            bgColor={palette.primary}
            textColor={palette.white}
            borderColor={palette.white}
            onPress={handleSignUpClick}
          />

          <View style={styles.footer}>
            <Text style={styles.smallText} onPress={handleLoginClick}>{t('account_exists')} <Text style={[styles.white, styles.bold]}>{t('sign_in')}</Text></Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;
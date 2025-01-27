import React, { useState } from 'react';
import {
  I18nManager,
  Image,
  SafeAreaView,
  Text,
  View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from '../../components/Button';
import { palette, rem, styles } from '../../helper';

import { useTranslation } from 'react-i18next';
import HeaderView from '../../components/HeaderView';

function HomeScreen({ navigation }) {
  const [phoneNumberText, setPhone] = useState('');

  function handleLoginClick(e) {
    navigation.navigate('Login');
  };
  function handleSignUpClick(e) {
    navigation.navigate('Sign Up');
  };

  const { t } = useTranslation();

  return (
    <View style={styles.backgroundStyle}>

      <SafeAreaView style={[styles.wrapper, styles.AndroidSafeArea]}>
        <HeaderView borderVisible={false}>
          <View style={styles.localeWrapper}>
            <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
            <Text style={[styles.text, styles.locale]}>EN</Text>
          </View>
        </HeaderView>
        <View style={[styles.defaultContainer, styles.defaultPadding]}>
          <View style={[styles.w100, styles.alignCenter, styles.flexOne, styles.justifyCenter]}>
            <Image source={require('../../assets/logo.png')} resizeMode='contain' style={{ width: '60%' }} />
            {/* <Text style={[styles.freeSans, styles.logoSpacing, {
              color: 'white',
              fontSize: 55 * rem,
            }]}>
              {t('seaats')}
            </Text> */}
            <Text style={[styles.text, { fontWeight: 'bold', color: 'white' }]}>{t('seaats_slogan')}</Text>
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
            <Text style={[styles.text, styles.smallText]} onPress={handleLoginClick}>{t('account_exists')} <Text style={[styles.text, styles.white, styles.bold]}>{t('sign_in')}</Text></Text>
          </View>
        </View>
      </SafeAreaView >
    </View >
  );
}

export default HomeScreen;
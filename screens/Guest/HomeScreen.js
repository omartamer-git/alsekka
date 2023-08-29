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

const HomeScreen = ({ navigation }) => {
  const [phoneNumberText, setPhone] = useState('');



  const handleLoginClick = (e) => {
    navigation.navigate('Login');
  };
  const handleSignUpClick = (e) => {
    navigation.navigate('Sign Up');
  };

  const { t } = useTranslation();

  return (
    <View style={styles.backgroundStyle}>

      <SafeAreaView style={styles.wrapper}>
        <HeaderView borderVisible={false}>
          <View style={styles.localeWrapper}>
            <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
            <Text style={styles.locale}>EN</Text>
          </View>
        </HeaderView>
        <View style={[styles.defaultContainer, styles.defaultPadding]}>
          <Image source={require('../../assets/homescreen_car.png')} style={styles.logo} />
          <View style={[styles.w100, styles.alignCenter, styles.flexOne, styles.justifyCenter]}>
            <Text style={[{
              ...(I18nManager.isRTL
                ? {
                  ...styles.freeSansArabic
                }
                : {
                  ...styles.freeSans,
                  letterSpacing: -0.060 * 55 * rem
                }
              ),
              color: 'white',
              fontSize: 55 * rem,
            }]}>
              {t('seaats')}
            </Text>
            <Text style={[{ fontWeight: 'bold', color: 'white' }]}>{t('seaats_slogan')}</Text>
          </View>

          <Button
            text={t('google_signin')}
            disabled={true}
            bgColor={palette.white}
            textColor={palette.primary}
            icon="google"
            iconColor={palette.primary}
          />

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
      </SafeAreaView >
    </View >
  );
}

export default HomeScreen;
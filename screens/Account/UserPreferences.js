import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../ScreenWrapper';
import { styles, palette } from '../../helper';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import RadioButton from '../../components/RadioButton';
import Button from '../../components/Button';
import useAxiosManager from '../../context/axiosManager';
import useUserStore from '../../api/accountAPI';


const UserPreferences = ({ route, navigation }) => {
  const {userId} = route.params;
  const { authAxios } = useAxiosManager();
  const { t } = useTranslation();
  const preferences = useUserStore(state => state.preferences);
  const setPreferences = useUserStore(state => state.setPreferences);
  console.log("initial values here", preferences)


  
  
  const handleSavePreferences = async () => {
    try {
      await authAxios.post(`/v1/preferences/${userId}`, preferences);
      navigation.navigate('Account Home');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };
  
  const handlePreferenceChange = (key, value) => {
    setPreferences({ ...preferences, [key]: value });
  };
  
  useEffect(() => {
    (async () => {
      try {
        console.log('user id here:', userId);
        const response = await authAxios.get(`/v1/preferences/${userId}`);
        const {chattiness, rest_stop, music, smoking} = response.data;
        console.log('api responded with', response.data);
        setPreferences({
          chattiness,
          rest_stop,
          music,
          smoking
        });
      } catch (error) {
        console.log('Error fetching preferences:', error);
      }
    })()
  }, []);

  return (
    <ScreenWrapper screenName={t('preferences')} navType='back' navAction={() => navigation.goBack()}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.mh15, styles.pv16]}>
          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>{t('chattiness.topic')}</Text>
            <RadioButton
              iconName='chat'
              value={"CHATTY"}
              displayText={t('chattiness.CHATTY')}
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
            <RadioButton
              iconName='chat-bubble'
              value="QUIET"
              displayText={t('chattiness.QUIET')}
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
            <RadioButton
              iconName='textsms'
              value="FLEXIBLE"
              displayText={t('chattiness.FLEXIBLE')}
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>{t('rest_stop.topic')}</Text>
            <RadioButton
              iconName='multiple-stop'
              value="FREQUENT"
              displayText={t('rest_stop.FREQUENT')}
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
            <RadioButton
              iconName='airline-stops'
              value="WHEN_NECESSARY"
              displayText={t('rest_stop.WHEN_NECESSARY')}
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
            <RadioButton
              iconName='location-pin'
              value="DONT_MIND"
              displayText={t('rest_stop.DONT_MIND')}
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>{t('music.topic')}</Text>
            <RadioButton
              iconName='music-note'
              value="LIKE_MUSIC"
              displayText={t('music.LIKE_MUSIC')}
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
            <RadioButton
              iconName='music-off'
              value="NO_MUSIC"
              displayText={t('music.NO_MUSIC')}
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
            <RadioButton
              iconName='music-note'
              value="FLEXIBLE"
              displayText={t('music.FLEXIBLE')}
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>{t('smoking.topic')}</Text>
            <RadioButton
              iconName='smoking-rooms'
              value="SMOKING"
              displayText={t('smoking.SMOKING')}
              selectedValue={preferences.smoking}
              onSelect={(value) => handlePreferenceChange('smoking', value)}
            />
            <RadioButton
              iconName='smoke-free'
              value="SMOKE_FREE"
              displayText={t('smoking.SMOKE_FREE')}
              selectedValue={preferences.smoking}
              onSelect={(value) => handlePreferenceChange('smoking', value)}
            />
            <RadioButton
              iconName='smoking-rooms'
              value="CIGARETTE_BREAKS"
              displayText={t('smoking.CIGARETTE_BREAKS')}
              selectedValue={preferences.smoking}
              onSelect={(value) => handlePreferenceChange('smoking', value)}
            />
          </View>
          <Button text={t('save_preferences')} bgColor={palette.accent} textColor={palette.white} onPress={handleSavePreferences} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const buttonStyles = StyleSheet.create({
  preference: {
    ...styles.mb5,
    ...styles.mh5
  },
  label: {
    ...styles.text,
    ...styles.headerText2,
    ...styles.font24,
    ...styles.mb10,
    color: palette.dark
  },
});

export default UserPreferences;
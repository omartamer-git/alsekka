import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../ScreenWrapper';
import { styles, palette } from '../../helper';
import { useTranslation } from 'react-i18next';
import RadioButton from '../../components/RadioButton';
import Button from '../../components/Button';
import useAxiosManager from '../../context/axiosManager';
import useUserStore from '../../api/accountAPI';


const chattinessOptions = {
  "CHATTY": "I prefer talking during the ride",
  "QUIET": "I prefer a quiet ride",
  "FLEXIBLE": "I am flexible about talking"
}

const rest_stopOptions = {
  "FREQUENT": "I prefer frequent stops during the ride",
  "WHEN_NECESSARY": "I prefer rest stops only when necessary",
  "DONT_MIND": "I don't mind as long as we get there!" 
}

const musicOptions = {

  "LIKE_MUSIC": "I prefer music during the ride",
  "NO_MUSIC": "I prefer no music during the ride",
  "FLEXIBLE": "I am flexible about music"
}

const smokingOptions = {
  "SMOKE_FREE": "I prefer a smoke-free ride",
  "SMOKING": "I prefer smoking during the ride",
  "CIGARETTE_BREAKS": "Cigarette breaks outside the car are ok",
}

const UserPreferences = ({ route, navigation }) => {
  const {userId} = route.params;
  const { authAxios } = useAxiosManager();
  const preferences = useUserStore(state => state.preferences);
  console.log("initial values here", preferences)
  const setPreferences = useUserStore(state => state.setPreferences);

  const { t } = useTranslation();

  
  
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
            <Text style={buttonStyles.label}>Chattiness</Text>
            <RadioButton
              iconName='chat'
              value={"CHATTY"}
              displayText={chattinessOptions['CHATTY']}
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
            <RadioButton
              iconName='chat-bubble'
              value="QUIET"
              displayText={chattinessOptions['QUIET']}
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
            <RadioButton
              iconName='textsms'
              value="FLEXIBLE"
              displayText={chattinessOptions['FLEXIBLE']}
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>Rest-Stop</Text>
            <RadioButton
              iconName='multiple-stop'
              value="FREQUENT"
              displayText={rest_stopOptions['FREQUENT']}
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
            <RadioButton
              iconName='airline-stops'
              value="WHEN_NECESSARY"
              displayText={rest_stopOptions['WHEN_NECESSARY']}
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
            <RadioButton
              iconName='location-pin'
              value="DONT_MIND"
              displayText={rest_stopOptions['DONT_MIND']}
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>Music</Text>
            <RadioButton
              iconName='music-note'
              value="LIKE_MUSIC"
              displayText={musicOptions['LIKE_MUSIC']}
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
            <RadioButton
              iconName='music-off'
              value="NO_MUSIC"
              displayText={musicOptions['NO_MUSIC']}
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
            <RadioButton
              iconName='music-note'
              value="FLEXIBLE"
              displayText={musicOptions['FLEXIBLE']}
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>Smoking</Text>
            <RadioButton
              iconName='smoking-rooms'
              value="SMOKING"
              displayText={smokingOptions['SMOKING']}
              selectedValue={preferences.smoking}
              onSelect={(value) => handlePreferenceChange('smoking', value)}
            />
            <RadioButton
              iconName='smoke-free'
              value="SMOKE_FREE"
              displayText={smokingOptions['SMOKE_FREE']}
              selectedValue={preferences.smoking}
              onSelect={(value) => handlePreferenceChange('smoking', value)}
            />
            <RadioButton
              iconName='smoking-rooms'
              value="CIGARETTE_BREAKS"
              displayText={smokingOptions['CIGARETTE_BREAKS']}
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
    ...styles.mb5
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
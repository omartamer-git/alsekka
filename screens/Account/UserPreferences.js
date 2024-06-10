import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import ScreenWrapper from '../ScreenWrapper';
import { styles, palette } from '../../helper';
import { useTranslation } from 'react-i18next';
import RadioButton from '../../components/RadioButton';
import Button from '../../components/Button';

const UserPreferences = ({ route, navigation }) => {
  const {userId} = route.params;
   
  const [preferences, setPreferences] = useState({
    smoking: "I prefer a smoke-free ride",
    chattiness: "I prefer a quiet ride",
    music: 'I prefer no music during the ride',
    rest_stop: 'I prefer rest stops only when necessary'
  });

  const { t } = useTranslation();
  // useEffect(() => {
  //   fetchPreferences();
  // }, []);

  // const fetchPreferences = async () => {
  //   try {
  //     const response = await fetch(`/api/preferences/${userId}`);
  //     const data = await response.json();
  //     setPreferences(data);
  //   } catch (error) {
  //     console.error('Error fetching preferences:', error);
  //   }
  // };

  const handleSavePreferences = async () => {
    try {
      await fetch(`/api/preferences/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences({ ...preferences, [key]: value });
  };

  return (
    <ScreenWrapper screenName={t('preferences')} navType='back' navAction={() => navigation.goBack()}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.mh15, styles.pv16]}>
          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>Chattiness</Text>
            <RadioButton
              iconName='chat'
              value="I prefer talking during the ride"
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
            <RadioButton
              iconName='chat-bubble'
              value="I prefer a quiet ride"
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
            <RadioButton
              iconName='textsms'
              value="I am flexible about talking"
              selectedValue={preferences.chattiness}
              onSelect={(value) => handlePreferenceChange('chattiness', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>Rest-Stop</Text>
            <RadioButton
              iconName='multiple-stop'
              value="I prefer frequent stops during the ride"
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
            <RadioButton
              iconName='airline-stops'
              value="I prefer rest stops only when necessary"
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
            <RadioButton
              iconName='location-pin'
              value="I don't mind as long as we get there!"
              selectedValue={preferences.rest_stop}
              onSelect={(value) => handlePreferenceChange('rest_stop', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>Music</Text>
            <RadioButton
              iconName='music-note'
              value="I prefer music during the ride"
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
            <RadioButton
              iconName='music-off'
              value="I prefer no music during the ride"
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
            <RadioButton
              iconName='music-note'
              value="I am flexible about music"
              selectedValue={preferences.music}
              onSelect={(value) => handlePreferenceChange('music', value)}
            />
          </View>

          <View style={buttonStyles.preference}>
            <Text style={buttonStyles.label}>Smoking</Text>
            <RadioButton
              iconName='smoking-rooms'
              value="I prefer smoking during the ride"
              selectedValue={preferences.smoking}
              onSelect={(value) => handlePreferenceChange('smoking', value)}
            />
            <RadioButton
              iconName='smoke-free'
              value="I prefer a smoke-free ride"
              selectedValue={preferences.smoking}
              onSelect={(value) => handlePreferenceChange('smoking', value)}
            />
            <RadioButton
              iconName='smoking-rooms'
              value="Cigarette breaks outside the car are ok"
              selectedValue={preferences.smoking}
              onSelect={(value) => handlePreferenceChange('smoking', value)}
            />
          </View>
          <Button text="Save Preferences" bgColor={palette.accent} textColor={palette.white} onPress={handleSavePreferences} />
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

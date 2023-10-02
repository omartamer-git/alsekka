import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import DatePicker from 'react-native-date-picker';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import AutoComplete from '../../components/AutoComplete';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import { containerStyle, customMapStyle, getDateSQL, mapContainerStyle, mapPadding, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import MapViewDirections from 'react-native-maps-directions';


const MapScreen = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const loc = route.params?.loc;
  const [location, setLocation] = useState(null);
  const [markerFrom, setMarkerFrom] = useState(null);
  const [markerTo, setMarkerTo] = useState(null);
  const mapViewRef = useRef(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [textFrom, setTextFrom] = useState('');
  const [textTo, setTextTo] = useState('');

  // const [timePickerOpen, setTimePickerOpen] = useState(false);
  // const [time, setTime] = useState(new Date());
  const [genderChoice, setGenderChoice] = useState('ANY');
  const { gender } = useUserStore();

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = Geolocation.requestAuthorization();
      return true;
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
    }

    return false;
  };


  useEffect(() => {
    const result = requestLocationPermission();
    result.then((res) => {
      console.log(res);
      if (res) {
        Geolocation.getCurrentPosition(
          info => {
            setLocation({
              latitude: info.coords.latitude,
              longitude: info.coords.longitude
            });
            setMarkerFrom(
              {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude
              }
            );
            setTextFrom(t("current_location"));
            fromRef.current.setCompletionText(t("current_location"))
          }
        );
      }
    });
  }, []);

  const [markerUpdateCount, setMarkerUpdateCount] = useState(0);

  useEffect(() => {
    setMarkerUpdateCount(prevCount => prevCount + 1);
  }, [markerFrom, markerTo]);

  const swapDestinations = () => {
    const markerFrom_old = markerFrom;
    const textFrom_old = textFrom;

    setTextFrom(textTo);
    setMarkerFrom(markerTo);
    fromRef.current.setCompletionText(textTo);

    setTextTo(textFrom_old);
    setMarkerTo(markerFrom_old);
    toRef.current.setCompletionText(textFrom_old);

  }

  const adjustMarkers = () => {
    if (markerFrom && markerTo) {
      mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    } else if (markerFrom) {
      mapViewRef.current.fitToSuppliedMarkers(["from"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    } else if (markerTo) {
      mapViewRef.current.fitToSuppliedMarkers(["to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    } else {
      Geolocation.getCurrentPosition(
        info => {
          setLocation({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude
          });
        }
      );
    }
  }

  const setLocationFrom = (loc, text) => {
    setTextFrom(text);
    setMarkerFrom({ latitude: loc.lat, longitude: loc.lng });
    adjustMarkers();
  }

  const setLocationTo = (loc, text) => {
    setTextTo(text);
    setMarkerTo({ latitude: loc.lat, longitude: loc.lng });
    adjustMarkers();
  }

  const goFindRides = (e) => {
    if (markerFrom && markerTo) {
      navigation.navigate("Choose a Ride", { fromLat: markerFrom.latitude, fromLng: markerFrom.longitude, toLat: markerTo.latitude, toLng: markerTo.longitude, date: getDateSQL(date), textFrom: textFrom, textTo: textTo, genderChoice: genderChoice });
    }
  }


  if (Platform.OS === 'ios') {
    const onFocusEffect = useCallback(() => {
      // This should be run when screen gains focus - enable the module where it's needed
      AvoidSoftInput.setShouldMimicIOSBehavior(true);
      AvoidSoftInput.setEnabled(true);
      return () => {
        // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
        AvoidSoftInput.setEnabled(false);
        AvoidSoftInput.setShouldMimicIOSBehavior(false);
      };
    }, []);

    // useFocusEffect(onFocusEffect); // register callback to focus events    
  }


  const { t } = useTranslation();


  return (
    <ScreenWrapper screenName={t('search_rides')}>
      <ScrollView style={mapContainerStyle} contentContainerStyle={styles.flexGrow}>
        <MapView
          style={[styles.mapStyle]}
          showsUserLocation={true}
          region={location}
          provider={PROVIDER_GOOGLE}
          ref={mapViewRef}
          customMapStyle={customMapStyle}
          mapPadding={mapPadding}
          showsMyLocationButton
          maxZoomLevel={18}
          key={"map" + markerUpdateCount}
        >
          {markerFrom &&
            <Marker key={"mrkFrom" + markerUpdateCount} identifier="from" onLayout={adjustMarkers} coordinate={markerFrom} pinColor="blue">
              <Image
                source={require('../../assets/PickUp.png')}
                style={{ height: 35, width: 35 }}
              />
            </Marker>
          }
          {markerTo &&
            <Marker key={"mrkTo" + markerUpdateCount} identifier="to" onLayout={adjustMarkers} coordinate={markerTo}>
              <Image
                source={require('../../assets/Destination.png')}
                style={{ height: 35, width: 35 }}
              />
            </Marker>
          }
        </MapView>

        <View style={[containerStyle, styles.flexOne]}>

          <View style={mapScreenStyles.autoCompletePair}>
            <AutoComplete ref={fromRef} key="autoCompleteFrom" type="my-location" placeholder={t('from')} handleLocationSelect={setLocationFrom} inputStyles={[mapScreenStyles.autoCompleteStyles, mapScreenStyles.autoCompleteTop]} />
            <AutoComplete ref={toRef} key="autoCompleteTo" type="place" placeholder={t('to')} handleLocationSelect={setLocationTo} inputStyles={[mapScreenStyles.autoCompleteStyles, mapScreenStyles.autoCompleteBottom]} />
            <TouchableOpacity activeOpacity={0.8} onPress={swapDestinations} style={[styles.positionAbsolute, styles.alignCenter, styles.justifyCenter, styles.bgWhite, styles.borderSecondary, { top: 24 * rem, right: 5 * rem, height: 48 * rem, width: 48 * rem, borderRadius: 24 * rem, shadowColor: palette.black, shadowRadius: 12 * rem, shadowOpacity: 0.2 }]}>
              <MaterialIcons name="swap-vert" size={22} color={palette.primary} />
            </TouchableOpacity>
          </View>

          <DatePicker
            modal
            mode="datetime"
            minimumDate={new Date()}
            minuteInterval={30}
            open={datePickerOpen}
            date={date}
            onConfirm={(date) => {
              setDatePickerOpen(false)
              setDate(date)
            }}
            onCancel={() => {
              setDatePickerOpen(false)
            }}
          />

          <Text style={styles.inputText}>{t('date')} & {t('time')}</Text>

          <CustomTextInput
            placeholder={t('date')}
            value={(function () {
              const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
              const months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ];

              const dayOfWeek = daysOfWeek[date.getDay()];
              const day = date.getDate();
              const month = months[date.getMonth()];
              const hours = date.getHours();
              let minutes = date.getMinutes();
              minutes = minutes < 10 ? '0' + minutes : minutes;
              const period = hours >= 12 ? 'PM' : 'AM';
              const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

              const formattedDate = `${dayOfWeek} ${day} ${month} ${formattedHours}:${minutes}${period}`;

              return formattedDate;
            })()}
            onPressIn={() => {
              setDatePickerOpen(true);
            }}
            iconRight="date-range"
            editable={false}
          />

          <Text style={styles.inputText}>
            {t('gender_to_carpool')}
          </Text>

          <View style={[styles.flexRow, styles.w100, styles.mv10]}>
            {
              gender === "FEMALE" &&
              <TouchableOpacity onPress={() => { setGenderChoice('FEMALE') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'FEMALE' ? palette.primary : palette.dark }]}>
                <Text style={mapScreenStyles.genderText}>{t('female_only')}</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => { setGenderChoice('ANY') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'ANY' ? palette.primary : palette.dark }]}>
              <Text style={mapScreenStyles.genderText}>{t('any')}</Text>
            </TouchableOpacity>
            {
              gender === "MALE" &&
              <TouchableOpacity onPress={() => { setGenderChoice('MALE') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'MALE' ? palette.primary : palette.dark }]}>
                <Text style={mapScreenStyles.genderText}>{t('male_only')}</Text>
              </TouchableOpacity>
            }
          </View>

          <View style={styles.flexOne} />

          <Button
            text={t('search')}
            bgColor={palette.primary}
            textColor={palette.white}
            onPress={goFindRides}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>

  );
}

const mapScreenStyles = StyleSheet.create({
  autoCompletePair: {
    ...styles.w100,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 * rem },
    shadowOpacity: 0.2, shadowRadius: 4,
    position: 'relative',
    marginTop: -64 * rem,
    zIndex: 6
  },

  autoCompleteStyles: {
    marginTop: 0,
    marginBottom: 0,
    borderColor: palette.light,
    backgroundColor: palette.white
  },

  autoCompleteTop: {
    borderBottomWidth: 0.5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  autoCompleteBottom: {
    borderTopWidth: 0.5,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },

  genderButton: {
    ...styles.flexOne,
    ...styles.fullCenter,
    height: 48 * rem,
  },

  genderText: {
    ...styles.white,
    ...styles.bold
  }
});

export default MapScreen;
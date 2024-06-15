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
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import AutoComplete from '../../components/AutoComplete';
import Button from '../../components/Button';
import CustomDatePicker from '../../components/DatePicker';
import useAppManager from '../../context/appManager';
import { containerStyle, customMapStyle, getDateSQL, mapContainerStyle, mapPadding, palette, rem, styles } from '../../helper';
import { getDeviceLocation } from '../../util/location';
import ScreenWrapper from '../ScreenWrapper';
import { Triangle } from '../../components/Triangle';
const geolib = require('geolib');


function MapScreen({ route, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const loc = route.params?.loc;
  const [location, setLocation] = useState({
    latitude: 30.0444,
    longitude: 31.2357,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02
  });
  const [markerFrom, setMarkerFrom] = useState(null);
  const [markerTo, setMarkerTo] = useState(null);
  const mapViewRef = useRef(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [textFrom, setTextFrom] = useState('');
  const [textTo, setTextTo] = useState('');
  const { cities } = useAppManager();
  const listCities = Object.keys(cities);
  const [citiesFrom, setCitiesFrom] = useState(listCities);
  const [citiesTo, setCitiesTo] = useState(listCities);

  // const [timePickerOpen, setTimePickerOpen] = useState(false);
  // const [time, setTime] = useState(new Date());
  const [genderChoice, setGenderChoice] = useState('ANY');
  const { gender } = useUserStore();


  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    getDeviceLocation().then(result => {
      if (result) {
        // setLocation(result);
        setLocation(loc => ({ ...loc, ...result }));
        setMarkerFrom(result);
        setTextFrom(t("current_location"));
        fromRef.current.setCompletionText(t("current_location"));
        for (const c of listCities) {
          const isWithinRadius = geolib.isPointWithinRadius(result, { latitude: cities[c].latitude, longitude: cities[c].longitude }, cities[c].radius);
          if (isWithinRadius) {
            setCitiesTo(
              listCities.filter(ct => ct != c)
            );
            break;
          }
        }
      }
    })
  }, []);

  const [markerUpdateCount, setMarkerUpdateCount] = useState(0);

  useEffect(function () {
    setMarkerUpdateCount(prevCount => prevCount + 1);
  }, [markerFrom, markerTo]);

  const swapDestinations = function () {
    const markerFrom_old = markerFrom;
    const textFrom_old = textFrom;

    setTextFrom(textTo);
    setMarkerFrom(markerTo);
    fromRef.current.setCompletionText(textTo);

    setTextTo(textFrom_old);
    setMarkerTo(markerFrom_old);
    toRef.current.setCompletionText(textFrom_old);

  }

  const adjustMarkers = function () {
    if (markerFrom && markerTo) {
      mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    } else if (markerFrom) {
      mapViewRef.current.fitToSuppliedMarkers(["from"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    } else if (markerTo) {
      mapViewRef.current.fitToSuppliedMarkers(["to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    } else {
      getDeviceLocation().then(result => {
        if (result) {
          // setLocation(result);
          setLocation(loc => ({ ...loc, ...result }));
        }
      })
    }
  }

  function setLocationFrom(loc, text, _, city) {
    setTextFrom(text);
    setMarkerFrom({ latitude: loc.lat, longitude: loc.lng });
    adjustMarkers();
    setCitiesTo(listCities.filter(c => c != city));
  }

  function setLocationTo(loc, text, _, city) {
    setTextTo(text);
    setMarkerTo({ latitude: loc.lat, longitude: loc.lng });
    adjustMarkers();
    setCitiesFrom(listCities.filter(c => c != city));
  }

  function cancelLocationFrom(city) {
    const oldCitiesTo = citiesTo;

    if (city && !oldCitiesTo.includes(city)) {
      setCitiesTo([...oldCitiesTo, city])
    }
  }

  function cancelLocationTo(city) {
    const oldCitiesFrom = citiesFrom;

    if (city && !oldCitiesFrom.includes(city)) {
      setCitiesFrom([...oldCitiesFrom, city])
    }
  }


  function goFindRides(e) {
    if (markerFrom && markerTo) {
      const today = new Date();
      let freshDate;
      if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        freshDate = today;
      } else {
        date.setHours(0, 0, 0, 0);
        freshDate = date;
      }

      navigation.navigate("Choose a Ride", { fromLat: markerFrom.latitude, fromLng: markerFrom.longitude, toLat: markerTo.latitude, toLng: markerTo.longitude, date: getDateSQL(freshDate), textFrom: textFrom, textTo: textTo, genderChoice: genderChoice });
    }
  }


  const onFocusEffect = useCallback(function () {
    // This should be run when screen gains focus - enable the module where it's needed
    AvoidSoftInput.setEnabled(true);
    return function () {
      // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
      AvoidSoftInput.setEnabled(false);
    };
  }, []);

  useFocusEffect(onFocusEffect); // register callback to focus events    


  const { t } = useTranslation();


  return (
    <ScreenWrapper screenName={t('search_rides')}>
      <ScrollView keyboardShouldPersistTaps={'handled'} style={mapContainerStyle} contentContainerStyle={styles.flexGrow}>
        <MapView
          style={[styles.mapStyle]}
          showsUserLocation={true}
          region={{
            ...location,
            latitudeDelta: 0.0922, // Adjust as needed
            longitudeDelta: 0.0421, // Adjust as needed
          }}
          provider={PROVIDER_GOOGLE}
          ref={mapViewRef}
          customMapStyle={customMapStyle}
          mapPadding={mapPadding}
          showsMyLocationButton
          maxZoomLevel={18}
          key={"map" + markerUpdateCount}
        >
          {markerFrom &&
            <>
              <Marker key={"mrkFrom" + markerUpdateCount} identifier="from" onLayout={adjustMarkers} coordinate={markerFrom} pinColor="blue">
                <View style={[styles.fullCenter]}>
                  <View style={[styles.bgSecondary, styles.p8, styles.br16]}>
                    <Text style={[styles.white, styles.font12]}>{t('pick_up')}</Text>
                  </View>
                  <Triangle style={{ transform: [{ rotate: "180deg" }] }} />
                </View>
              </Marker>
            </>
          }
          {markerTo &&
            <Marker key={"mrkTo" + markerUpdateCount} identifier="to" onLayout={adjustMarkers} coordinate={markerTo}>
              <View style={[styles.fullCenter]}>
                <View style={[styles.bgSecondary, styles.p8, styles.br16]}>
                  <Text style={[styles.white, styles.font12]}>{t('drop_off')}</Text>
                </View>
                <Triangle style={{ transform: [{ rotate: "180deg" }] }} />
              </View>
            </Marker>
          }
        </MapView>

        <View style={[containerStyle, styles.flexOne]}>

          <View style={mapScreenStyles.autoCompletePair}>
            <AutoComplete
              ref={fromRef}
              key="autoCompleteFrom"
              type="my-location"
              placeholder={t('from')}
              handleLocationSelect={setLocationFrom}
              inputStyles={[mapScreenStyles.autoCompleteStyles, mapScreenStyles.autoCompleteTop]}
              cities={citiesFrom}
              handleCancelLocationSelect={cancelLocationFrom}
            />
            <AutoComplete
              ref={toRef}
              key="autoCompleteTo"
              type="place"
              placeholder={t('to')}
              handleLocationSelect={setLocationTo}
              inputStyles={[mapScreenStyles.autoCompleteStyles, mapScreenStyles.autoCompleteBottom]}
              cities={citiesTo}
              handleCancelLocationSelect={cancelLocationTo}
            />
            <TouchableOpacity activeOpacity={0.8} onPress={swapDestinations} style={[styles.positionAbsolute, styles.alignCenter, styles.justifyCenter, styles.bgWhite, styles.borderSecondary, { top: 24 * rem, right: 5 * rem, height: 48 * rem, width: 48 * rem, borderRadius: 24 * rem, shadowColor: palette.black, shadowRadius: 12 * rem, shadowOpacity: 0.2, elevation: 10 }]}>
              <MaterialIcons name="swap-vert" size={22} color={palette.primary} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.text, styles.inputText]}>{t('date')}</Text>

          <CustomDatePicker date={date} setDate={setDate} style={[styles.mv10]} />

          <Text style={[styles.text, styles.inputText]}>
            {t('gender_to_carpool')}
          </Text>

          <View style={[styles.flexRow, styles.w100, styles.mv10, styles.br8, { overflow: 'hidden' }]}>
            {
              gender === "FEMALE" &&
              <TouchableOpacity onPress={function () { setGenderChoice('FEMALE') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'FEMALE' ? palette.primary : palette.gray }]}>
                <Text style={[mapScreenStyles.genderText]}>{t('female_only')}</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={function () { setGenderChoice('ANY') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'ANY' ? palette.primary : palette.gray }]}>
              <Text style={[mapScreenStyles.genderText]}>{t('any')}</Text>
            </TouchableOpacity>
            {
              gender === "MALE" &&
              <TouchableOpacity onPress={function () { setGenderChoice('MALE') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'MALE' ? palette.primary : palette.gray }]}>
                <Text style={[mapScreenStyles.genderText]}>{t('male_only')}</Text>
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
    </ScreenWrapper >

  );
}

const mapScreenStyles = StyleSheet.create({
  autoCompletePair: {
    ...styles.w100,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 * rem },
    shadowOpacity: 0.2, shadowRadius: 4,
    elevation: 10,
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
    ...styles.boldText
  }
});

export default MapScreen;
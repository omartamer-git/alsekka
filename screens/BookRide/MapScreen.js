import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, palette, customMapStyle, mapContainerStyle, containerStyle, mapPadding, rem } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import ScreenWrapper from '../ScreenWrapper';

const MapScreen = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const loc = route.params?.loc;

  // const [location, setLocation] = useState({
  //   latitude: 37.78825,
  //   longitude: -122.4324,
  //   latitudeDelta: 0.0922,
  //   longitudeDelta: 0.0421,
  // });
  const [location, setLocation] = useState(null);
  const [markerFrom, setMarkerFrom] = useState(null);
  const [markerTo, setMarkerTo] = useState(null);
  const mapViewRef = useRef(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [textFrom, setTextFrom] = useState('');
  const [textTo, setTextTo] = useState('');

  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [genderChoice, setGenderChoice] = useState('ANY');

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setLocation({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    );
  }, []);

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
  }

  const setLocationTo = (loc, text) => {
    setTextTo(text);
    setMarkerTo({ latitude: loc.lat, longitude: loc.lng });
  }

  const goFindRides = (e) => {
    if (markerFrom && markerTo) {
      navigation.navigate("Choose a Ride", { fromLat: markerFrom.latitude, fromLng: markerFrom.longitude, toLat: markerTo.latitude, toLng: markerTo.longitude, date: getDateSQL(date), textFrom: textFrom, textTo: textTo, genderChoice: genderChoice });
    }
  }

  const isDarkMode = useColorScheme === 'dark';


  return (
    <ScreenWrapper screenName="Search Rides">
      <ScrollView style={mapContainerStyle} contentContainerStyle={styles.flexGrow}>
        <MapView
          style={styles.mapStyle}
          showUserLocation={true}
          initialRegion={location}
          provider={PROVIDER_GOOGLE}
          ref={mapViewRef}
          customMapStyle={customMapStyle}
          mapPadding={mapPadding}
        >
          {markerFrom && <Marker identifier="from" onLayout={adjustMarkers} coordinate={markerFrom} pinColor="blue" />}
          {markerTo && <Marker identifier="to" onLayout={adjustMarkers} coordinate={markerTo} />}
        </MapView>

        <View style={[containerStyle, styles.flexOne]}>

          <View style={mapScreenStyles.autoCompletePair}>
            <AutoComplete key="autoCompleteFrom" type="my-location" placeholder="From..." handleLocationSelect={setLocationFrom} inputStyles={[mapScreenStyles.autoCompleteStyles, mapScreenStyles.autoCompleteTop]} />
            <AutoComplete key="autoCompleteTo" type="place" placeholder="To..." handleLocationSelect={setLocationTo} inputStyles={[mapScreenStyles.autoCompleteStyles, mapScreenStyles.autoCompleteBottom]} />
          </View>

          <DatePicker
            modal
            mode="date"
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

          <Text style={styles.inputText}>Date</Text>

          <CustomTextInput
            placeholder="Date"
            value={date.toDateString()}
            onPressIn={() => {
              setDatePickerOpen(true)
            }}
            iconRight="date-range"
            editable={false}
          />

          <Text style={styles.inputText}>Time</Text>

          <CustomTextInput
            placeholder="Time"
            value={time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            onPressIn={() => {
              setTimePickerOpen(true)
            }}
            iconRight="schedule"
            editable={false}
          />

          <DatePicker
            modal
            mode="time"
            open={timePickerOpen}
            date={time}
            onConfirm={(time) => {
              setTimePickerOpen(false)
              setTime(time)
            }}
            onCancel={() => {
              setTimePickerOpen(false)
            }}
          />

          <Text style={styles.inputText}>
            Gender to Carpool With
          </Text>

          <View style={[styles.flexRow, styles.w100, styles.mv10]}>
            <TouchableOpacity onPress={() => { setGenderChoice('FEMALE') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'FEMALE' ? palette.primary : palette.dark }]}>
              <Text style={mapScreenStyles.genderText}>Female Only</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setGenderChoice('ANY') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'ANY' ? palette.primary : palette.dark }]}>
              <Text style={mapScreenStyles.genderText}>Any</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setGenderChoice('MALE') }} activeOpacity={0.9} style={[mapScreenStyles.genderButton, { backgroundColor: genderChoice === 'MALE' ? palette.primary : palette.dark }]}>
              <Text style={mapScreenStyles.genderText}>Male Only</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.flexOne} />

          <Button
            text="Search"
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
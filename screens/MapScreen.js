import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  View,
  Text,
  TextInput,
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, palette, customMapStyle } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../components/HeaderView';
import AutoComplete from '../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';

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

  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    Geolocation.getCurrentPosition(
      info => {
        setLocation({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude
        });
      }
    );
  }, []);

  const setLocationFrom = (loc, text) => {
    setTextFrom(text);
    setMarkerFrom({ latitude: loc.lat, longitude: loc.lng });
    if (markerTo) {
      mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    } else {
      setLocation({ latitude: loc.lat, longitude: loc.lng });
    }
  }

  const setLocationTo = (loc, text) => {
    setTextTo(text);
    setMarkerTo({ latitude: loc.lat, longitude: loc.lng });
    if (markerFrom) {
      mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    } else {
      setLocation({ latitude: loc.lat, longitude: loc.lng });
    }
  }

  const goFindRides = (e) => {
    if (markerFrom && markerTo) {
      navigation.navigate("Choose a Ride", { fromLat: markerFrom.latitude, fromLng: markerFrom.longitude, toLat: markerTo.latitude, toLng: markerTo.longitude, date: getDateSQL(date), textFrom: textFrom, textTo: textTo });
    }
  }

  const isDarkMode = useColorScheme === 'dark';


  return (
    <View style={styles.backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
      <SafeAreaView>
        <HeaderView navType="back" screenName="Search Rides" borderVisible={false} action={() => { navigation.goBack() }} >
          <View style={styles.localeWrapper}>
            <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
            <Text style={styles.locale}>EN</Text>
          </View>
        </HeaderView>
      </SafeAreaView>

      <View style={styles.wrapper}>
        <SafeAreaView style={{ backgroundColor: palette.inputbg, borderRadius: 10, width: '100%', flex: 1 }}>
          <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

          </View>
          <MapView
            style={{ height: 300, width: '100%', zIndex: 3, elevation: 3, position: 'relative', marginTop: -20, borderBottomColor: '#d9d9d9', borderBottomWidth: 1 }}
            showUserLocation={true}
            region={location}
            provider={PROVIDER_GOOGLE}
            ref={mapViewRef}
            customMapStyle={customMapStyle}
            mapPadding={{ bottom: 48, top: 0, left: 16, right: 0 }}
          >
            {markerFrom && <Marker identifier="from" coordinate={markerFrom} pinColor="blue" />}
            {markerTo && <Marker identifier="to" coordinate={markerTo} />}
          </MapView>

          <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start' }]}>

            <View style={{ width: '100%', borderRadius: 4, shadowColor: palette.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4, position: 'relative', marginTop: -64, zIndex: 6 }}>
              <AutoComplete key="autoCompleteFrom" type="my-location" placeholder="From..." handleLocationSelect={setLocationFrom} inputStyles={{ marginTop: 0, marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 0.5, borderColor: palette.light, backgroundColor: palette.white }} />
              <AutoComplete key="autoCompleteTo" type="place" placeholder="To..." handleLocationSelect={setLocationTo} inputStyles={{ marginTop: 0, marginBottom: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 0.5, borderColor: palette.light, backgroundColor: palette.white }} />
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

            <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Date</Text>

            <CustomTextInput
              placeholder="Date"
              value={date.toDateString()}
              onPressIn={() => {
                setDatePickerOpen(true)
              }}
              iconRight="date-range"
              editable={false}
            />

            <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Time</Text>

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

            <View style={{ flex: 1 }} />

            <Button
              text="Search"
              bgColor={palette.primary}
              textColor={palette.white}
              onPress={goFindRides}
            />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

export default MapScreen;
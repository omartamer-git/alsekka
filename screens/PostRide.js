import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    ScrollView
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle } from '../helper';
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
import FromToIndicator from '../components/FromToIndicator';

const PostRide = ({ route, navigation }) => {
    const [location, setLocation] = useState(null);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const [pricePerSeat, setPricePerSeat] = useState('');
    const [time, setTime] = useState(new Date());
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [seatsAvailable, setSeatsAvailable] = useState('');
    const [seatsOccupied, setSeatsOccupied] = useState('');

    const mapViewRef = useRef(null);

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

    const setLocationFrom = (loc) => {
        setMarkerFrom({ latitude: loc.lat, longitude: loc.lng });
        if (markerTo) {
            mapViewRef.current.fitToSuppliedMarkers(["from", "to"]);
        } else {
            setLocation({ latitude: loc.lat, longitude: loc.lng });
        }
    }

    const setLocationTo = (loc) => {
        setMarkerTo({ latitude: loc.lat, longitude: loc.lng });
        if (markerFrom) {
            mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 50, bottom: 50, right: 50, left: 50 } });
        } else {
            setLocation({ latitude: loc.lat, longitude: loc.lng });
        }
    }

    const postRide = (e) => {
        console.log("h");
        if (markerFrom && markerTo) {
            console.log("b");
            const mainTextFrom = "Test 1";
            const mainTextTo = "Test 2";
            const secondaryTextFrom = "Test 3";
            const secondaryTextTo = "Test 4";
            const url = `${SERVER_URL}/postride?fromLatitude=${markerFrom.latitude}&fromLongitude=${markerFrom.longitude}&toLatitude=${markerTo.latitude}&toLongitude=${markerTo.longitude}&mainTextFrom=${mainTextFrom}&secondaryTextFrom=${secondaryTextFrom}&mainTextTo=${mainTextTo}&secondaryTextTo=${secondaryTextTo}&pricePerSeat=${pricePerSeat}&driver=${globalVars.getUserId()}&datetime=${getDateTime(date, false)}`;
            console.log(url);
            fetch(url).then(response => response.json()).then(data => {
                console.log(data);
            });
        }
    }

    const onChangePricePerSeat = (data) => {
        setPricePerSeat(data);
    }
    const isDarkMode = useColorScheme === 'dark';


    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Post Ride" borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <ScrollView style={styles.wrapper}>
                <SafeAreaView style={{ backgroundColor: palette.inputbg, borderRadius: 10, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    </View>

                    <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Starting Point</Text>
                        <AutoComplete key="autoCompleteFrom" type="my-location" placeholder="From..." handleLocationSelect={setLocationFrom} inputStyles={{ backgroundColor: palette.white }} />

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Destination</Text>
                        <AutoComplete key="autoCompleteTo" type="place" placeholder="To..." handleLocationSelect={setLocationTo} inputStyles={{ backgroundColor: palette.white }} />
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
                            textColor={palette.black}
                            onPressIn={() => {
                                setDatePickerOpen(true)
                            }}
                            iconRight="date-range"
                            editable={false}
                            style={{ backgroundColor: palette.white }}
                        /> 

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Time</Text>

                        <CustomTextInput
                            placeholder="Time"
                            value={time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            textColor={palette.black}
                            onPressIn={() => {
                                setTimePickerOpen(true)
                            }}
                            iconRight="schedule"
                            editable={false}
                            style={{ backgroundColor: palette.white }}
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

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Seats Available</Text>
 
                        <CustomTextInput
                            placeholder="Number of empty seats"
                            value={seatsAvailable}
                            iconLeft="groups"
                            style={{ backgroundColor: palette.white }}
                        />

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Seats Occupied</Text>
 
                        <CustomTextInput
                            placeholder="Number of full seats (without driver)"
                            value={seatsOccupied}
                            iconLeft="group-work"
                            style={{ backgroundColor: palette.white }}
                        />

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Price Per Seat</Text>

                        <CustomTextInput
                            placeholder="Price For One Seat"
                            value={pricePerSeat}
                            iconLeft="attach-money"
                            style={{ backgroundColor: palette.white }}
                        />

                        <Button text="Post Ride" bgColor={palette.primary} textColor={palette.white} onPress={postRide} />

                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

export default PostRide;
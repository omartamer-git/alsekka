import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
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
import AvailableRide from '../components/AvailableRide';
import Passenger from '../components/Passenger';


const ManageTrip = ({ route, navigation }) => {
    const { tripId } = route.params;

    const isDarkMode = useColorScheme === 'dark';
    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        const url = SERVER_URL + `/tripDetails?uid=${globalVars.getUserId()}&tripId=${tripId}`;
        console.log("trip id" + tripId);
        fetch(url).then(response => response.json()).then(
            data => {
                if (data.isDriver === 1) {
                    setTripDetails(data);
                }
            });
    }, []);

    const checkIn = (passengerId) => {
        Alert.alert('Check In', 'By clicking CONFIRM, you confirm that the passenger has gotten in the car and is ready for the trip.',
            [
                {
                    text: 'Cancel',
                    style: 'Cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => checkInConfirmed(passengerId)
            }
            ]);
    };

    const checkInConfirmed = (passengerId) => {
        const url = SERVER_URL + `/checkIn?tripId=${tripId}&passenger=${passengerId}`;
        fetch(url).then(response => response.json()).then(
            data => {
                if (data.success === 1) {
                    // set checked in somehow
                }
            });
    }

    const checkOut = (passengerId) => {
        navigation.navigate("Checkout", { tripId: tripId, passengerId: passengerId });
    };

    const noShow = (passengerId) => {
        Alert.alert('No Show', 'By clicking CONFIRM, you confirm that the passenger has not showed up on time for the ride, and you are going to leave without them.',
            [
                {
                    text: 'Cancel',
                    style: 'Cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => noShowConfirmed(passengerId)
            }
            ]);
    };

    const noShowConfirmed = (passengerId) => {
        const url = SERVER_URL + `/noshow?tripId=${tripId}&passenger=${passengerId}`;
        fetch(url).then(response => response.json()).then(
            data => {
                if (data.success === 1) {
                    // set no show somehow
                }
            });
    };

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Manage Trip" borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <View style={styles.wrapper}>
                <View style={{ backgroundColor: palette.white, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
                    <View style={{ width: '100%', flex: 1 }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5 }]}>
                                <View style={{ width: '100%', borderWidth: 1, borderColor: palette.light, borderRadius: 4 }}>
                                    {tripDetails &&
                                        tripDetails.passengers.map((data, index) => {
                                            let borderTopWidth = 1;
                                            if (index == 0) {
                                                borderTopWidth = 0;
                                            }
                                            return (
                                                <Passenger key={"passenger" + index} borderTopWidth={borderTopWidth} data={data}>
                                                    {
                                                        data.status === 0 &&
                                                        <TouchableOpacity onPress={() => { checkIn(data.id) }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: palette.secondary, padding: 8, borderRadius: 4 }} activeOpacity={0.9}>
                                                            <Text style={{ color: palette.white, fontWeight: '600' }}>Check In</Text>
                                                        </TouchableOpacity>
                                                    }
                                                    {
                                                        data.status === 0 &&
                                                        <TouchableOpacity onPress={() => { noShow(data.id) }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: palette.red, padding: 8, borderRadius: 4, marginLeft: 5 }} activeOpacity={0.9}>
                                                            <MaterialIcons name="close" size={14} color={palette.white} />
                                                        </TouchableOpacity>
                                                    }
                                                    {
                                                        data.status === 1 &&
                                                        <TouchableOpacity onPress={() => { checkOut(data.id) }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: palette.success, padding: 8, borderRadius: 4 }} activeOpacity={0.9}>
                                                            <Text style={{ color: palette.white, fontWeight: '600' }}>Check Out</Text>
                                                        </TouchableOpacity>
                                                    }
                                                </Passenger>
                                            );
                                        })
                                    }
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View >
            </View >
        </View >
    );
};


export default ManageTrip;
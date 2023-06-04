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
    StyleSheet,
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import * as ridesAPI from '../../api/ridesAPI';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import Passenger from '../../components/Passenger';
import ScreenWrapper from '../ScreenWrapper';


const ManageTrip = ({ route, navigation }) => {
    const { tripId } = route.params;

    const isDarkMode = useColorScheme === 'dark';
    const [tripDetails, setTripDetails] = useState(null);

    useEffect(() => {
        ridesAPI.tripDetails(tripId).then(data => {
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
        ridesAPI.checkPassengerIn(passengerId, tripId).then(data => {
            // set checked in somehow
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
        ridesAPI.noShow(passengerId, tripId).then(data => {
            if (data) {
                // set no show
            }
        });
    };

    return (
        <ScreenWrapper screenName="Manage Trip" navType={"back"} navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <View style={[styles.w100, styles.border1, styles.borderLight, styles.br8]}>
                    {tripDetails &&
                        tripDetails.passengers.map((data, index) => {
                            let borderTopWidth = 1;
                            if (index == 0) {
                                borderTopWidth = 0;
                            }
                            return (
                                <Passenger key={"passenger" + index} borderTopWidth={borderTopWidth} data={data}>
                                    {
                                        data.status === 'CONFIRMED' &&
                                        <TouchableOpacity onPress={() => { checkIn(data.userId) }} style={[manageTripStyles.manageBtn, styles.bgSecondary]} activeOpacity={0.9}>
                                            <Text style={manageTripStyles.manageBtnText}>Check In</Text>
                                        </TouchableOpacity>
                                    }
                                    {
                                        data.status === 'CONFIRMED' &&
                                        <TouchableOpacity onPress={() => { noShow(data.userId) }} style={[manageTripStyles.manageBtn, styles.ml5, styles.bgRed]} activeOpacity={0.9}>
                                            <MaterialIcons name="close" size={14} color={palette.white} />
                                        </TouchableOpacity>
                                    }
                                    {
                                        data.status === 'ENROUTE' &&
                                        <TouchableOpacity onPress={() => { checkOut(data.userId) }} style={[manageTripStyles.manageBtn, styles.bgSuccess]} activeOpacity={0.9}>
                                            <Text style={manageTripStyles.manageBtnText}>Check Out</Text>
                                        </TouchableOpacity>
                                    }
                                </Passenger>
                            );
                        })
                    }
                </View>
            </ScrollView>
        </ScreenWrapper >
    );
};

const manageTripStyles = StyleSheet.create({
    manageBtn: {
        ...styles.fullCenter,
        ...styles.p8,
        ...styles.br8,
    },

    manageBtnText: {
        ...styles.bold,
        ...styles.white
    }
});


export default ManageTrip;
import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle, rem } from '../../helper';
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
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../ScreenWrapper';


const AllTrips = ({ navigation, route }) => {
    const [nextRides, setNextRides] = useState([]);
    const currentTime = new Date();

    const [driverElement, setDriverElement] = useState(false);
    const [driverMainTextFrom, setDriverMainTextFrom] = useState('');
    const [driverMainTextTo, setDriverMainTextTo] = useState('');
    const [driverTripId, setDriverTripId] = useState(null);
    const [afterTime, setAfter] = useState(null);

    useEffect(() => {
        updateRides();

        ridesAPI.driverRides(1).then((data) => {
            if (data.length === 0) {
                // no upcoming rides
            }
            else if (data[0].driver === 0) {
                setDriverElement(true);
            } else {
                setDriverElement(true);
                setDriverTripId(data[0].id);
                setDriverMainTextFrom(data[0].mainTextFrom);
                setDriverMainTextTo(data[0].mainTextTo);
            }
        });
    }, []);

    const updateRides = () => {
        ridesAPI.pastRides(3, afterTime).then(
            data => {
                let newNextRides = nextRides;
                newNextRides = newNextRides.concat(data);

                setNextRides(newNextRides);
                if (data.length != 0) {
                    const newAfter = (new Date(data[data.length - 1].datetime) * 1);
                    setAfter(newAfter);
                }
            }
        );
    };

    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const isDarkMode = useColorScheme === 'dark';

    return (
        <ScreenWrapper screenName="All Trips" navAction={() => navigation.goBack()} navType="back">
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Text style={[styles.headerText2, { marginTop: 20 }]}>
                    Trips
                </Text>

                {driverElement && driverMainTextTo &&
                    <LinearGradient style={[styles.mt20, styles.w100, styles.br8]} colors={[palette.primary, palette.secondary]}>
                        <TouchableOpacity style={[styles.rideView, styles.pv8, styles.ph16, styles.flexOne, styles.alignCenter, styles.justifyStart, styles.flexRow, styles.bgTransparent]}
                            onPress={() => { viewTrip(driverTripId); }}>
                            <Text style={[styles.white, styles.flexOne]}>View your upcoming trip to {driverMainTextTo}</Text>

                            <View>
                                <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                    <MaterialIcons name="arrow-forward-ios" size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </LinearGradient>
                }
                {
                    driverElement && !driverMainTextTo &&
                    <View style={[styles.rideView, styles.pv8, styles.ph16, styles.mt20, styles.bgSecondary, styles.alignCenter, styles.justifyStart, styles.flexRow]}>
                        <Text style={[styles.white, styles.flexOne]}>You haven't applied to be a vehicle owner yet, apply now!</Text>

                        <View>
                            <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                <MaterialIcons name="arrow-forward-ios" size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                }

                {
                    nextRides && nextRides.map((data, index) => {
                        const nextRideDate = new Date(data.datetime);
                        return (
                            <AvailableRide key={"ride" + index} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} pricePerSeat={data.pricePerSeat} seatsOccupied={data.seatsOccupied} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={allTripsStyle.availableRide} onPress={() => { viewTrip(data.id); }} />
                        );
                    })
                }
                {
                    !nextRides &&
                    <View style={allTripsStyle.noRides} >
                        <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                        <Text style={[styles.mt5, styles.bold, styles.dark, styles.textCenter]}>Your next ride is just a tap away. Book or post a ride now!</Text>
                    </View>
                }
                <TouchableOpacity style={[styles.w100, styles.fullCenter]} onPress={updateRides}>
                    <Text style={[styles.bold, styles.primary]}>Load More Trips...</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenWrapper>
    );
};

const allTripsStyle = StyleSheet.create({
    noRides: {
        ...styles.rideView,
        ...styles.mv10,
        height: 140 * rem,
        ...styles.ph24
    },

    availableRide: {
        height: 140 * rem,
        ...styles.mv10,
    }
});

export default AllTrips;
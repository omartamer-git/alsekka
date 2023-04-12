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
import AvailableRide from '../components/AvailableRide';
import LinearGradient from 'react-native-linear-gradient';


const AllTrips = ({ navigation, route }) => {
    const [nextRides, setNextRides] = useState([]);
    //const [nextRideDate, setNextRideDate] = useState(new Date());
    const currentTime = new Date();

    const [driverElement, setDriverElement] = useState(false);
    const [driverMainTextFrom, setDriverMainTextFrom] = useState('');
    const [driverMainTextTo, setDriverMainTextTo] = useState('');
    const [driverTripId, setDriverTripId] = useState(null);
    const [afterTime, setAfter] = useState(null);

    useEffect(() => {
        updateRides();

        fetch(SERVER_URL + `/driverrides?uid=${globalVars.getUserId()}&limit=1`).then(response => response.json()).then(
            data => {
                if (data.length === 0) {
                    // no upcoming rides
                }
                else if (data[0].driver === "0") {
                    setDriverElement(true);
                } else {
                    // driver, has an upcoming ride
                    setDriverElement(true);
                    setDriverTripId(data[0].id);
                    setDriverMainTextFrom(data[0].mainTextFrom);
                    setDriverMainTextTo(data[0].mainTextTo);
                }
            }
        );


    }, []);

    const updateRides = () => {
        let url = SERVER_URL + `/pastrides?uid=${globalVars.getUserId()}&limit=3`;
        if (afterTime) {
            url = url + `&after=${afterTime}`;
        }
        
        fetch(url).then(response => response.json()).then(
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
    }

    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const isDarkMode = useColorScheme === 'dark';

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Home" borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <View style={styles.wrapper}>
                <SafeAreaView style={{ backgroundColor: palette.inputbg, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                    </View>

                    <ScrollView style={{flex: 1}} contentContainerStyle={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', justifyContent: 'flex-start', flex: 0 }]}>
                        <Text style={[styles.headerText2, { marginTop: 20 }]}>
                            Trips
                        </Text>

                        {driverElement && driverMainTextTo &&
                        <LinearGradient style={{height: 70, marginTop: 20, width: '100%', borderRadius: 8}} colors={[palette.primary, palette.secondary]}>
                            <TouchableOpacity style={[styles.rideView, { flex: 1, alignItems: 'center', paddingLeft: 16, paddingRight: 16, justifyContent: 'flex-start', flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0)' }]}
                                onPress={() => { viewTrip(driverTripId); }}>
                                <Text style={[styles.white, { flex: 1 }]}>View your upcoming trip to {driverMainTextTo}</Text>

                                <View>
                                    <TouchableOpacity style={{ color: palette.white, justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <MaterialIcons name="arrow-forward-ios" size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
                        }
                        {
                            driverElement && !driverMainTextTo &&
                            <View style={[styles.rideView, { height: 70, marginTop: 20, backgroundColor: palette.secondary, alignItems: 'center', paddingLeft: 16, paddingRight: 16, justifyContent: 'flex-start', flexDirection: 'row' }]}>
                                <Text style={[styles.white, { flex: 1 }]}>You haven't applied to be a vehicle owner yet, apply now!</Text>

                                <View>
                                    <TouchableOpacity style={{ color: palette.white, justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <MaterialIcons name="arrow-forward-ios" size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {
                            nextRides && nextRides.map((data, index) => {
                                const nextRideDate = new Date(data.datetime);
                                return (
                                    <AvailableRide key={"ride" + index} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} pricePerSeat={data.pricePerSeat} seatsOccupied={data.seatsOccupied} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={{ marginTop: 8, marginBottom: 8, height: 140 }} onPress={() => { viewTrip(data.id); }} />
                                );
                            })
                        }
                        {
                            !nextRides &&
                            <View style={[styles.rideView, { marginTop: 8, marginBottom: 8, height: 140 }]} >
                                <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                                <Text style={{ marginTop: 5, fontWeight: 'bold', color: palette.dark, flexWrap: 'wrap', width: '75%', textAlign: 'center' }}>Your next ride is just a tap away. Book or post a ride now!</Text>
                            </View>
                        }
                        <TouchableOpacity style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={updateRides}>
                            <Text style={{ fontWeight: 'bold', color: palette.primary }}>Load More Trips...</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </View >
        </View >
    );
};

export default AllTrips;
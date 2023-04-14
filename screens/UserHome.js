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
    Dimensions
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HeaderView from '../components/HeaderView';
import AutoComplete from '../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../components/FromToIndicator';
import AvailableRide from '../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';


const UserHome = ({ navigation, route }) => {
    const [nextRideData, setNextRideData] = useState(null);
    const [nextRideDate, setNextRideDate] = useState(new Date());
    const currentTime = new Date();

    const [driverElement, setDriverElement] = useState(false);
    const [driverMainTextFrom, setDriverMainTextFrom] = useState('');
    const [driverMainTextTo, setDriverMainTextTo] = useState('');
    const [driverTripId, setDriverTripId] = useState(null);
    const [carouselWidth, setCarouselWidth] = useState(200);
    const [carouselData, setCarouselData] = useState(null);
    const MAX_CAROUSEL_TEXT_LENGTH = 250;

    useEffect(() => {
        fetch(SERVER_URL + `/upcomingrides?uid=${globalVars.getUserId()}&limit=1`).then(response => response.json()).then(
            data => {
                if (data.length != 0) {
                    setNextRideData(data[0]);
                    setNextRideDate(new Date(data[0].datetime));
                }
            }
        );

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
                    setDriverMainTextTo(data[0].mainTextTo)
                }
            }
        );

        fetch(SERVER_URL + `/announcements?active=1`).then(response => response.json()).then(
            data => {
                setCarouselData(data);
            }
        );


    }, []);

    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const findCarouselWidth = (layout) => {
        const { x, y, width, height } = layout.nativeEvent.layout;
        console.log(width);
        setCarouselWidth(width);
    };

    const width = Dimensions.get('window').width;

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

                    <ScrollView contentContainerStyle={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', justifyContent: 'flex-start', flex: 0 }]}>
                        <Text style={[styles.headerText2, { marginTop: 20 }]}>
                            Good
                            {
                                currentTime.getHours() < 12 ? " Morning" : currentTime.getHours() < 18 ? " Afternoon" : " Evening"
                            }
                            , {globalVars.getFirstName()}!
                        </Text>

                        {driverElement && driverMainTextTo &&
                            <LinearGradient style={{ height: 70, marginTop: 20, width: '100%', borderRadius: 8 }} colors={[palette.primary, palette.secondary]}>
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
                            <TouchableOpacity
                            onPress={() => {navigation.navigate('Driver Documents')}}
                            activeOpacity={0.75}
                            style={[styles.rideView, { height: 70, marginTop: 20, backgroundColor: palette.secondary, alignItems: 'center', paddingLeft: 16, paddingRight: 16, justifyContent: 'flex-start', flexDirection: 'row' }]}>
                                <Text style={[styles.white, { flex: 1 }]}>You haven't applied to be a vehicle owner yet, apply now!</Text>

                                <View>
                                    <TouchableOpacity style={{ color: palette.white, justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <MaterialIcons name="arrow-forward-ios" size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        }

                        <Text style={[styles.headerText3, { marginTop: 20 }]}>Your Upcoming Rides</Text>
                        {
                            nextRideData &&
                            <AvailableRide fromAddress={nextRideData.mainTextFrom} toAddress={nextRideData.mainTextTo} pricePerSeat={nextRideData.pricePerSeat} seatsOccupied={nextRideData.seatsOccupied} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={{ marginTop: 8, marginBottom: 8, height: 140 }} onPress={() => { viewTrip(nextRideData.id); }} />
                        }
                        {
                            !nextRideData &&
                            <View style={[styles.rideView, { marginTop: 8, marginBottom: 8, height: 140 }]} >
                                <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                                <Text style={{ marginTop: 5, fontWeight: 'bold', color: palette.dark, flexWrap: 'wrap', width: '75%', textAlign: 'center' }}>Your next ride is just a tap away. Book or post a ride now!</Text>
                            </View>
                        }
                        <TouchableOpacity underlayColor={palette.inputbg} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={() => { navigation.navigate('All Trips') }}>
                            <Text style={{ fontWeight: 'bold', color: palette.primary }}>View All Trips</Text>
                        </TouchableOpacity>

                        <View onLayout={findCarouselWidth} style={{ width: '100%', marginTop: 20, }}>
                            {carouselData &&
                            <Carousel loop style={{ backgroundColor: palette.accent, borderRadius: 8 }} autoPlay={true} autoPlayInterval={5000} width={carouselWidth} height={MAX_CAROUSEL_TEXT_LENGTH / 1.4} data={carouselData} renderItem={
                                ({ index }) => (
                                    <View style={{ flex: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 16 }}>
                                        <Text style={{ color: palette.white, fontWeight: '600', fontSize: 18, lineHeight: 18 }}>
                                            {carouselData[index].title}
                                        </Text>
                                        <Text style={{ color: palette.light, fontWeight: '500', marginTop: 10, lineHeight: 14, fontSize: 14 }}>
                                            {carouselData[index].text.substring(0, MAX_CAROUSEL_TEXT_LENGTH) + (carouselData[index].text.length > MAX_CAROUSEL_TEXT_LENGTH ? "..." : "")}
                                        </Text>
                                        {carouselData[index].text.length > MAX_CAROUSEL_TEXT_LENGTH &&
                                            <TouchableOpacity
                                                onPress={
                                                    () => {
                                                        navigation.navigate('Announcement', { id: carouselData[index].id });
                                                    }
                                                }
                                            >
                                                <Text style={{ marginTop: 5, color: palette.dark, lineHeight: 14, fontSize: 14 }}>Read More...</Text></TouchableOpacity>
                                        }
                                    </View>
                                )
                            }></Carousel>}
                        </View>

                    </ScrollView>
                </SafeAreaView >
            </View >
        </View >
    );
};

export default UserHome;
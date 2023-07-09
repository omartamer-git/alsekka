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
    Dimensions,
    StyleSheet,
    RefreshControl
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle, rem } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as ridesAPI from '../../api/ridesAPI';
import * as announcementsAPI from '../../api/announcementsAPI';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import ScreenWrapper from '../ScreenWrapper';
import useUserStore from '../../api/accountAPI';


const UserHome = ({ navigation, route }) => {
    const [nextRideData, setNextRideData] = useState(null);
    const [nextRideDate, setNextRideDate] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const currentTime = new Date();

    const [driverElement, setDriverElement] = useState(false);
    const [driverMainTextFrom, setDriverMainTextFrom] = useState('');
    const [driverMainTextTo, setDriverMainTextTo] = useState('');
    const [driverTripId, setDriverTripId] = useState(null);
    const [carouselWidth, setCarouselWidth] = useState(200);
    const [carouselData, setCarouselData] = useState(null);

    const userStore = useUserStore();

    const MAX_CAROUSEL_TEXT_LENGTH = 250;

    const loadData = () => {
        setRefreshing(true);
        const promises = [ridesAPI.upcomingRides().then((data) => {
            if (data) {
                setNextRideData(data);
                setNextRideDate(new Date(data.datetime));
            }
        }),

        ridesAPI.driverRides(1).then((data) => {
            if (data.length === 0) {
                // no upcoming rides
            }
            else if (data[0].driver === 0) {
                setDriverElement(true);
            } else {
                // driver, has an upcoming ride
                setDriverElement(true);
                setDriverTripId(data[0].id);
                setDriverMainTextFrom(data[0].mainTextFrom);
                setDriverMainTextTo(data[0].mainTextTo)
            }
        }),

        announcementsAPI.getAnnouncements(1).then((data) => {
            setCarouselData(data);
        })];

        Promise.all(promises)
            .then(() => {
                // All API calls have succeeded
                setRefreshing(false);
            })
            .catch((error) => {
                // Handle errors if any API call fails
                console.error("Error occurred during API calls:", error);
                setRefreshing(false); // Set refreshing to false even in case of errors
            });
    };

    useEffect(() => {
        loadData();
    }, []);


    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const findCarouselWidth = (layout) => {
        const { x, y, width, height } = layout.nativeEvent.layout;
        setCarouselWidth(width);
    };

    const onRefresh = () => {
        loadData();
    };

    const width = Dimensions.get('window').width;

    return (
        <ScreenWrapper screenName={"Home"}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <Text style={[styles.headerText2, styles.mt20]}>
                    Good
                    {
                        currentTime.getHours() < 12 ? " Morning" : currentTime.getHours() < 18 ? " Afternoon" : " Evening"
                    }
                    , {userStore.firstName}!
                </Text>

                {driverElement && driverMainTextTo &&
                    <LinearGradient style={userHomeStyles.selfUpcomingRide} colors={[palette.primary, palette.secondary]}>
                        <TouchableOpacity style={[userHomeStyles.topAlert, styles.bgTransparent]}
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
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('Driver Documents') }}
                        activeOpacity={0.9}
                        style={[userHomeStyles.topAlert, styles.bgPrimary]}>
                        <Text style={[styles.white, styles.flexOne]}>You haven't applied to be a vehicle owner yet, apply now!</Text>

                        <View>
                            <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                <MaterialIcons name="arrow-forward-ios" size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                }

                <Text style={[styles.headerText3, styles.mt20]}>Your Upcoming Rides</Text>
                {
                    nextRideData &&
                    <AvailableRide fromAddress={nextRideData.mainTextFrom} toAddress={nextRideData.mainTextTo} pricePerSeat={nextRideData.pricePerSeat} seatsOccupied={nextRideData.seatsOccupied} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={{ marginTop: 8 * rem, marginBottom: 8 * rem, height: 140 * rem }} onPress={() => { viewTrip(nextRideData.id); }} />
                }
                {
                    !nextRideData &&
                    <View style={userHomeStyles.noRides} >
                        <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                        <Text style={[styles.mt5, styles.bold, styles.dark, styles.textCenter]}>Your next ride is just a tap away. Book or post a ride now!</Text>
                    </View>
                }
                <TouchableOpacity underlayColor={palette.lightGray} style={[styles.w100, styles.fullCenter]} onPress={() => { navigation.navigate('All Trips') }}>
                    <Text style={[styles.bold, styles.primary]}>View All Trips</Text>
                </TouchableOpacity>

                <View onLayout={findCarouselWidth} style={[styles.w100, styles.mt20]}>
                    {carouselData && carouselData.length !== 0 &&
                        <Carousel loop style={[styles.bgAccent, styles.br8]} autoPlay={true} autoPlayInterval={5000} width={carouselWidth} height={MAX_CAROUSEL_TEXT_LENGTH / 1.4} data={carouselData} renderItem={
                            ({ index }) => (
                                <View style={[styles.flexOne, styles.w100, styles.justifyStart, styles.alignStart, styles.p16]}>
                                    <Text style={[styles.white, styles.bold, styles.font18]}>
                                        {carouselData[index].title}
                                    </Text>
                                    <Text style={[styles.light, styles.semiBold, styles.mt10, styles.font14]}>
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
                                            <Text style={[styles.mt5, styles.dark, styles.font14]}>Read More...</Text></TouchableOpacity>
                                    }
                                </View>
                            )
                        }></Carousel>}
                </View>

            </ScrollView>
        </ScreenWrapper>


    );
};

const userHomeStyles = StyleSheet.create({
    selfUpcomingRide: {
        ...styles.mt20,
        ...styles.w100,
        ...styles.br8
    },

    topAlert: {
        ...styles.rideView,
        ...styles.alignCenter,
        ...styles.p16,
        ...styles.justifyStart,
        ...styles.flexRow,
    },

    noRides: {
        height: 140 * rem,
        ...styles.rideView,
        ...styles.mv10,
        ...styles.ph24,
    },
});

export default UserHome;
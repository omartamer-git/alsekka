import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    I18nManager,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { containerStyle, getDateShort, getTime, palette, rem, styles } from '../../helper';

import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import useUserStore from '../../api/accountAPI';
import * as announcementsAPI from '../../api/announcementsAPI';
import * as ridesAPI from '../../api/ridesAPI';
import AvailableRide from '../../components/AvailableRide';
import ScreenWrapper from '../ScreenWrapper';
import useLocale from '../../locale/localeContext';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    const userStore = useUserStore();

    const MAX_CAROUSEL_TEXT_LENGTH = 250;

    const loadData = async () => {
        try {
            setRefreshing(true);

            const data1 = await ridesAPI.upcomingRides();
            if (data1) {
                setNextRideData(data1);
                setNextRideDate(new Date(data1.datetime));
            }

            const data2 = await ridesAPI.driverRides(1);
            if (data2.length === 0) {
                // no upcoming rides
            } else if (data2[0].driver === 0) {
                setDriverElement(true);
            } else {
                // driver, has an upcoming ride
                setDriverElement(true);
                setDriverTripId(data2[0].id);
                setDriverMainTextFrom(data2[0].mainTextFrom);
                setDriverMainTextTo(data2[0].mainTextTo);
            }

            const data3 = await announcementsAPI.getAnnouncements(1);
            setCarouselData(data3);

            // All API calls have succeeded
            setRefreshing(false);
        } catch (error) {
            // Handle errors if any API call fails
            console.error("Error occurred during API calls:", error);
            setRefreshing(false); // Set refreshing to false even in case of errors
        }
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
        <ScreenWrapper screenName={t('home')}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <Text style={[styles.headerText2, styles.mt20]}>
                    {
                        currentTime.getHours() < 12 ? t('greeting_morning') : currentTime.getHours() < 18 ? t('greeting_afternoon') : t('greeting_night')
                    }
                    , {userStore.firstName}!
                </Text>

                {driverElement && driverMainTextTo &&
                    <LinearGradient style={userHomeStyles.selfUpcomingRide} colors={[palette.primary, palette.secondary]}>
                        <TouchableOpacity style={[userHomeStyles.topAlert, styles.bgTransparent]}
                            onPress={() => { viewTrip(driverTripId); }}>
                            <Text style={[styles.white, styles.flexOne]}>{t('view_upcoming_trip_to')} {driverMainTextTo}</Text>

                            <View>
                                <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                    <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} color="white" />
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
                        <Text style={[styles.white, styles.flexOne]}>{t('apply_vehicle_owner')}</Text>

                        <View>
                            <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} color="white" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                }

                <Text style={[styles.headerText3, styles.mt20]}>{t('upcoming_rides')}</Text>
                {
                    nextRideData &&
                    <AvailableRide fromAddress={nextRideData.mainTextFrom} toAddress={nextRideData.mainTextTo} pricePerSeat={nextRideData.pricePerSeat} DriverId={nextRideData.DriverId} seatsOccupied={nextRideData.seatsOccupied} seatsAvailable={nextRideData.seatsAvailable} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={{ marginTop: 8 * rem, marginBottom: 8 * rem, height: 140 * rem }} onPress={() => { viewTrip(nextRideData.id); }} />
                }
                {
                    !nextRideData &&
                    <View style={userHomeStyles.noRides} >
                        <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                        <Text style={[styles.mt5, styles.bold, styles.dark, styles.textCenter]}>{t('cta_no_rides')}</Text>
                    </View>
                }
                <TouchableOpacity underlayColor={palette.lightGray} style={[styles.w100, styles.fullCenter]} onPress={() => { navigation.navigate('All Trips') }}>
                    <Text style={[styles.bold, styles.primary]}>{t('view_all_trips')}</Text>
                </TouchableOpacity>

                <View onLayout={findCarouselWidth} style={[styles.w100, styles.mt20]}>
                    {carouselData && carouselData.length !== 0 &&
                        <Carousel loop style={[styles.bgAccent, styles.br8]} autoPlay={true} autoPlayInterval={5000} width={carouselWidth} height={MAX_CAROUSEL_TEXT_LENGTH / 1.4} data={carouselData} renderItem={
                            ({ index }) => {
                                const announcementText = I18nManager.isRTL ? carouselData[index].text_ar : carouselData[index].text_en;
                                const announcementTitle = I18nManager.isRTL ? carouselData[index].title_ar : carouselData[index].title_en;
                                return (
                                <View style={[styles.flexOne, styles.w100, styles.justifyStart, styles.alignStart, styles.p16]}>
                                    <Text style={[styles.white, styles.bold, styles.font18]}>
                                        { announcementTitle }
                                    </Text>
                                    <Text style={[styles.light, styles.semiBold, styles.mt10, styles.font14]}>
                                        {
                                            announcementText.substring(0, MAX_CAROUSEL_TEXT_LENGTH) +
                                            (announcementText.length > MAX_CAROUSEL_TEXT_LENGTH ? "..." : "")
                                        }
                                    </Text>
                                    {announcementText.length > MAX_CAROUSEL_TEXT_LENGTH &&
                                        <TouchableOpacity
                                            onPress={
                                                () => {
                                                    navigation.navigate('Announcement', { id: carouselData[index].id });
                                                }
                                            }
                                        >
                                            <Text style={[styles.mt5, styles.dark, styles.font14]}>{t('read_more')}</Text></TouchableOpacity>
                                    }
                                </View>
                            )}
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
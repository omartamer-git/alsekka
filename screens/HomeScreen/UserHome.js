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
import { containerStyle, dateDiffInDays, palette, rem, styles } from '../../helper';

import { useTranslation } from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useUserStore from '../../api/accountAPI';
import * as announcementsAPI from '../../api/announcementsAPI';
import * as ridesAPI from '../../api/ridesAPI';
import AvailableRide from '../../components/AvailableRide';
import ScreenWrapper from '../ScreenWrapper';
import { DriverPopUp } from '../../components/DriverPopUp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserHome = ({ navigation, route }) => {
    const [nextRideData, setNextRideData] = useState(null);
    const [nextRideDate, setNextRideDate] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [driverPopUpVisible, setDriverPopUpVisible] = useState(false);
    const currentTime = new Date();

    const [driverElement, setDriverElement] = useState(false);
    const [driverMainTextFrom, setDriverMainTextFrom] = useState('');
    const [driverMainTextTo, setDriverMainTextTo] = useState('');
    const [driverTripId, setDriverTripId] = useState(null);
    const [carouselWidth, setCarouselWidth] = useState(200);
    const [carouselData, setCarouselData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    const userStore = useUserStore();

    const MAX_CAROUSEL_TEXT_LENGTH = 250;

    const loadData = async  function () {
        try {
            setRefreshing(true);

            const data1 = await ridesAPI.upcomingRides();
            if (data1) {
                setNextRideData(data1);
                setNextRideDate(new Date(data1.datetime));
            }

            if (userStore.driver) {
                const data2 = await ridesAPI.driverRides(1);
                if (data2.length !== 0) {
                    setDriverElement(true);
                    setDriverTripId(data2[0].id);
                    setDriverMainTextFrom(data2[0].mainTextFrom);
                    setDriverMainTextTo(data2[0].mainTextTo);
                }
            } else {
                setDriverElement(true);
            }

            const data3 = await announcementsAPI.getAnnouncements(1);
            setCarouselData(data3);

            // All API calls have succeeded
            setRefreshing(false);
        } catch (error) {
            // Handle errors if any API call fails
            // console.error("Error occurred during API calls:", error);
            console.log(error.stack)
            setRefreshing(false); // Set refreshing to false even in case of errors
        }
    };

    useEffect( function () {
        setLoading(true);
        loadData().then(() => setLoading(false));
    }, []);

    useEffect( function () {
        if (!loading && !userStore.driver) {
            AsyncStorage.getItem('driverPopUp').then(driverPopUp => {
                if (!driverPopUp) {
                    setDriverPopUpVisible(true);
                    AsyncStorage.setItem('driverPopUp', (new Date()).toISOString());
                } else {
                    const date = new Date(driverPopUp);
                    const diffDates = dateDiffInDays(new Date(), date);
                    if (diffDates >= 45) {
                        setDriverPopUpVisible(true);
                        AsyncStorage.setItem('driverPopUp', (new Date()).toISOString());
                    }
                }
            });
        }
    }, [loading])


    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const findCarouselWidth = (layout) => {
        const { x, y, width, height } = layout.nativeEvent.layout;
        setCarouselWidth(width);
    };

    const onRefresh =  function () {
        loadData();
    };

    const width = Dimensions.get('window').width;


    return (
        <ScreenWrapper screenName={t('home')}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={[styles.flexOne]} contentContainerStyle={containerStyle} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {
                    !loading &&
                    <>
                        {
                            <DriverPopUp
                                modalVisible={driverPopUpVisible}
                                onHide={() => setDriverPopUpVisible(false)}
                                navigateToDriver={() =>
                                    navigation.navigate('Post Ride', { screen: 'Driver Documents' })
                                }
                            />

                        }
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.text, styles.headerText2, styles.mt20]}>
                            {
                                currentTime.getHours() < 12 ? t('greeting_morning') : currentTime.getHours() < 18 ? t('greeting_afternoon') : t('greeting_night')
                            }
                            {t('comma')}&nbsp;{userStore.firstName}!
                        </Text>

                        {driverElement && driverMainTextTo &&
                            <TouchableOpacity style={[userHomeStyles.topAlert, styles.bgPrimary, styles.mt10]}
                                onPress={ function () { viewTrip(driverTripId); }}>
                                <Text style={[styles.text, styles.white, styles.flexOne]}>{t('view_upcoming_trip_to')} {driverMainTextTo}</Text>

                                <View style={[styles.mh10]}>
                                    <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                        <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        }
                        {
                            driverElement && !driverMainTextTo &&
                            <TouchableOpacity
                                onPress={ function () { navigation.navigate('Driver Documents') }}
                                activeOpacity={0.9}
                                style={[userHomeStyles.topAlert, styles.bgPrimary, styles.mt10]}>
                                <Text style={[styles.text, styles.white, styles.flexOne, styles.textStart]}>{t('apply_vehicle_owner')}</Text>

                                <View>
                                    <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                        <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        }

                        <Text style={[styles.text, styles.headerText3, styles.mt20]}>{t('upcoming_rides')}</Text>
                        {
                            nextRideData &&
                            <AvailableRide
                                fromAddress={nextRideData.mainTextFrom}
                                toAddress={nextRideData.mainTextTo}
                                pricePerSeat={nextRideData.pricePerSeat}
                                duration={nextRideData.duration}
                                DriverId={nextRideData.DriverId}
                                seatsOccupied={nextRideData.seatsOccupied}
                                seatsAvailable={nextRideData.seatsAvailable}
                                pickupEnabled={nextRideData.pickupEnabled}
                                gender={nextRideData.gender}
                                duration={nextRideData.duration}
                                date={nextRideDate}
                                style={{ marginTop: 8 * rem, marginBottom: 8 * rem, minHeight: 140 * rem }}
                                onPress={ function () { viewTrip(nextRideData.id); }} />
                        }
                        {
                            !nextRideData &&
                            <View style={userHomeStyles.noRides} >
                                <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                                <Text style={[styles.text, styles.mt5, styles.bold, styles.dark, styles.textCenter]}>{t('cta_no_rides')}</Text>
                            </View>
                        }
                        <TouchableOpacity underlayColor={palette.lightGray} style={[styles.w100, styles.fullCenter]} onPress={ function () { navigation.navigate('All Trips') }}>
                            <Text style={[styles.text, styles.bold, styles.primary]}>{t('view_all_trips')}</Text>
                        </TouchableOpacity>

                        <View onLayout={findCarouselWidth} style={[styles.w100, styles.mt20]}>
                            {carouselData && carouselData.length !== 0 &&
                                <Carousel loop style={[styles.bgAccent, styles.br8]} autoPlay={true} autoPlayInterval={5000} width={carouselWidth} height={MAX_CAROUSEL_TEXT_LENGTH / 1.4} data={carouselData} renderItem={
                                    ({ index }) => {
                                        const announcementText = I18nManager.isRTL ? carouselData[index].text_ar : carouselData[index].text_en;
                                        const announcementTitle = I18nManager.isRTL ? carouselData[index].title_ar : carouselData[index].title_en;
                                        return (
                                            <View style={[styles.flexOne, styles.w100, styles.justifyStart, styles.alignStart, styles.p16]}>
                                                <Text style={[styles.text, styles.white, styles.bold, styles.font18]}>
                                                    {announcementTitle}
                                                </Text>
                                                <Text style={[styles.text, styles.light, styles.semiBold, styles.mt10, styles.font14]}>
                                                    {
                                                        announcementText.substring(0, MAX_CAROUSEL_TEXT_LENGTH) +
                                                        (announcementText.length > MAX_CAROUSEL_TEXT_LENGTH ? "..." : "")
                                                    }
                                                </Text>
                                                {announcementText.length > MAX_CAROUSEL_TEXT_LENGTH &&
                                                    <TouchableOpacity
                                                        onPress={
                                                             function () {
                                                                navigation.navigate('Announcement', { id: carouselData[index].id });
                                                            }
                                                        }
                                                    >
                                                        <Text style={[styles.text, styles.mt5, styles.dark, styles.font14]}>{t('read_more')}</Text></TouchableOpacity>
                                                }
                                            </View>
                                        )
                                    }
                                }></Carousel>}
                        </View>
                    </>
                }

                {
                    loading &&
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginVertical={20 * rem} width={'100%'} height={60 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginVertical={10 * rem} width={'100%'} height={45 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginVertical={10 * rem} width={'100%'} height={45 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginVertical={10 * rem} width={'100%'} height={45 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginVertical={20 * rem} width={'100%'} height={MAX_CAROUSEL_TEXT_LENGTH / 1.4} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginVertical={10 * rem} width={'100%'} height={45 * rem} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }


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
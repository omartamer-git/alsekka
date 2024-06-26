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

import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useTranslation } from 'react-i18next';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useUserStore from '../../api/accountAPI';
import * as announcementsAPI from '../../api/announcementsAPI';
import * as ridesAPI from '../../api/ridesAPI';
import AvailableRide from '../../components/AvailableRide';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import { DriverPopUp } from '../../components/DriverPopUp';
import ScreenWrapper from '../ScreenWrapper';

function UserHome({ navigation, route }) {
    const [nextRideData, setNextRideData] = useState(null);
    const [nextRideDate, setNextRideDate] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [driverPopUpVisible, setDriverPopUpVisible] = useState(false);
    const currentTime = new Date();

    const [driverElement, setDriverElement] = useState(false);
    const [referralElement, setReferralElement] = useState(true);
    const [driverMainTextFrom, setDriverMainTextFrom] = useState('');
    const [driverMainTextTo, setDriverMainTextTo] = useState('');
    const [driverTripId, setDriverTripId] = useState(null);
    const [carouselWidth, setCarouselWidth] = useState(200);
    const [carouselData, setCarouselData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [safetyTipsVisible, setSafetyTipsVisible] = useState(false);

    const { t } = useTranslation();

    const userStore = useUserStore();

    const MAX_CAROUSEL_TEXT_LENGTH = 250;

    const loadData = async function () {
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
            // console.log(error.stack)
            setRefreshing(false); // Set refreshing to false even in case of errors
        }
    };

    useEffect(function () {
        setLoading(true);
        loadData().then(() => setLoading(false));
    }, []);

    useEffect(function () {
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
    }, [loading]);

    function viewTrip(id) {
        navigation.navigate('View Trip', { tripId: id });
    };

    function findCarouselWidth(layout) {
        const { x, y, width, height } = layout.nativeEvent.layout;
        setCarouselWidth(width);
    };

    function onRefresh() {
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
                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.boldText, styles.headerText2, styles.mt20]}>
                            {
                                currentTime.getHours() < 12 ? t('greeting_morning') : currentTime.getHours() < 18 ? t('greeting_afternoon') : t('greeting_night')
                            }
                            {t('comma')}&nbsp;<Text style={[styles.capitalize]}>{userStore.firstName}</Text>!
                        </Text>

                        {driverElement && driverMainTextTo &&
                            <TouchableOpacity style={[userHomeStyles.topAlert, styles.bgPrimary, styles.mt10]}
                                onPress={function () { viewTrip(driverTripId); }}>
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
                                onPress={function () { navigation.navigate('Driver Documents') }}
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

                        <Text style={[styles.boldText, styles.headerText3, styles.mt20]}>{t('upcoming_rides')}</Text>
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
                                date={nextRideDate}
                                style={[styles.mv10, { minHeight: 140 * rem }]}
                                onPress={function () { viewTrip(nextRideData.id); }} />
                        }
                        {
                            !nextRideData &&
                            <View style={userHomeStyles.noRides} >
                                <MaterialIcons name="sentiment-very-satisfied" size={48} color={palette.dark} />
                                <Text style={[styles.boldText, styles.mt5, styles.dark, styles.textCenter]}>{t('cta_no_rides')}</Text>
                            </View>
                        }
                        <TouchableOpacity underlayColor={palette.lightGray} style={[styles.w100, styles.fullCenter]} onPress={function () { navigation.navigate('All Trips') }}>
                            <Text style={[styles.boldText, styles.primary]}>{t('view_all_trips')}</Text>
                        </TouchableOpacity>

                        <View style={[styles.w100, styles.mt10]}>
                            <Text style={[styles.boldText, styles.headerText3]}>{t('shortcuts')}</Text>

                            <View style={[styles.w100, styles.flexRow, styles.gap10, styles.mt10]}>
                                <TouchableOpacity activeOpacity={0.75} onPress={() => { navigation.navigate('Account', { screen: 'Referral' }) }} style={[styles.flexOne, styles.bgPrimary, styles.br8, { aspectRatio: 1, position: 'relative', overflow: 'hidden' }]}>
                                    <View style={[styles.p8, styles.w100, styles.h100, { overflow: 'hidden' }]}>
                                        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.boldText, styles.headerText3, styles.white]}>
                                            {t('refer_shortcut')}
                                        </Text>
                                        <Text adjustsFontSizeToFit numberOfLines={2} style={[styles.text, styles.white]}>
                                            {t('refer_shortcut_2')}
                                        </Text>
                                        <View style={[styles.positionAbsolute, styles.w100, styles.h100, styles.alignStart, styles.justifyStart, { top: 0, left: 0, opacity: 0.2, zIndex: -1 }]}>
                                            <LottieView style={{ width: 100 * rem, height: 100 * rem, marginLeft: 20, marginTop: 15 }} source={require('../../assets/refer_animation.json')} autoPlay loop useNativeLooping />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.75} onPress={() => { navigation.navigate('Account', { screen: 'Wallet' }) }} style={[styles.flexOne, styles.bgGray, styles.br8, { aspectRatio: 1, position: 'relative', overflow: 'hidden' }]}>
                                    <View style={[styles.positionAbsolute, { top: 0, left: 0 }, styles.w100, styles.h100, styles.p8, { zIndex: 40 }]}>
                                        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.boldText, styles.headerText3, styles.white]}>
                                            {t('earnings_shortcut')}
                                        </Text>
                                        <Text adjustsFontSizeToFit numberOfLines={2} style={[styles.text, styles.white]}>
                                            {t('earnings_shortcut_2')}
                                        </Text>
                                    </View>
                                    <View style={[styles.positionAbsolute, { top: 0, left: 0 }, styles.w100, styles.h100, styles.p8, styles.bgDark, { opacity: 0.8, zIndex: 39 }]}>
                                    </View>
                                    <View style={[styles.p8, styles.w100, styles.h100, { overflow: 'hidden' }]}>
                                        <View style={[styles.positionAbsolute, styles.w100, styles.h100, styles.alignStart, styles.justifyStart, { top: 0, left: 0, opacity: 1, zIndex: -1 }]}>
                                            <LottieView style={{ width: 100 * rem, height: 100 * rem, marginLeft: 20, marginTop: 15 }} source={require('../../assets/money_animation.json')} autoPlay loop useNativeLooping />
                                        </View>
                                    </View>
                                </TouchableOpacity>


                                <TouchableOpacity activeOpacity={0.75} onPress={() => { navigation.navigate('Communities') }} style={[styles.flexOne, styles.bgSecondary, styles.br8, { aspectRatio: 1, position: 'relative', overflow: 'hidden' }]}>
                                    <View style={[styles.positionAbsolute, { top: 0, left: 0 }, styles.w100, styles.h100, styles.p8, { zIndex: 40 }]}>
                                        <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.boldText, styles.headerText3, styles.white]}>
                                            {t('community_shortcut')}
                                        </Text>
                                        <Text adjustsFontSizeToFit numberOfLines={2} style={[styles.text, styles.white]}>
                                            {t('community_shortcut_2')}
                                        </Text>
                                    </View>
                                    <View style={[styles.positionAbsolute, { top: 0, left: 0 }, styles.w100, styles.h100, styles.p8, styles.bgSecondary, { opacity: 0.8, zIndex: 39 }]}>
                                    </View>
                                    <View style={[styles.p8, styles.w100, styles.h100, { overflow: 'hidden' }]}>
                                        <View style={[styles.positionAbsolute, styles.w100, styles.h100, styles.alignStart, styles.justifyStart, { top: 0, left: 0, opacity: 1, zIndex: -1 }]}>
                                            <LottieView style={{ width: 100 * rem, height: 100 * rem, marginLeft: 20, marginTop: 15 }} source={require('../../assets/community_animation.json')} autoPlay loop useNativeLooping />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.w100, styles.br8, styles.p8, styles.bgAccent, styles.mt10, styles.flexRow, styles.spaceBetween, styles.gap15]}>
                            <View style={[styles.spaceBetween, styles.flexOne, styles.gap10]}>
                                <View>
                                    <Text style={[styles.boldText, styles.white, styles.headerText3]}>
                                        {t('safety_tips')}
                                    </Text>
                                    <Text style={[styles.text, styles.dark, styles.semiBold, styles.black]}>
                                        {t('ensure_safety')}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => setSafetyTipsVisible(true)} activeOpacity={0.9} style={[styles.bgWhite, styles.p8, styles.br8, styles.fullCenter, styles.mt5]}>
                                    <Text style={[styles.boldText]}>
                                        {t('learn_more')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <LottieView style={[{ height: 96 * rem, width: 96 * rem }]} source={require('../../assets/safety_animation.json')} autoPlay loop />
                        </View>

                        {safetyTipsVisible &&
                            <BottomModal modalVisible={safetyTipsVisible} onHide={() => setSafetyTipsVisible(false)} extended>
                                <View style={[styles.flexOne, styles.w100, styles.p8, styles.gap10]}>
                                    <View style={[styles.w100, styles.flexRow, styles.fullCenter, styles.gap20]}>
                                        <View style={[styles.fullCenter]}>
                                            <LottieView source={require('../../assets/license_animation.json')} loop autoPlay style={[{ width: 100 * rem, height: 100 * rem }]} />
                                        </View>

                                        <View style={[styles.flexOne]}>
                                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.boldText, styles.font18]}>
                                                {t('safety_verify_driver')}
                                            </Text>

                                            <Text style={[styles.text, styles.font14]}>
                                                {t('safety_verify_driver_2')}
                                            </Text>
                                        </View>
                                    </View>


                                    <View style={[styles.w100, styles.flexRow, styles.fullCenter, styles.gap20]}>
                                        <View style={[styles.fullCenter]}>
                                            <LottieView source={require('../../assets/routing_animation.json')} loop autoPlay style={[{ width: 100 * rem, height: 100 * rem }]} />
                                        </View>

                                        <View style={[styles.flexOne]}>
                                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.boldText, styles.font18]}>
                                                {t('safety_route')}
                                            </Text>

                                            <Text style={[styles.text, styles.font14]}>
                                                {t('safety_route_2')}
                                            </Text>
                                        </View>
                                    </View>


                                    <View style={[styles.w100, styles.flexRow, styles.fullCenter, styles.gap20]}>
                                        <View style={[styles.fullCenter]}>
                                            <LottieView source={require('../../assets/rating_animation.json')} loop autoPlay style={[{ width: 100 * rem, height: 100 * rem }]} />
                                        </View>

                                        <View style={[styles.flexOne]}>
                                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.boldText, styles.font18]}>
                                                {t('safety_ratings')}
                                            </Text>

                                            <Text style={[styles.text, styles.font14]}>
                                                {t('safety_ratings_2')}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={[styles.w100, styles.flexRow, styles.fullCenter, styles.gap20]}>
                                        <View style={[styles.fullCenter]}>
                                            <LottieView source={require('../../assets/emergency_animation.json')} loop autoPlay style={[{ width: 100 * rem, height: 100 * rem }]} />
                                        </View>

                                        <View style={[styles.flexOne]}>
                                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.boldText, styles.font18]}>
                                                {t('safety_emergency')}
                                            </Text>

                                            <Text style={[styles.text, styles.font14]}>
                                                {t('safety_emergency_2')}
                                            </Text>
                                        </View>
                                    </View>

                                    <Button text={t('ok')} bgColor={palette.accent} textColor={palette.white} onPress={() => setSafetyTipsVisible(false)} />
                                </View>
                            </BottomModal>
                        }
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
        </ScreenWrapper >


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
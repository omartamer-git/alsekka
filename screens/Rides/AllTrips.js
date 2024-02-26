import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    I18nManager,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import AvailableRide from '../../components/AvailableRide';
import { containerStyle, getDateShort, getTime, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';


function AllTrips({ navigation, route }) {
    const [nextRides, setNextRides] = useState([]);
    const currentTime = new Date();

    const [driverElement, setDriverElement] = useState(false);
    const [driverMainTextFrom, setDriverMainTextFrom] = useState('');
    const [driverMainTextTo, setDriverMainTextTo] = useState('');
    const [driverTripId, setDriverTripId] = useState(null);
    const [page, setPage] = useState(1);
    // const [afterTime, setAfter] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(function () {
        setLoading(true);

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
            setLoading(false);
        });
    }, []);

    const updateRides = function () {
        ridesAPI.pastRides(3, page).then(
            data => {
                let newNextRides = nextRides;
                newNextRides = newNextRides.concat(data);

                setNextRides(newNextRides);
                if (data.length != 0) {
                    setPage(p => p + 1);
                }
            }
        );
    };

    function viewTrip(id) {
        navigation.navigate('View Trip', { tripId: id });
    }

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('all_trips')} navAction={() => navigation.goBack()} navType="back">
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    !loading &&
                    <>
                        <Text style={[styles.text, styles.headerText2, { marginTop: 20 }]}>
                            {t('trips')}
                        </Text>

                        {driverElement && driverMainTextTo &&
                            <View style={[styles.mt20, styles.w100, styles.br8, styles.bgPrimary]} >
                                <TouchableOpacity style={[styles.rideView, styles.pv8, styles.ph16, styles.flexOne, styles.alignCenter, styles.justifyStart, styles.flexRow, styles.bgTransparent]}
                                    onPress={function () { viewTrip(driverTripId); }}>
                                    <Text style={[styles.text, styles.white, styles.flexOne]}>{t('view_upcoming_trip_to')} {driverMainTextTo}</Text>

                                    <View>
                                        <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                            <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        }
                        {
                            driverElement && !driverMainTextTo &&
                            <View style={[styles.rideView, styles.pv8, styles.ph16, styles.mt20, styles.bgSecondary, styles.alignCenter, styles.justifyStart, styles.flexRow]}>
                                <Text style={[styles.text, styles.white, styles.flexOne]}>{t('apply_vehicle_owner')}</Text>

                                <View>
                                    <TouchableOpacity style={[styles.white, styles.justifyCenter, styles.alignEnd]}>
                                        <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {
                            nextRides && nextRides.map((data, index) => {
                                const nextRideDate = new Date(data.datetime);
                                return (
                                    <AvailableRide
                                        key={"ride" + index}
                                        fromAddress={data.mainTextFrom}
                                        toAddress={data.mainTextTo}
                                        duration={data.duration}
                                        pricePerSeat={data.pricePerSeat}
                                        DriverId={data.DriverId}
                                        seatsOccupied={data.seatsOccupied}
                                        seatsAvailable={data.seatsAvailable}
                                        pickupEnabled={data.pickupEnabled}
                                        gender={data.gender}
                                        date={nextRideDate}
                                        style={allTripsStyle.availableRide}
                                        onPress={function () { viewTrip(data.id); }} />
                                );
                            })
                        }
                        {
                            (!nextRides || nextRides.length === 0) &&
                            <View style={allTripsStyle.noRides} >
                                <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                                <Text style={[styles.text, styles.mt5, styles.bold, styles.dark, styles.textCenter]}>{t('cta_no_rides')}</Text>
                            </View>
                        }
                        {
                            (nextRides && nextRides.length > 0) &&
                            <TouchableOpacity style={[styles.w100, styles.fullCenter]} onPress={updateRides}>
                                <Text style={[styles.text, styles.bold, styles.primary]}>{t('load_more_trips')}</Text>
                            </TouchableOpacity>
                        }

                    </>
                }

                {
                    loading &&
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={40 * rem} marginTop={20 * rem} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={140 * rem} marginVertical={10 * rem} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={140 * rem} marginVertical={10 * rem} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={140 * rem} marginVertical={10 * rem} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={40 * rem} marginVertical={10 * rem} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }

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
        minHeight: 140 * rem,
        ...styles.mv10,
    }
});

export default AllTrips;
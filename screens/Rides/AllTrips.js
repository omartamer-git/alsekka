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
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import { containerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import Ride from '../../components/Ride';


function AllTrips({ navigation, route }) {
    const [nextRides, setNextRides] = useState([]);
    const [hasMoreTrips, setHasMoreTrips] = useState(true);
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

                if (data.length < 3) {
                    setHasMoreTrips(false);
                }
            }
        );
    };

    function viewTrip(id) {
        navigation.navigate('View Trip', { tripId: id });
    }

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}-${month}-${date.getFullYear()}`;
    };

    const groupRidesByDate = () => {
        const groups = {};
        nextRides.forEach(ride => {
            const date = formatDate(ride.datetime);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(ride);
        });
    

        for (const date in groups) {
            groups[date].sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
        }
    
        return groups;
    };

    const groupedRides = groupRidesByDate();

    const { t } = useTranslation();

    useEffect(() => {

        console.log(nextRides[0]);
    }
        , [nextRides]);

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

                        {!loading && Object.entries(groupedRides).map(([date, rides]) => (
                            <View key={date}>
                                <Text style={[styles.text, styles.headerText2, { marginTop: 20, fontSize: 16}]}>{date}</Text>
                                {rides.map((ride, index) => (
                                    <Ride
                                        key={"ride" + index}
                                        fromAddress={ride.mainTextFrom}
                                        toAddress={ride.mainTextTo}
                                        duration={ride.duration}
                                        pricePerSeat={ride.pricePerSeat}
                                        DriverId={ride.DriverId}
                                        seatsOccupied={ride.seatsOccupied}
                                        seatsAvailable={ride.seatsAvailable}
                                        pickupEnabled={ride.pickupEnabled}
                                        gender={ride.gender}
                                        rid={ride.id}
                                        date={new Date(ride.datetime)}
                                        style={allTripsStyle.availableRide}
                                        onPress={() => navigation.navigate('View Trip', { tripId: ride.id })}
                                        page={'all_trips'}
                                    />
                                ))}
                            </View>
                        ))}
                        {
                            (!nextRides || nextRides.length === 0) &&
                            <View style={allTripsStyle.noRides} >
                                <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                                <Text style={[styles.text, styles.mt5, styles.bold, styles.dark, styles.textCenter]}>{t('cta_no_rides')}</Text>
                            </View>
                        }
                        {
                            (hasMoreTrips && nextRides && nextRides.length > 0) &&
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
        minHeight: 170 * rem,
        ...styles.mv10,
    }
});

export default AllTrips;
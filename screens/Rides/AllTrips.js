import React, { useEffect, useState } from 'react';
import {
    I18nManager,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import AvailableRide from '../../components/AvailableRide';
import { containerStyle, getDateShort, getTime, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';


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
    const {t} = useTranslation();

    return (
        <ScreenWrapper screenName="All Trips" navAction={() => navigation.goBack()} navType="back">
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Text style={[styles.headerText2, { marginTop: 20 }]}>
                    {t('trips')}
                </Text>

                {driverElement && driverMainTextTo &&
                    <LinearGradient style={[styles.mt20, styles.w100, styles.br8]} colors={[palette.primary, palette.secondary]}>
                        <TouchableOpacity style={[styles.rideView, styles.pv8, styles.ph16, styles.flexOne, styles.alignCenter, styles.justifyStart, styles.flexRow, styles.bgTransparent]}
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
                    <View style={[styles.rideView, styles.pv8, styles.ph16, styles.mt20, styles.bgSecondary, styles.alignCenter, styles.justifyStart, styles.flexRow]}>
                        <Text style={[styles.white, styles.flexOne]}>{t('apply_vehicle_owner')}</Text>

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
                            <AvailableRide key={"ride" + index} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} pricePerSeat={data.pricePerSeat} DriverId={data.DriverId} seatsOccupied={data.seatsOccupied} seatsAvailable={data.seatsAvailable} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={allTripsStyle.availableRide} onPress={() => { viewTrip(data.id); }} />
                        );
                    })
                }
                {
                    !nextRides &&
                    <View style={allTripsStyle.noRides} >
                        <MaterialIcons name="sentiment-very-dissatisfied" size={48} color={palette.dark} />
                        <Text style={[styles.mt5, styles.bold, styles.dark, styles.textCenter]}>{t('cta_no_rides')}</Text>
                    </View>
                }
                <TouchableOpacity style={[styles.w100, styles.fullCenter]} onPress={updateRides}>
                    <Text style={[styles.bold, styles.primary]}>{t('load_more_trips')}</Text>
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
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import Passenger from '../../components/Passenger';
import { containerStyle, customMapStyle, mapPadding, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import LiveAnimation from '../../components/LiveAnimation';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import ArrowButton from '../../components/ArrowButton';
import Button from '../../components/Button';


const ManageTrip = ({ route, navigation }) => {
    const { tripId } = route.params;

    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [passengersAtOrigin, setPassengersAtOrigin] = useState([]);
    const [passengersPickup, setPassengersPickup] = useState([]);
    const [location, setLocation] = useState({});

    useEffect(() => {
        setLoading(true);
        ridesAPI.tripDetails(tripId).then(data => {
            if (data.isDriver === 1) {
                setTripDetails(data);
                const passengersAtOrigin = data.passengers.filter(passenger => (passenger.pickupLocationLat === null && passenger.status === 'CONFIRMED'));
                const passengersPickup = data.passengers.filter(passenger => passenger.pickupLocationLat !== null);
                setPassengersAtOrigin(passengersAtOrigin);
                setPassengersPickup(passengersPickup);
            }
            setLoading(false);
        });
    }, []);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const auth = Geolocation.requestAuthorization();
            return true;
        }

        if (Platform.OS === 'android') {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            }
        }

        return false;
    };

    useEffect(() => {
        const result = requestLocationPermission();
        result.then((res) => {
            if (res) {
                Geolocation.getCurrentPosition(
                    info => {
                        setLocation({
                            latitude: info.coords.latitude,
                            longitude: info.coords.longitude
                        });
                    }
                );
            }
        });
    }, [])

    const getPhase = () => {
        return passengersAtOrigin.length > 0 ? 0 : (passengersPickup.length > 0 ? 1 : 2);
    }

    const checkIn = (passengerId) => {
        Alert.alert('Check In', 'By clicking CONFIRM, you confirm that the passenger has gotten in the car and is ready for the trip.',
            [
                {
                    text: 'Cancel',
                    style: 'Cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => checkInConfirmed(passengerId)
                }
            ]);
    };

    const checkInConfirmed = (passengerId) => {
        setSubmitDisabled(true);
        ridesAPI.checkPassengerIn(passengerId, tripId).then(data => {
            if (getPhase() === 0) {
                const newPassengers = passengersAtOrigin.filter(passenger => passenger.UserId !== passengerId);
                setPassengersAtOrigin(newPassengers);
            } else if (getPhase() === 1) {
                const newPassengers = passengersPickup.filter(passenger => passenger.UserId !== passengerId);
                setPassengersPickup(newPassengers);
            }
        }).catch(console.error).finally(() => {
            setSubmitDisabled(false);
        });
    }

    const checkOut = (passengerId) => {
        navigation.navigate("Checkout", { tripId: tripId, passengerId: passengerId });
    };

    const noShow = (passengerId) => {
        Alert.alert('No Show', 'By clicking CONFIRM, you confirm that the passenger has not showed up on time for the ride, and you are going to leave without them.',
            [
                {
                    text: 'Cancel',
                    style: 'Cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => noShowConfirmed(passengerId)
                }
            ]);
    };

    const noShowConfirmed = (passengerId) => {
        ridesAPI.noShow(passengerId, tripId).then(data => {
            if (data) {
                // set no show
            }
        });
    };

    const [seconds, setSeconds] = useState(300); // 5 minutes in seconds

    useEffect(() => {
        const interval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    const displayTime = () => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    };

    const getPickupPassenger = () => {
        return passengersPickup[0];
    }

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('manage_trip')} navType={"back"} navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    !loading &&
                    <>
                        <View style={[styles.w100, styles.fullCenter, styles.mb10]}>
                            <LiveAnimation width={75} height={75} />
                            <Text style={[styles.bold, styles.font28]}>
                                {
                                    getPhase() === 0 ? 'Wait at Starting Point' :
                                        getPhase() === 1 ? 'Head to Pick Up Point' : '???'
                                }
                            </Text>
                            {getPhase() === 0 &&
                                <Text style={[styles.bold, styles.font28, styles.primary]}>{displayTime()}</Text>
                            }
                        </View>

                        {passengersAtOrigin && getPhase() === 0 &&
                            passengersAtOrigin.map((data, index) => {
                                let borderTopWidth = 1;
                                if (index == 0) {
                                    borderTopWidth = 0;
                                }

                                return (
                                    <View style={[styles.w100, styles.border1, styles.borderLight, styles.br8]}>
                                        <Passenger key={"passenger" + index} borderTopWidth={borderTopWidth} data={data}>
                                            {
                                                data.status === 'CONFIRMED' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={() => { checkIn(data.UserId) }} style={[manageTripStyles.manageBtn, styles.bgSecondary]} activeOpacity={0.9}>
                                                    <Text style={manageTripStyles.manageBtnText}>{t('check_in')}</Text>
                                                </TouchableOpacity>
                                            }
                                            {
                                                data.status === 'CONFIRMED' && seconds === 0 &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={() => { noShow(data.UserId) }} style={[manageTripStyles.manageBtn, styles.ml5, styles.bgRed]} activeOpacity={0.9}>
                                                    <MaterialIcons name="close" size={14} color={palette.white} />
                                                </TouchableOpacity>
                                            }
                                            {/* {
                                                data.status === 'ENROUTE' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={() => { checkOut(data.UserId) }} style={[manageTripStyles.manageBtn, styles.bgSuccess]} activeOpacity={0.9}>
                                                    <Text style={manageTripStyles.manageBtnText}>{t('check_out')}</Text>
                                                </TouchableOpacity>
                                            } */}
                                        </Passenger>
                                    </View>
                                );
                            })
                        }

                        {
                            /*
                                Going to need an algorithm to arrange pickups in the fastest route order
                            */
                        }
                        {passengersPickup && passengersPickup.length > 0 && getPhase() === 1 &&
                            <>
                                <MapView
                                    style={[{ height: 200 * rem }, styles.w100]}
                                    showsUserLocation={true}
                                    provider={PROVIDER_GOOGLE}
                                    customMapStyle={customMapStyle}
                                    showsMyLocationButton
                                    maxZoomLevel={18}
                                    initialRegion={location}
                                >
                                    <Marker key={"markerFrom"} identifier='from' coordinate={{ latitude: getPickupPassenger().pickupLocationLat, longitude: getPickupPassenger().pickupLocationLng }}></Marker>
                                    {getPickupPassenger() && <MapViewDirections
                                        origin={`${location.latitude},${location.longitude}`}
                                        destination={`${getPickupPassenger().pickupLocationLat},${getPickupPassenger().pickupLocationLng}`}
                                        apikey='AIzaSyDUNz5SYhR1nrdfk9TW4gh3CDpLcDMKwuw'
                                        strokeWidth={3}
                                        strokeColor={palette.accent}
                                    />}
                                </MapView>

                                <ArrowButton bgColor={palette.light} text={t('directions_to_pickup')} />

                                <View style={[styles.flexRow, styles.fullCenter]}>
                                    <View style={[styles.border2, styles.fullCenter, { height: 75 * rem, width: 75 * rem, borderRadius: 75 * rem / 2 }]}>
                                        <Image source={{ uri: getPickupPassenger().User.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
                                    </View>
                                    <View style={[styles.ml10]}>
                                        <Text style={[styles.mb5, styles.font14]}>You're picking up</Text>
                                        <Text style={[styles.bold, styles.font18]}>
                                            {
                                                getPickupPassenger().User.firstName
                                            }
                                            &nbsp;
                                            {
                                                getPickupPassenger().User.lastName
                                            }
                                        </Text>
                                    </View>

                                </View>

                                <Button bgColor={palette.secondary} text={t('check_in')} textColor={palette.white} onPress={() => checkIn(getPickupPassenger().UserId)} />
                                <Button bgColor={palette.red} text={t('no_show')} textColor={palette.white} onPress={() => noShow(getPickupPassenger().UserId)} />
                            </>
                        }
                        {getPhase() === 0 &&
                            <Text style={[styles.bold, styles.smallText, styles.dark, styles.fullCenter, styles.textCenter, styles.mt10]}>
                                Please press the <Text style={styles.secondary}>Check In</Text> button when the passenger has gotten in the car. If a passenger fails to show up on time (within the waiting period), press the <Text style={styles.error}>Red X button</Text>.
                            </Text>
                        }

                    </>
                }

                {
                    loading &&
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>


                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>


                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>


                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>


                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>

                        </View>
                    </>
                }
            </ScrollView>
        </ScreenWrapper >
    );
};

const manageTripStyles = StyleSheet.create({
    manageBtn: {
        ...styles.fullCenter,
        ...styles.p8,
        ...styles.br8,
    },

    manageBtnText: {
        ...styles.bold,
        ...styles.white
    }
});


export default ManageTrip;
import { ActivityType, requestBackgroundPermissionsAsync, startLocationUpdatesAsync } from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getOptimalPath } from '../../api/googlemaps';
import * as ridesAPI from '../../api/ridesAPI';
import ArrowButton from '../../components/ArrowButton';
import Button from '../../components/Button';
import LiveAnimation from '../../components/LiveAnimation';
import Passenger from '../../components/Passenger';
import { containerStyle, customMapStyle, getDirections, palette, rem, styles } from '../../helper';
import { getDeviceLocation } from '../../util/location';
import { decodePolyline } from '../../util/maps';
import ScreenWrapper from '../ScreenWrapper';
import FastImage from 'react-native-fast-image';
import useErrorManager from '../../context/errorManager';


function ManageTrip({ route, navigation }) {
    const { tripId } = route.params;
    const { t } = useTranslation();
    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [passengersAtOrigin, setPassengersAtOrigin] = useState([]);
    const [passengersPickup, setPassengersPickup] = useState([]);
    const [location, setLocation] = useState({
        latitude: 30.0444,
        longitude: 31.2357,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
    });
    // const [arrived, setArrived] = useState(false);
    const [tripTotals, setTripTotals] = useState(null);
    const [paidPassengers, setPaidPassengers] = useState([]);
    const [reviewsOpen, setReviewsOpen] = useState(false);
    const currentMapRef = useRef(null);

    useEffect(function () {
        setLoading(true);
        ridesAPI.tripDetails(tripId).then(data => {
            if (data.isDriver === 1) {
                setTripDetails(data);
                const passengersAtOrigin = data.passengers.filter(passenger => (passenger.pickupLocationLat === null && passenger.status === 'CONFIRMED'));
                const passengersPickup = data.passengers.filter(passenger => passenger.pickupLocationLat !== null && passenger.status === 'CONFIRMED');
                setPassengersAtOrigin(passengersAtOrigin);

                if (passengersPickup.length > 0) {
                    getOptimalPath(tripId).then(orderedList => {
                        const orderedPassengersPickup = orderedList.map((passengerId) => {
                            return passengersPickup.find((p) => p.UserId === passengerId);
                        });

                        setPassengersPickup(orderedPassengersPickup);
                    });

                }
            }
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        // .requestBackgroundPermissionsAsync()
        requestBackgroundPermissionsAsync().then(res => {
            if (res.granted) {
                startLocationUpdatesAsync("UPDATE_LOCATION_DRIVER", {
                    activityType: ActivityType.AutomotiveNavigation,
                    pausesUpdatesAutomatically: true,
                    showsBackgroundLocationIndicator: true
                })
            } else {
                if (res.canAskAgain) {
                    Alert.alert(t('permissions'), t('permissions_location'),
                        [
                            {
                                text: t('cancel'),
                                style: 'Cancel'
                            },
                            {
                                text: t('permissions_open_settings'),
                                onPress: () => {
                                    Linking.openSettings();
                                }
                            }
                        ]);
                }
            }
        })
    }, [])

    const fitToSuppliedMarkers = function () {
        if (!currentMapRef.current) return;
        currentMapRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    };

    useEffect(function () {
        getDeviceLocation().then(result => {
            if (result) {
                // setLocation(result);
                setLocation(loc => ({ ...loc, ...result }));
            }
        })
    }, [])

    const getPhase = function () {
        if (!passengersAtOrigin) {
            return 0;
        }
        return reviewsOpen ? 4 : tripTotals ? 3 : (passengersAtOrigin.length > 0 ? 0 : (passengersPickup.length > 0 ? 1 : 2));
    }

    function checkIn(passengerId) {
        Alert.alert(t('check_in'), t('confirm_check_in'),
            [
                {
                    text: t('cancel'),
                    style: 'Cancel'
                },
                {
                    text: t('confirm'),
                    onPress: () => checkInConfirmed(passengerId)
                }
            ]);
    };

    function checkInConfirmed(passengerId) {
        setSubmitDisabled(true);
        ridesAPI.checkPassengerIn(passengerId, tripId).then(data => {
            if (getPhase() === 0) {
                const newPassengers = passengersAtOrigin.filter(passenger => passenger.UserId !== passengerId);
                setPassengersAtOrigin(newPassengers);
            } else if (getPhase() === 1) {
                const newPassengers = passengersPickup.filter(passenger => passenger.UserId !== passengerId);
                setPassengersPickup(newPassengers);
            }
        }).catch(console.error).finally(function () {
            setSubmitDisabled(false);
        });
    }

    const checkOut = async function () {
        ridesAPI.checkPassengerOut(tripId).then(function () {
            generateRatings();
            setReviewsOpen(true);
        }).catch((err) => {
            console.error(err);
        });
    };

    function setPassengerPaid(passengerId) {
        setPaidPassengers(
            (prevPaidPassengers) => {
                // Create a new array using the spread operator
                const newPaidPassengers = [...prevPaidPassengers, passengerId];
                return newPaidPassengers;
            }
        );
    }


    function hasPassengerPaid(passengerId) {
        return paidPassengers.includes(passengerId) || tripDetails.passengers.find(p => p.UserId === passengerId).paymentMethod !== 'CASH';
    }

    function noShow(passengerId) {
        Alert.alert(t('no_show'), t('confirm_no_show'),
            [
                {
                    text: t('cancel'),
                    style: 'Cancel'
                },
                {
                    text: t('confirm'),
                    onPress: () => noShowConfirmed(passengerId)
                }
            ]);
    };
    const errorManager = useErrorManager();
    function noShowConfirmed(passengerId) {
        if (new Date().getTime() < new Date(tripDetails.datetime).getTime()) {
            errorManager.setError(t('error_wait_time'));
            return;
        }
        ridesAPI.noShow(passengerId, tripId).then(data => {
            if (data) {
                const newPassengers = tripDetails.passengers.filter(p => (p.UserId !== passengerId));
                setTripDetails(tripDetails => ({
                    ...tripDetails,
                    passengers: [
                        ...newPassengers,
                        {
                            ...tripDetails.passengers.find(p => p.UserId === passengerId),
                            status: 'NOSHOW'
                        }
                    ]
                }));
                // console.log(data);
                // set no show
                if (getPhase() === 0) {
                    const newPassengers = passengersAtOrigin.filter(passenger => passenger.UserId !== passengerId);
                    setPassengersAtOrigin(newPassengers);
                } else if (getPhase() === 1) {
                    const newPassengers = passengersPickup.filter(passenger => passenger.UserId !== passengerId);
                    setPassengersPickup(newPassengers);
                }
            }
        });
    };



    const getPickupPassenger = function () {
        return passengersPickup[0];
    }




    const enableArrived = function () {
        ridesAPI.getTripTotals(tripDetails.id).then((totals) => {
            setTripTotals(totals);
        });
    }

    const [ratings, setRatings] = useState([]);

    const generateRatings = function () {
        const ratingsArray = tripDetails.passengers.map((passenger, index) => {
            return {
                id: passenger.UserId,
                stars: 5
            }
        });

        setRatings(ratingsArray);

        return true;
    }

    function setRating(UserId, stars) {
        const newRatings = ratings.filter((r) => r.id !== UserId);
        newRatings.push({
            id: UserId,
            stars: stars
        });
        setRatings(newRatings);
    }

    const submitRatings = function () {
        ridesAPI.submitDriverRatings(tripId, ratings).then(function () {
            // ratings submitted
            navigation.navigate('Home', { screen: 'User Home' });
        }).catch((err) => console.log(err))
    }

    const mapViewRef = useRef(null);
    const onMarkerLayout = () => {
        mapViewRef.current.fitToSuppliedMarkers(["from"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    }

    const Timer = function ({ tripDate }) {
        let date1Ms = (new Date()).getTime();
        let date2Ms = (new Date(tripDate)).getTime();

        // Calculate the difference in milliseconds
        let timeDifferenceMs = date2Ms - date1Ms;

        // Convert milliseconds to seconds
        let secs = Math.floor(timeDifferenceMs / 1000);
        const [countdown, setCountdown] = useState(Math.max(0, secs + 300));

        // const [seconds, setSeconds] = useState(secs + 300); // 5 minutes in seconds
        useEffect(function () {
            if (!countdown) return;
            const interval = setInterval(function () {
                if (countdown > 0) {
                    setCountdown(prevSeconds => {
                        return prevSeconds - 1;
                    });
                }
            }, 1000);

            return () => clearInterval(interval);
        }, [countdown]);

        const displayTime = function () {
            const minutes = Math.floor(countdown / 60);
            const remainingSeconds = countdown % 60;

            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(remainingSeconds).padStart(2, '0');

            return `${formattedMinutes}:${formattedSeconds}`;
        };

        return (
            <>
                <Text style={[styles.text, styles.bold, styles.font28, styles.primary]}>{displayTime()}</Text>
            </>
        );
    }

    return (
        <ScreenWrapper screenName={t('manage_trip')} navType={"back"} navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    !loading &&
                    <>
                        <View style={[styles.w100, styles.fullCenter, styles.mb10]}>
                            {getPhase() !== 4 &&
                                <>
                                    <LiveAnimation width={75} height={75} />
                                    <Text style={[styles.text, styles.bold, styles.font28, styles.textCenter]}>
                                        {
                                            getPhase() === 0 ? t('wait_starting') :
                                                getPhase() === 1 ? t('head_pickup') :
                                                    getPhase() === 2 ? t('go_destination') : t('collect_payment')
                                        }
                                    </Text>
                                </>
                            }
                            {getPhase() === 0 &&
                                <Timer tripDate={tripDetails.datetime} />
                            }
                        </View>

                        {passengersAtOrigin && getPhase() === 0 &&
                            passengersAtOrigin.map((data, index) => {
                                let borderTopWidth = 1;
                                if (index == 0) {
                                    borderTopWidth = 0;
                                }

                                return (
                                    <>
                                        <View key={"passenger" + index} style={[styles.w100, styles.border1, styles.borderLight, styles.mv10]}>
                                            <Passenger borderTopWidth={borderTopWidth} data={data}>
                                            </Passenger>

                                            {
                                                data.status === 'CONFIRMED' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={function () { checkIn(data.UserId) }} style={[manageTripStyles.manageBtn, styles.bgAccent]} activeOpacity={0.9}>
                                                    <Text style={[styles.text, manageTripStyles.manageBtnText]}>{t('check_in')}</Text>
                                                </TouchableOpacity>
                                            }
                                            {
                                                data.status === 'CONFIRMED' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={function () { noShow(data.UserId) }} style={[manageTripStyles.manageBtn, styles.bgRed]} activeOpacity={0.9}>
                                                    {/* <MaterialIcons name="close" size={14} color={palette.white} /> */}
                                                    <Text style={[styles.text, manageTripStyles.manageBtnText]}>{t('no_show')}</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </>
                                );
                            })
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
                                    initialRegion={{
                                        ...location,
                                        latitudeDelta: 0.0922, // Adjust as needed
                                        longitudeDelta: 0.0421, // Adjust as needed        
                                    }}
                                    ref={mapViewRef}
                                >
                                    <Marker key={"markerFrom"} identifier='from' coordinate={{ latitude: parseFloat(getPickupPassenger().pickupLocationLat), longitude: parseFloat(getPickupPassenger().pickupLocationLng), longitudeDelta: 0.2, latitudeDelta: 0.2 }} onLayout={onMarkerLayout}></Marker>
                                </MapView>

                                <ArrowButton bgColor={palette.light} text={t('directions_to_pickup')} onPress={() => getDirections(getPickupPassenger().pickupLocationLat, getPickupPassenger().pickupLocationLng, `Pick ${getPickupPassenger().User.firstName} Up`)} />

                                <View style={[styles.flexRow, styles.fullCenter]}>
                                    <View style={[styles.border2, styles.fullCenter, { height: 75 * rem, width: 75 * rem, borderRadius: 75 * rem / 2 }]}>
                                        <FastImage source={{ uri: getPickupPassenger().User.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
                                    </View>
                                    <View style={[styles.ml10]}>
                                        <Text style={[styles.text, styles.mb5, styles.font14]}>{t('picking_up')}</Text>
                                        <Text style={[styles.text, styles.bold, styles.font18]}>
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

                        {
                            getPhase() === 2 &&
                            <>
                                <MapView
                                    style={[{ height: 200 * rem }, styles.w100]}
                                    showsUserLocation={true}
                                    provider={PROVIDER_GOOGLE}
                                    customMapStyle={customMapStyle}
                                    showsMyLocationButton
                                    maxZoomLevel={18}
                                    region={{
                                        ...location,
                                        latitudeDelta: 0.0922, // Adjust as needed
                                        longitudeDelta: 0.0421, // Adjust as needed        
                                    }}
                                    ref={currentMapRef}
                                >
                                    <Marker onLayout={fitToSuppliedMarkers} key={"markerFrom"} pinColor={palette.primary} identifier='from' coordinate={{ latitude: tripDetails.fromLatitude, longitude: tripDetails.fromLongitude }}>

                                    </Marker>
                                    <Marker onLayout={fitToSuppliedMarkers} key={"markerTo"} identifier='to' coordinate={{ latitude: tripDetails.toLatitude, longitude: tripDetails.toLongitude }}>

                                    </Marker>
                                    <Polyline strokeColors={[palette.secondary, palette.primary]} coordinates={decodePolyline(tripDetails.polyline)} strokeWidth={3} />

                                </MapView>

                                <ArrowButton bgColor={palette.light} text={`Directions to ${tripDetails.mainTextTo}`} onPress={() => getDirections(tripDetails.toLatitude, tripDetails.toLongitude, `Arrive at ${tripDetails.mainTextTo}`)} />
                                <Button bgColor={palette.accent} textColor={palette.white} text={`Next`} onPress={enableArrived} />
                            </>
                        }

                        {
                            getPhase() === 3 &&
                            <>
                                {
                                    tripTotals.map((data, index) => {
                                        const passenger = tripDetails.passengers.find((p) => {
                                            return (p.UserId == data.id);
                                        });

                                        return (
                                            <View key={`totals${index}`} style={[styles.flexRow, styles.alignCenter, styles.w100, styles.borderLight, styles.pv8, { borderTopWidth: index === 0 ? 0 : 1 }]}>
                                                <View style={[styles.border2, styles.fullCenter, { height: 75 * rem, width: 75 * rem, borderRadius: 75 * rem / 2 }]}>
                                                    <FastImage source={{ uri: passenger.User.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
                                                </View>
                                                <View style={[styles.ml10]}>
                                                    <Text style={[styles.text, styles.mb5, styles.font14]}>
                                                        {
                                                            passenger.paymentMethod === 'CASH' ? `${t('collect_payment_from')}` : t('good_to_go')
                                                        }
                                                    </Text>
                                                    <Text style={[styles.text, styles.bold, styles.font18]}>
                                                        {
                                                            passenger.User.firstName
                                                        }
                                                        &nbsp;
                                                        {
                                                            passenger.User.lastName
                                                        }
                                                    </Text>
                                                    <Text style={[styles.text]}>
                                                        {
                                                            passenger.paymentMethod === 'CASH' ? `${Math.ceil(data.grandTotal / 100)} ${t('EGP')}` : t('paid_card')
                                                        }
                                                    </Text>
                                                </View>
                                                <View style={styles.flexOne} />
                                                <TouchableOpacity disabled={hasPassengerPaid(passenger.UserId)} onPress={function () { setPassengerPaid(passenger.UserId) }} style={[{ width: 44 * rem, height: 44 * rem, alignSelf: 'center' }, styles.br8, styles.fullCenter, hasPassengerPaid(passenger.UserId) ? styles.bgSuccess : styles.bgLight]}>
                                                    <MaterialIcons name="check" size={22} color={palette.white} />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }

                                <Button onPress={checkOut} bgColor={palette.success} textColor={palette.white} text={t('confirm_collections')} disabled={(paidPassengers.length !== (tripDetails.passengers.filter((p) => (p.status !== 'NOSHOW' && p.status !== 'CANCELLED' && p.paymentMethod === 'CASH'))).length)} />
                            </>
                        }

                        {
                            getPhase() === 4 &&
                            <>
                                <Text style={[styles.text, styles.headerText, styles.primary]}>{t('ratings')}</Text>
                                <Text style={[styles.text, styles.smallText, styles.dark]}>{t('ratings_text')}</Text>
                                <View style={[styles.w100, styles.mt10]}>
                                    {
                                        tripDetails.passengers.map((passenger, index) => {

                                            return (
                                                <View key={`reviews${index}`} style={[styles.flexRow, styles.alignCenter, styles.w100, styles.borderLight, styles.pv8, { borderTopWidth: index === 0 ? 0 : 1 }]}>
                                                    <View style={[styles.border2, styles.fullCenter, { height: 75 * rem, width: 75 * rem, borderRadius: 75 * rem / 2 }]}>
                                                        <FastImage source={{ uri: passenger.User.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
                                                    </View>
                                                    <View style={[styles.ml10]}>
                                                        <Text style={[styles.text, styles.bold, styles.font18]}>
                                                            {
                                                                passenger.User.firstName
                                                            }
                                                            &nbsp;
                                                            {
                                                                passenger.User.lastName
                                                            }
                                                        </Text>

                                                        <View style={[styles.flexRow]}>
                                                            {
                                                                Array.from({ length: ratings.find(r => r.id === passenger.UserId).stars }, (_, index2) => (
                                                                    <TouchableOpacity onPress={() => setRating(passenger.UserId, index2 + 1)} key={"ratingStarPassenger" + index2 + "_" + passenger.UserId}>
                                                                        <MaterialIcons name="star" size={30} color={palette.secondary} />
                                                                    </TouchableOpacity>
                                                                ))
                                                            }

                                                            {
                                                                Array.from({ length: (5 - (ratings.find(r => r.id === passenger.UserId).stars)) }, (_, index2) => (
                                                                    <TouchableOpacity onPress={() => setRating(passenger.UserId, ratings.find(r => r.id === passenger.UserId).stars + index2 + 1)} key={"ratingStarPassenger" + (ratings.find(r => r.id === passenger.UserId).stars + index2) + "_" + passenger.UserId}>
                                                                        <MaterialIcons name="star" size={30} color={palette.light} />
                                                                    </TouchableOpacity>
                                                                ))
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>

                                <Button bgColor={palette.accent} textColor={palette.white} text={t('end_ride')} onPress={submitRatings} />
                            </>
                        }

                        {getPhase() === 0 &&
                            <Text style={[styles.text, styles.bold, styles.smallText, styles.dark, styles.fullCenter, styles.textCenter, styles.mt10]}>
                                {t('please_press')} <Text style={styles.accent}>{t('check_in')}</Text> {t('passenger_in_car')} <Text style={styles.error}>{t('red_x_button')}</Text>.
                            </Text>
                        }

                        {getPhase() === 2 &&
                            <Text style={[styles.text, styles.bold, styles.smallText, styles.dark, styles.fullCenter, styles.textCenter, styles.mt10]}>
                                {t('please_press')} <Text style={styles.accent}>{t('next')}</Text> {t('arrive_at_dest')}
                            </Text>
                        }

                        {getPhase() === 3 &&
                            <Text style={[styles.text, styles.bold, styles.smallText, styles.dark, styles.fullCenter, styles.textCenter, styles.mt10]}>
                                {t('please_press')} <Text style={styles.success}>{t('confirm_collections')}</Text> {t('receive_payments')}
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
        ...styles.p16,
        // ...styles.br8,
    },

    manageBtnText: {
        ...styles.bold,
        ...styles.white
    }
});


export default ManageTrip;
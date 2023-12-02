import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    Linking,
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
import { containerStyle, customMapStyle, getDirections, mapPadding, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import LiveAnimation from '../../components/LiveAnimation';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import ArrowButton from '../../components/ArrowButton';
import Button from '../../components/Button';
import { getOptimalPath } from '../../api/googlemaps';
import { decodePolyline } from '../../util/maps';

const Timer = function () {
    const [seconds, setSeconds] = useState(300); // 5 minutes in seconds

    useEffect(function () {
        const interval = setInterval(function () {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    const displayTime = function () {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

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


function ManageTrip({ route, navigation }) {
    const { tripId } = route.params;

    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [passengersAtOrigin, setPassengersAtOrigin] = useState([]);
    const [passengersPickup, setPassengersPickup] = useState([]);
    const [location, setLocation] = useState({});
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

    const fitToSuppliedMarkers = function () {
        if (!currentMapRef.current) return;
        currentMapRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
    };

    const requestLocationPermission = async function () {
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

    useEffect(function () {
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

    const getPhase = function () {
        if (!passengersAtOrigin) {
            return 0;
        }
        return reviewsOpen ? 4 : tripTotals ? 3 : (passengersAtOrigin.length > 0 ? 0 : (passengersPickup.length > 0 ? 1 : 2));
    }

    function checkIn(passengerId) {
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

    function noShowConfirmed(passengerId) {
        ridesAPI.noShow(passengerId, tripId).then(data => {
            if (data) {
                // set no show
            }
        });
    };



    const getPickupPassenger = function () {
        return passengersPickup[0];
    }

    const { t } = useTranslation();



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
                                            getPhase() === 0 ? 'Wait at Starting Point' :
                                                getPhase() === 1 ? 'Head to Pick Up Point' :
                                                    getPhase() === 2 ? 'Go to Destination' : 'Collect Payment'
                                        }
                                    </Text>
                                </>
                            }
                            {getPhase() === 0 &&
                                <Timer />
                            }
                        </View>

                        {passengersAtOrigin && getPhase() === 0 &&
                            passengersAtOrigin.map((data, index) => {
                                let borderTopWidth = 1;
                                if (index == 0) {
                                    borderTopWidth = 0;
                                }

                                return (
                                    <View key={"passenger" + index} style={[styles.w100, styles.border1, styles.borderLight, styles.br8]}>
                                        <Passenger borderTopWidth={borderTopWidth} data={data}>
                                            {
                                                data.status === 'CONFIRMED' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={function () { checkIn(data.UserId) }} style={[manageTripStyles.manageBtn, styles.bgSecondary]} activeOpacity={0.9}>
                                                    <Text style={[styles.text, manageTripStyles.manageBtnText]}>{t('check_in')}</Text>
                                                </TouchableOpacity>
                                            }
                                            {
                                                data.status === 'CONFIRMED' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={function () { noShow(data.UserId) }} style={[manageTripStyles.manageBtn, styles.ml5, styles.bgRed]} activeOpacity={0.9}>
                                                    <MaterialIcons name="close" size={14} color={palette.white} />
                                                </TouchableOpacity>
                                            }
                                        </Passenger>
                                    </View>
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
                                    initialRegion={location}
                                >
                                    <Marker key={"markerFrom"} identifier='from' coordinate={{ latitude: getPickupPassenger().pickupLocationLat, longitude: getPickupPassenger().pickupLocationLng }}></Marker>
                                    {getPickupPassenger() &&
                                        <MapViewDirections
                                            origin={`${location.latitude},${location.longitude}`}
                                            destination={`${getPickupPassenger().pickupLocationLat},${getPickupPassenger().pickupLocationLng}`}
                                            apikey='AIzaSyARuF4cAG9F8ay2EHiWYdz4Oge7XyDlTQc'
                                            strokeWidth={3}
                                            strokeColor={palette.accent}
                                        />}
                                </MapView>

                                <ArrowButton bgColor={palette.light} text={t('directions_to_pickup')} onPress={() => getDirections(getPickupPassenger().pickupLocationLat, getPickupPassenger().pickupLocationLng, `Pick ${getPickupPassenger().User.firstName} Up`)} />

                                <View style={[styles.flexRow, styles.fullCenter]}>
                                    <View style={[styles.border2, styles.fullCenter, { height: 75 * rem, width: 75 * rem, borderRadius: 75 * rem / 2 }]}>
                                        <Image source={{ uri: getPickupPassenger().User.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
                                    </View>
                                    <View style={[styles.ml10]}>
                                        <Text style={[styles.text, styles.mb5, styles.font14]}>You're picking up</Text>
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
                                    initialRegion={location}
                                    ref={currentMapRef}
                                >
                                    <Marker onLayout={fitToSuppliedMarkers} key={"markerFrom"} pinColor={palette.primary} identifier='from' coordinate={{ latitude: tripDetails.fromLatitude, longitude: tripDetails.fromLongitude }}></Marker>
                                    <Marker onLayout={fitToSuppliedMarkers} key={"markerTo"} identifier='to' coordinate={{ latitude: tripDetails.toLatitude, longitude: tripDetails.toLongitude }}></Marker>
                                    <Polyline strokeColors={[palette.secondary, palette.primary]} coordinates={decodePolyline(tripDetails.polyline)} strokeWidth={3} />

                                </MapView>

                                <ArrowButton bgColor={palette.light} text={`Directions to ${tripDetails.mainTextTo}`} onPress={() => getDirections(tripDetails.toLatitude, tripDetails.toLongitude, `Arrive at ${tripDetails.mainTextTo}`)} />
                                <Button bgColor={palette.secondary} textColor={palette.white} text={`Next`} onPress={enableArrived} />
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
                                                    <Image source={{ uri: passenger.User.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
                                                </View>
                                                <View style={[styles.ml10]}>
                                                    <Text style={[styles.text, styles.mb5, styles.font14]}>
                                                        {
                                                            passenger.paymentMethod === 'CASH' ? 'Collect payment from' : 'Good to go'
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
                                                            passenger.paymentMethod === 'CASH' ? `${data.grandTotal} ${t('EGP')}` : 'paid using their card'
                                                        }
                                                    </Text>
                                                </View>
                                                <View style={styles.flexOne} />
                                                <TouchableOpacity disabled={hasPassengerPaid(passenger.UserId)} onPress={function () { setPassengerPaid(passenger.UserId) }} style={[{ width: 44 * rem, height: 44 * rem, alignSelf: 'center' }, styles.br8, styles.fullCenter, hasPassengerPaid(passenger.UserId) ? styles.bgDark : styles.bgSuccess]}>
                                                    <MaterialIcons name="check" size={22} color={palette.white} />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }

                                <Button onPress={checkOut} bgColor={palette.secondary} textColor={palette.white} text={'Confirm Collections'} disabled={paidPassengers.length !== (tripDetails.passengers.filter((p) => p.paymentMethod === 'CASH')).length} />
                            </>
                        }

                        {
                            getPhase() === 4 &&
                            <>
                                <Text style={[styles.text, styles.headerText, styles.primary]}>Ratings</Text>
                                <Text style={[styles.text, styles.smallText, styles.dark]}>Please take a moment to rate the passengers you've taken this ride with. This helps us keep up the integrity of our market!</Text>
                                <View style={[styles.w100, styles.mt10]}>
                                    {
                                        tripDetails.passengers.map((passenger, index) => {

                                            return (
                                                <View key={`reviews${index}`} style={[styles.flexRow, styles.alignCenter, styles.w100, styles.borderLight, styles.pv8, { borderTopWidth: index === 0 ? 0 : 1 }]}>
                                                    <View style={[styles.border2, styles.fullCenter, { height: 75 * rem, width: 75 * rem, borderRadius: 75 * rem / 2 }]}>
                                                        <Image source={{ uri: passenger.User.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
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
                                                                        <MaterialIcons name="star" size={30} color={palette.primary} />
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

                                <Button bgColor={palette.secondary} textColor={palette.white} text="End Ride" onPress={submitRatings} />
                            </>
                        }

                        {getPhase() === 0 &&
                            <Text style={[styles.text, styles.bold, styles.smallText, styles.dark, styles.fullCenter, styles.textCenter, styles.mt10]}>
                                Please press the <Text style={styles.secondary}>Check In</Text> button when the passenger has gotten in the car. If a passenger fails to show up on time (within the waiting period), press the <Text style={styles.error}>Red X button</Text>.
                            </Text>
                        }

                        {getPhase() === 2 &&
                            <Text style={[styles.text, styles.bold, styles.smallText, styles.dark, styles.fullCenter, styles.textCenter, styles.mt10]}>
                                Please press the <Text style={styles.secondary}>Next</Text> button when you have arrived at the destination. After that, please check the passengers out.
                            </Text>
                        }

                        {getPhase() === 3 &&
                            <Text style={[styles.text, styles.bold, styles.smallText, styles.dark, styles.fullCenter, styles.textCenter, styles.mt10]}>
                                Please press the <Text style={styles.secondary}>Confirm Collections</Text> button when you receive payments from everyone paying in cash.
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
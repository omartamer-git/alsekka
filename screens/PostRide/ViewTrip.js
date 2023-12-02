import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import ArrowButton from '../../components/ArrowButton';
import AvailableRide from '../../components/AvailableRide';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import Passenger from '../../components/Passenger';
import { addSecondsToDate, customMapStyle, getDateTime, getDirections, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';


function ViewTrip({ route, navigation }) {
    const { tripId } = route.params;
    const [tripDetails, setTripDetails] = useState(null);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [location, setLocation] = useState(null);
    const [objDate, setObjDate] = useState(new Date());
    const [isDriver, setIsDriver] = useState(false);

    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [cancelledModalVisible, setCancelledModalVisible] = useState(false);

    const [cancelRideModalVisible, setCancelRideModalVisible] = useState(false);
    // const [cancelledModalVisible, setCancelledModalVisible] = useState(false);

    const [tripReady, setTripReady] = useState(false);
    const [tripCancellable, setTripCancellable] = useState(false);
    const [tripStatus, setTripStatus] = useState('SCHEDULED');
    const [loading, setLoading] = useState(true);

    const mapViewRef = useRef(null);

    useEffect(function () {
        Geolocation.getCurrentPosition(
            info => {
                setLocation({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude
                });
            }
        );

        setLoading(true);
        ridesAPI.tripDetails(tripId).then(
            data => {
                setTripDetails(data);
                setIsDriver(data.isDriver === 1);
                setObjDate(new Date(data.datetime));
                setMarkerFrom({ latitude: data.fromLatitude, longitude: data.fromLongitude });
                setMarkerTo({ latitude: data.toLatitude, longitude: data.toLongitude });
                fitMarkers();
                setTripStatus(data.status);

                const fullStars = Math.floor(data.Driver.rating);
                const halfStars = Math.ceil(data.Driver.rating) - Math.abs(data.Driver.rating);

                let ratingsItems = [];
                for (let i = 0; i < fullStars; i++) {
                    ratingsItems.push(<MaterialIcons key={"fullStar" + i} name="star" color={palette.secondary} />);
                }

                for (let j = 0; j < halfStars; j++) {
                    ratingsItems.push(<MaterialIcons key={"halfStar" + j} name="star-half" color={palette.secondary} />);
                }

                setRatings(ratingsItems);
                setLoading(false);
            }
        );

    }, []);

    useEffect(function () {
        const currDate = new Date();
        const objDateTime = objDate.getTime();
        const currTime = currDate.getTime();
        const timeToTrip = objDateTime - currTime;
        if (timeToTrip < 1000 * 60 * 60) { // within an hour, or time has already passed
            setTripReady(true);
        } else {
            setTripReady(false);
        }

        if (timeToTrip >= 1000 * 60 * 60 * 36) {
            setTripCancellable(true);
        } else {
            setTripCancellable(false);
        }
    }, [objDate]);

    const fitMarkers = function () {
        if (mapViewRef) {
            mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
        }
    };

    const cancelRide = function () {
        ridesAPI.cancelRide(tripId).then(data => {
            setCancelRideModalVisible(false);
            setTripStatus('CANCELLED');
        });
    };

    const cancelPassenger = function () {
        setCancelModalVisible(false);
        ridesAPI.cancelPassenger(tripId).then(() => setCancelledModalVisible(true));
    };

    const startTrip = function () {
        ridesAPI.startRide(tripId).then(data => {
            if (data) {
                setTripStatus('ONGOING');
            }
        });
    };

    const manageTrip = function () {
        navigation.navigate('Manage Trip', { tripId: tripId });
    };

    function goToChat(receiver) {
        navigation.navigate('Chat', { receiver: receiver });
    };

    const { t } = useTranslation();
    return (
        <>
            <ScreenWrapper screenName={t('view_trip')} navAction={() => navigation.goBack()} navType="back">
                <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={[styles.flexGrow]}>

                    <MapView
                        style={[styles.mapStyle]}
                        showUserLocation={true}
                        region={location}
                        provider={PROVIDER_GOOGLE}
                        ref={mapViewRef}
                        customMapStyle={customMapStyle}
                    >
                        {markerFrom && <Marker identifier="from" coordinate={markerFrom} pinColor="blue" onLayout={fitMarkers} />}
                        {markerTo && <Marker identifier="to" coordinate={markerTo} onLayout={fitMarkers} />}
                    </MapView>

                    {
                        !loading &&
                        <>
                            {
                                tripDetails &&
                                <AvailableRide
                                    style={viewTripStyles.availableRide}
                                    model={tripDetails.Car.model}
                                    brand={tripDetails.Car.brand}
                                    fromAddress={tripDetails.mainTextFrom}
                                    toAddress={tripDetails.mainTextTo}
                                    seatsOccupied={tripDetails.seatsOccupied}
                                    DriverId={tripDetails.DriverId}
                                    seatsAvailable={tripDetails.seatsAvailable}
                                    duration={tripDetails.duration}
                                    pricePerSeat={tripDetails.pricePerSeat}
                                    pickupEnabled={tripDetails.pickupEnabled}
                                    gender={tripDetails.gender}
                                    date={objDate} />
                            }
                            <View style={[styles.defaultPadding, styles.bgLightGray, styles.w100, styles.fullCenter, styles.flexOne, { zIndex: 5 }]}>
                                {tripDetails &&
                                    <View style={[styles.flexRow, styles.w100, styles.fullCenter, styles.mv5, styles.justifyStart]}>
                                        <View style={viewTripStyles.profilePictureView}>
                                            <Image source={{ uri: tripDetails.Driver.profilePicture }} style={viewTripStyles.profilePicture} />
                                            {
                                                !isDriver &&
                                                <>
                                                    <TouchableOpacity activeOpacity={0.9} style={[viewTripStyles.chatBubble, styles.positionAbsolute, { top: '100%', transform: [{ translateY: -33 * rem }, { translateX: 22 * rem }] }]} onPress={() => goToChat(tripDetails.Driver.id)} >
                                                        <MaterialIcons name="chat-bubble" size={15} color={palette.primary} />
                                                    </TouchableOpacity>
                                                </>
                                            }
                                        </View>
                                        <View style={[styles.alignStart, styles.justifyStart, styles.ml10, styles.flexOne]}>
                                            <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.text, styles.headerText3]}>{isDriver ? t('youre_driving') : tripDetails.Driver.firstName}</Text>
                                            <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.text, styles.dark, styles.semiBold]}>{tripDetails.Car.color} {tripDetails.Car.brand} {tripDetails.Car.model} ({tripDetails.Car.year})</Text>
                                            <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.text, styles.dark, styles.bold]}>{tripDetails.Car.licensePlateLetters.split('').join(' ')} - {tripDetails.Car.licensePlateNumbers}</Text>
                                            <View style={styles.flexRow}>
                                                {ratings}
                                            </View>
                                        </View>

                                        {!isDriver &&
                                            <View style={[styles.ml10, styles.flexRow]}>
                                                {tripDetails.Driver.phone && (tripStatus === "SCHEDULED" || tripStatus === "ONGOING") &&
                                                    <TouchableOpacity activeOpacity={0.9} style={[viewTripStyles.chatBubble, viewTripStyles.biggerBubble]} onPress={() => Linking.openURL(`tel:${tripDetails.Driver.phone}`)} >
                                                        <MaterialIcons name="phone" size={22} color={palette.primary} />
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        }
                                    </View>
                                }


                                {
                                    isDriver && !tripReady && tripDetails.passengers.length > 0 &&
                                    <View style={[styles.w100, styles.border1, styles.borderLight, styles.br8]}>
                                        {
                                            tripDetails.passengers.map((data, index) => {
                                                let borderTopWidth = 1;
                                                if (index == 0) {
                                                    borderTopWidth = 0;
                                                }
                                                return (
                                                    <Passenger key={"passenger" + index} borderTopWidth={borderTopWidth} data={data}>
                                                        <View style={[styles.flexRow, styles.alignCenter]}>
                                                            <TouchableOpacity activeOpacity={0.9} style={styles.mr10} onPress={() => goToChat(data.userId)}>
                                                                <MaterialIcons name="chat-bubble" size={24} color={palette.secondary} />
                                                            </TouchableOpacity>
                                                            <MaterialIcons name="phone" size={24} color={palette.secondary} style={styles.ml10} />
                                                        </View>
                                                    </Passenger>
                                                );
                                            })
                                        }
                                    </View>
                                }
                                {
                                    !isDriver &&
                                    <View style={[styles.w100, styles.mt10]}>
                                        {tripDetails.passenger.pickupLocationLat &&
                                            <Text style={[styles.text]}>{tripDetails.Driver.firstName} {t('is_picking_up')}!</Text>}
                                        <View style={[styles.w100, styles.flexRow, styles.justifyStart, styles.alignStart, styles.mt5]}>
                                            {(tripStatus == "SCHEDULED" || tripStatus == "ONGOING") &&
                                                <ArrowButton onPress={() => getDirections(
                                                    tripDetails.passenger.pickupLocationLat ? tripDetails.passenger.pickupLocationLat : markerFrom.latitude,
                                                    tripDetails.passenger.pickupLocationLng ? tripDetails.passenger.pickupLocationLng : markerFrom.longitude,
                                                    "Directions to pick up")} style={[styles.flexOne]} bgColor={palette.light} text={t('directions_to_pickup')} />
                                            }
                                            {
                                                tripStatus === 'SCHEDULED' &&

                                                <View style={[styles.alignCenter, styles.justifyStart, styles.ml10, { marginTop: 8 * rem, marginBottom: 8 * rem }]}>
                                                    <TouchableOpacity onPress={() => setCancelModalVisible(true)} style={{ backgroundColor: palette.light, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1, width: 44 * rem, height: 44 * rem }}>
                                                        <MaterialIcons name="close" size={25} />
                                                    </TouchableOpacity>
                                                    <Text style={[styles.text, styles.smallText, styles.black, { marginTop: 2 * rem }]}>{t('cancel_seat')}</Text>
                                                </View>
                                            }
                                        </View>

                                    </View>
                                }
                                {
                                    isDriver &&
                                    <View style={[styles.w100, styles.fullCenter]}>
                                        {tripStatus === 'SCHEDULED' && tripReady && <Button bgColor={palette.secondary} text={t('start_ride')} textColor={palette.white} onPress={startTrip} />}

                                        {tripStatus === 'SCHEDULED' && !tripReady && <Button bgColor={palette.red} text={t('cancel_ride')} textColor={palette.white} onPress={() => setCancelRideModalVisible(true)} />}

                                        {tripStatus === 'ONGOING' && <Button bgColor={palette.secondary} text={t('manage_trip')} textColor={palette.white} onPress={manageTrip} />}

                                        {tripStatus === 'CANCELLED' && <Button bgColor={palette.primary} text={t('trip_cancelled')} textColor={palette.white} onPress={function () { }} />}

                                    </View>
                                }
                            </View>

                            <BottomModal modalVisible={cancelRideModalVisible} onHide={() => setCancelRideModalVisible(false)}>
                                <View style={[styles.w100, styles.alignCenter, styles.justifyCenter, styles.pv16]}>
                                    <Text style={[styles.text, styles.font28, styles.bold, styles.textCenter]}>
                                        {t('cancel_confirm')}
                                    </Text>

                                    <Button onPress={cancelRide} text={t('cancel_ride')} bgColor={palette.red} textColor={palette.white} />
                                    <Button onPress={() => setCancelRideModalVisible(false)} text={t('back')} bgColor={palette.primary} textColor={palette.white} />
                                </View>
                            </BottomModal>
                        </>

                    }

                    {
                        loading &&
                        <>
                            <View style={styles.w100}>
                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item height={140 * rem} marginBottom={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width='90%' alignSelf='center' marginVertical={5 * rem} height={80 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width='90%' alignSelf='center' marginVertical={5 * rem} height={44 * rem} />
                                </SkeletonPlaceholder>
                            </View>
                        </>
                    }

                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setCancelModalVisible(false)} modalVisible={cancelModalVisible}>
                <View style={[styles.w100, styles.flexOne, styles.fullCenter, styles.pv24, styles.ph16]}>
                    <Text style={[styles.text, styles.headerText3, styles.mv5, styles.textCenter]}>{t('cancel_confirm')}</Text>
                    {/* English Only Text */}
                    <Text style={[styles.text, styles.textCenter]}>You can cancel for free up until {getDateTime(addSecondsToDate(objDate, -(24 * 60 * 60)))}, after that you will be charged the full price of the ride.</Text>
                    <Button style={[styles.mt15]} bgColor={palette.primary} textColor={palette.white} text={t('back')} onPress={() => setCancelModalVisible(false)} />
                    <Button bgColor={palette.red} textColor={palette.white} text={t('cancel_seat')} onPress={cancelPassenger} />
                </View>
            </BottomModal>

            <BottomModal modalVisible={cancelledModalVisible} onHide={function () { setCancelledModalVisible(false); navigation.goBack() }}>
                <View style={[styles.w100, styles.flexOne, styles.fullCenter, styles.pv24, styles.ph16]}>
                    <Text style={[styles.text, styles.headerText3, styles.mv5]}>Ride Cancelled</Text>
                    <Text style={[styles.text, styles.textCenter]}>Your ride has been canceled. If you have any concerns or need assistance, feel free to reach out to us. Safe travels and thank you for using seaats.</Text>
                    <Button style={[styles.mt15]} bgColor={palette.primary} textColor={palette.white} text={t('back')} onPress={() => navigation.goBack()} />
                </View>
            </BottomModal>
        </>
    );
}

const viewTripStyles = StyleSheet.create({
    availableRide: {
        ...styles.mb10,
        ...styles.br0,
        ...styles.bgWhite,
        minHeight: 140 * rem
    },

    profilePictureView: {
        width: 80 * rem,
        height: 80 * rem,
        borderRadius: 80 * rem / 2,
        ...styles.borderPrimary,
        ...styles.border3,
        ...styles.fullCenter
    },

    profilePicture: {
        height: 75 * rem,
        width: 75 * rem,
        resizeMode: 'center',
        borderRadius: 75 * rem / 2,
        ...styles.border2,
        ...styles.borderWhite
    },

    chatBubble: {
        width: 44 * rem,
        height: 44 * rem,
        borderRadius: 44 * rem / 2,
        ...styles.bgWhite,
        ...styles.fullCenter,
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    },

    biggerBubble: {
        width: 55 * rem,
        height: 55 * rem,
        borderRadius: 55 * rem / 2,
    }
});

export default ViewTrip;
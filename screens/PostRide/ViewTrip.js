import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    I18nManager,
    Image,
    Linking,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import ArrowButton from '../../components/ArrowButton';
import AvailableRide from '../../components/AvailableRide';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import CarMarker from '../../components/CarMarker';
import Passenger from '../../components/Passenger';
import { addSecondsToDate, customMapStyle, getDirections, palette, rem, styles, translateDate, translatedFormat } from '../../helper';
import { getDeviceLocation } from '../../util/location';
import { decodePolyline } from '../../util/maps';
import ScreenWrapper from '../ScreenWrapper';
import FastImage from 'react-native-fast-image';
import { Triangle } from '../../components/Triangle';
import BottomModalSheet from '../../components/ModalSheet';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';
import Ride from '../../components/Ride';


function ViewTrip({ route, navigation }) {
    const { tripId } = route.params;
    const [tripDetails, setTripDetails] = useState(null);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [location, setLocation] = useState({
        latitude: 30.0444,
        longitude: 31.2357,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
    });
    const [objDate, setObjDate] = useState(new Date());
    const [isDriver, setIsDriver] = useState(false);
    const { dismiss, dismissAll } = useBottomSheetModal();

    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [cancelledModalVisible, setCancelledModalVisible] = useState(false);
    const [cancelRideModalVisible, setCancelRideModalVisible] = useState(false);
    const [costBreakdownModalVisible, setCostBreakdownModalVisible] = useState(false);

    const [tripReady, setTripReady] = useState(false);
    const [tripCancellable, setTripCancellable] = useState(false);
    const [tripStatus, setTripStatus] = useState('SCHEDULED');
    const [loading, setLoading] = useState(true);

    const mapViewRef = useRef(null);

    useEffect(function () {
        getDeviceLocation().then(result => {
            if (result) {
                // setLocation(result);
                setLocation(loc => ({ ...loc, ...result }));
            }
        })

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
                    ratingsItems.push(<MaterialIcons key={"fullStar" + i} name="star" color={palette.accent} />);
                }

                for (let j = 0; j < halfStars; j++) {
                    ratingsItems.push(<MaterialIcons key={"halfStar" + j} name="star-half" color={palette.accent} />);
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

    const [driverLocationMarker, setDriverLocationMarker] = useState(null);
    let timeoutId;
    function updateDriverLocation() {
        ridesAPI.getDriverLocation(tripDetails.id).then(det => {
            setDriverLocationMarker(prevLocation => {
                return ({
                    latitude: det.lat,
                    longitude: det.lng
                })
            }
            );
        });

        timeoutId = setTimeout(() => updateDriverLocation(), 3000);

        // Return the timeoutId so it can be cleared
        return () => clearTimeout(timeoutId);
    }

    useEffect(() => {
        if (isDriver || !tripDetails || tripStatus !== 'ONGOING') {
            return;
        }

        updateDriverLocation();
        return () => clearTimeout(timeoutId);
    }, [isDriver, tripStatus, tripDetails]);


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
                manageTrip();
            }
        });
    };

    const manageTrip = function () {
        navigation.navigate('Manage Trip', { tripId: tripId });
    }

    function goToChat(receiver) {
        navigation.navigate('Chat', { receiver: receiver });
    }

    async function onShare() {
        const shareMsg = "🚗✨ Save on transportation by joining my carpool on Seaats! I'm traveling from " + tripDetails.mainTextFrom + " to " + tripDetails.mainTextTo + ". Click here: https://seaats.app/share/ride/" + tripId + " Let's ride together and cut costs! 🌍💰"
        const shareMsgAr = "🚗✨ وفر في تكاليف التنقل بالانضمام إلى رحلتي في Seaats! أنا مسافر من " + tripDetails.mainTextTo + " إلى " + tripDetails.mainTextFrom + ". اضغط هنا: https://seaats.app/share/ride/" + tripId + " يلا نشارك الرحلة نوفر في المصاريف! 🌍💰";
        try {
            const result = await Share.share({
                message: I18nManager.isRTL ? shareMsgAr : shareMsg
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (err) {
            console.log(err);
        }
    };

    const { t } = useTranslation();
    return (
        <>
            <ScreenWrapper screenName={t('view_trip')} navAction={() => navigation.goBack()} navType="back">
                <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={[styles.flexGrow]}>

                    <MapView
                        style={[styles.mapStyle]}
                        showUserLocation={true}
                        region={{
                            ...location,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        provider={PROVIDER_GOOGLE}
                        ref={mapViewRef}
                        customMapStyle={customMapStyle}
                    >
                        {markerFrom &&
                            <Marker identifier="from" coordinate={markerFrom} pinColor="blue" onLayout={fitMarkers}>
                                <View style={[styles.fullCenter]}>
                                    <View style={[styles.bgPrimary, styles.p8, styles.br16]}>
                                        <Text style={[styles.white, styles.font12]}>{t('pick_up')}</Text>
                                    </View>
                                    <Triangle color={palette.primary} style={{ transform: [{ rotate: "180deg" }] }} />
                                </View>
                            </Marker>
                        }
                        {markerTo &&
                            <Marker identifier="to" coordinate={markerTo} onLayout={fitMarkers}>
                                <View style={[styles.fullCenter]}>
                                    <View style={[styles.bgSecondary, styles.p8, styles.br16]}>
                                        <Text style={[styles.white, styles.font12]}>{t('drop_off')}</Text>
                                    </View>
                                    <Triangle color={palette.secondary} style={{ transform: [{ rotate: "180deg" }] }} />
                                </View>
                            </Marker>
                        }
                        {tripDetails && tripDetails.polyline &&
                            <Polyline strokeColors={[palette.primary, palette.secondary]} coordinates={decodePolyline(tripDetails.polyline)} strokeWidth={3} />
                        }

                        {driverLocationMarker && <CarMarker car={driverLocationMarker} />}
                    </MapView>

                    {
                        !loading &&
                        <>
                            {
                                tripDetails &&
                                <Ride
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
                                    date={objDate}
                                    page={"view_trip"} />
                            }

                            <View style={[styles.defaultPadding, styles.bgLightGray, styles.w100, styles.fullCenter, styles.flexOne, { zIndex: 5 }]}>
                                {tripDetails &&
                                    <View style={[styles.flexRow, styles.w100, styles.fullCenter, styles.mv5, styles.justifyStart]}>
                                        <View style={viewTripStyles.profilePictureView}>
                                            <FastImage source={{ uri: tripDetails.Driver.profilePicture }} style={viewTripStyles.profilePicture} />
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
                                    isDriver && tripDetails.passengers.length > 0 &&
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

                                                            <TouchableOpacity activeOpacity={0.9} style={styles.mr10} onPress={() => goToChat(data.UserId)}>
                                                                <MaterialIcons name="chat-bubble" size={24} color={palette.accent} />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity activeOpacity={0.9} style={styles.mr10} onPress={() => Linking.openURL(`tel:${data.User.phone}`)}>
                                                                <MaterialIcons name="phone" size={24} color={palette.accent} style={styles.ml10} />
                                                            </TouchableOpacity>
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
                                        {
                                            tripDetails.passenger.pickupLocationLat &&
                                            <Text style={[styles.text]}>{tripDetails.Driver.firstName} {t('is_picking_up')}!</Text>
                                        }

                                        {tripDetails.passenger.status !== 'CANCELLED' &&
                                            <>
                                                <View style={[styles.w100, styles.flexRow, styles.justifyStart, styles.alignStart, styles.mt5]}>
                                                    {(tripStatus == "SCHEDULED" || tripStatus == "ONGOING") &&
                                                        <ArrowButton onPress={() => getDirections(
                                                            tripDetails.passenger.pickupLocationLat ? tripDetails.passenger.pickupLocationLat : markerFrom.latitude,
                                                            tripDetails.passenger.pickupLocationLng ? tripDetails.passenger.pickupLocationLng : markerFrom.longitude,
                                                            t('directions_to_pickup'))} style={[styles.flexOne]} bgColor={palette.light} text={t('directions_to_pickup')} />
                                                    }
                                                    {
                                                        tripStatus === 'SCHEDULED' &&
                                                        <View style={[styles.alignCenter, styles.justifyStart, styles.ml10, { marginTop: 8 * rem, marginBottom: 8 * rem }]}>
                                                            <TouchableOpacity onPress={() => setCancelModalVisible(true)} style={[styles.bgLight, styles.br8, styles.fullCenter, styles.flexOne, { width: 44 * rem, height: 44 * rem }]}>
                                                                <MaterialIcons name="close" size={25} />
                                                            </TouchableOpacity>
                                                            <Text style={[styles.text, styles.smallText, styles.black, { marginTop: 2 * rem }]}>{t('cancel_seat')}</Text>
                                                        </View>
                                                    }
                                                </View>

                                                <TouchableOpacity onPress={() => setCostBreakdownModalVisible(true)} style={[styles.w100, styles.mt5, styles.alignEnd]}>
                                                    <Text style={[styles.text, styles.font14]}>
                                                        {t('total')}: <Text style={[styles.bold]}>{(tripDetails.passenger.Invoice.grandTotal / 100).toFixed(2)} {t('EGP')}</Text>
                                                    </Text>
                                                    <Text style={[styles.text, styles.primary, styles.font12]}>{t('view_cost_breakdown')}</Text>
                                                </TouchableOpacity>

                                                {/* <ArrowButton bgColor={palette.light} text={`${t('total')}: ${tripDetails.passenger.Invoice.grandTotal} ${t('EGP')}`} /> */}
                                            </>
                                        }

                                        {
                                            tripDetails.passenger.status === 'CANCELLED' &&
                                            <>
                                                <View style={[styles.w100, styles.justifyStart, styles.alignStart, styles.mt5]}>
                                                    <Button style={styles.w100} disabled textColor={palette.white} bgColor={palette.red} text={t('trip_cancelled')} />
                                                </View>
                                            </>
                                        }
                                    </View>
                                }
                                {
                                    isDriver &&
                                    <View style={[styles.w100, styles.fullCenter]}>
                                        {tripStatus === 'SCHEDULED' && tripReady && <Button bgColor={palette.primary} text={t('start_ride')} textColor={palette.white} onPress={startTrip} />}

                                        {tripStatus === 'SCHEDULED' && !tripReady &&
                                            <View style={[styles.w100, styles.flexRow, styles.fullCenter, styles.gap10]}>
                                                <Button style={[styles.flexOne]} bgColor={palette.red} text={t('cancel_ride')} textColor={palette.white} onPress={() => setCancelRideModalVisible(true)} />
                                                <TouchableOpacity onPress={onShare} activeOpacity={0.75} style={[styles.p8, styles.br8, styles.fullCenter, styles.bgPrimary, { height: 44 * rem, width: 44 * rem }]}>
                                                    <MaterialIcons name={Platform.OS === 'ios' ? "ios-share" : 'share'} color={palette.white} size={16} />
                                                </TouchableOpacity>
                                            </View>
                                        }

                                        {tripStatus === 'ONGOING' && <Button bgColor={palette.primary} text={t('manage_trip')} textColor={palette.white} onPress={manageTrip} />}

                                        {tripStatus === 'CANCELLED' && <Button bgColor={palette.primary} text={t('trip_cancelled')} textColor={palette.white} onPress={function () { }} />}

                                    </View>
                                }
                            </View>

                            <BottomModalSheet snapPoints={['50%']} modalVisible={cancelRideModalVisible} setModalVisible={setCancelRideModalVisible}>
                                <View style={[styles.w100, styles.alignCenter, styles.justifyCenter, styles.pv16]}>
                                    <Text style={[styles.text, styles.font18, styles.bold, styles.textCenter]}>
                                        {t('cancel_confirm')}
                                    </Text>

                                    <Text style={[styles.text, styles.font14, styles.textCenter]}>
                                        {
                                            translatedFormat(
                                                t('cancel_disclaimer_driver'),
                                                [translateDate(addSecondsToDate(objDate, -(48 * 60 * 60)), t).join(" ")]
                                            )
                                        }
                                    </Text>

                                    {objDate && tripDetails &&
                                        (addSecondsToDate(objDate, -(48 * 60 * 60)) <= new Date() && tripDetails.seatsOccupied && addSecondsToDate(new Date(tripDetails.createdAt), (60 * 30)) <= new Date()) ?
                                        <Text style={[styles.error, styles.bold, styles.text, styles.mv5]}>
                                            {t('penalty_cancel')}
                                        </Text>
                                        :
                                        <Text style={[styles.success, styles.bold, styles.text, styles.mv5]}>
                                            {t('free_cancel')}
                                        </Text>
                                    }

                                    <Button onPress={cancelRide} text={t('cancel_ride')} bgColor={palette.red} textColor={palette.white} />
                                    <Button onPress={() => setCancelRideModalVisible(false)} text={t('back')} bgColor={palette.primary} textColor={palette.white} />
                                </View>
                            </BottomModalSheet>

                            {costBreakdownModalVisible &&
                                <BottomModalSheet snapPoints={['40%']} modalVisible={costBreakdownModalVisible} setModalVisible={setCostBreakdownModalVisible}>
                                    <View style={[styles.w100, styles.pv16, styles.ph24]}>
                                        <Text style={[styles.bold, styles.font28, styles.text, styles.primary, styles.mb10]}>{t('bill_summary')}</Text>

                                        <View style={[styles.w100, styles.spaceBetween, styles.flexRow]}>
                                            <Text style={[styles.text, styles.semiBold]}>{t('fare')}:</Text>
                                            <Text style={[styles.text]}>{(tripDetails.passenger.Invoice.totalAmount / 100).toFixed(2)} {t('EGP')} ({(tripDetails.pricePerSeat / 100).toFixed(2)} {t('EGP')} x {tripDetails.passenger.seats})</Text>
                                        </View>

                                        <View style={[styles.w100, styles.spaceBetween, styles.flexRow]}>
                                            <Text style={[styles.text, styles.semiBold]}>{t('service_fees')}:</Text>
                                            <Text style={[styles.text]}>{(tripDetails.passenger.Invoice.passengerFeeTotal / 100).toFixed(2)} {t('EGP')}</Text>
                                        </View>

                                        <View style={[styles.w100, styles.spaceBetween, styles.flexRow]}>
                                            <Text style={[styles.text, styles.semiBold]}>{t('voucher')}:</Text>
                                            <Text style={[styles.text]}>- {(tripDetails.passenger.Invoice.discountAmount / 100).toFixed(2)} {t('EGP')}</Text>
                                        </View>

                                        <View style={[styles.w100, styles.spaceBetween, styles.flexRow]}>
                                            <Text style={[styles.text, styles.semiBold]}>{t('balance')}:</Text>
                                            <Text style={[styles.text]}>{(tripDetails.passenger.Invoice.balanceDue / 100).toFixed(2)} {t('EGP')}</Text>
                                        </View>


                                        <View style={[styles.w100, styles.spaceBetween, styles.flexRow]}>
                                            <Text style={[styles.text, styles.semiBold]}>{t('pickup_fee')}:</Text>
                                            <Text style={[styles.text]}>{(tripDetails.passenger.Invoice.pickupAddition / 100).toFixed(2)} {t('EGP')}</Text>
                                        </View>

                                        <View style={[styles.w100, styles.mv10, { borderWidth: 0.5 }, styles.borderLight]}></View>

                                        <View style={[styles.w100, styles.spaceBetween, styles.flexRow]}>
                                            <Text style={[styles.text, styles.semiBold]}>{t('total')}:</Text>
                                            <Text style={[styles.text]}>{(tripDetails.passenger.Invoice.grandTotal / 100).toFixed(2)} {t('EGP')}</Text>
                                        </View>
                                    </View>
                                </BottomModalSheet>
                            }
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
            </ScreenWrapper >

            {!loading &&
                <BottomModalSheet snapPoints={['40%']} setModalVisible={setCancelModalVisible} modalVisible={cancelModalVisible}>
                    <View style={[styles.w100, styles.flexOne, styles.fullCenter, styles.pv24, styles.ph16]}>
                        <Text style={[styles.text, styles.headerText3, styles.mv5, styles.textCenter]}>{t('cancel_confirm')}</Text>
                        <Text style={[styles.text, styles.textCenter]}>{translatedFormat(t('cancel_disclaimer'), [translateDate(addSecondsToDate(objDate, -(24 * 60 * 60)), t).join(" ")])}</Text>
                        {tripDetails && tripDetails.passenger &&
                            (addSecondsToDate(objDate, -(24 * 60 * 60)) <= new Date() && addSecondsToDate(new Date(tripDetails.passenger.createdAt), (60 * 15)) <= new Date()) ?
                            <Text style={[styles.error, styles.bold, styles.text, styles.mv5]}>
                                {t('penalty_cancel')}
                            </Text>
                            :
                            <Text style={[styles.success, styles.bold, styles.text, styles.mv5]}>
                                {t('free_cancel')}
                            </Text>
                        }
                        <Button bgColor={palette.red} textColor={palette.white} text={t('cancel_ride')} onPress={cancelPassenger} />
                        <Button style={[styles.mt15]} bgColor={palette.primary} textColor={palette.white} text={t('back')} onPress={() => {dismiss(); setCancelModalVisible(false);} } />
                    </View>
                </BottomModalSheet>
            }

            <BottomModalSheet snapPoints={['30%']} modalVisible={cancelledModalVisible} setModalVisible={setCancelledModalVisible} onDismiss={function () { navigation.goBack() }}>
                <View style={[styles.w100, styles.flexOne, styles.fullCenter, styles.p24, styles.ph16]}>
                    <Text style={[styles.text, styles.headerText3, styles.mv5]}>{t('ride_cancelled')}</Text>
                    <Text style={[styles.text, styles.textCenter]}>{t('ride_cancelled_text')}</Text>
                    <Button style={[styles.mt15]} bgColor={palette.primary} textColor={palette.white} text={t('back')} onPress={() => {dismissAll(); navigation.goBack()}} />
                </View>
            </BottomModalSheet>
        </>
    );
}

const viewTripStyles = StyleSheet.create({
    availableRide: {
        ...styles.mb10,
        ...styles.br0,
        ...styles.bgWhite,
        minHeight: 110 * rem
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
        shadowRadius: 4,
        elevation: 10
    },

    biggerBubble: {
        width: 55 * rem,
        height: 55 * rem,
        borderRadius: 55 * rem / 2,
    }
});

export default ViewTrip;
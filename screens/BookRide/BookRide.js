import Geolocation from '@react-native-community/geolocation';
import _debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    I18nManager,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import * as ridesAPI from '../../api/ridesAPI';
import ArrowButton from '../../components/ArrowButton';
import BankCard from '../../components/BankCard';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import Counter from '../../components/Counter';
import CustomTextInput from '../../components/CustomTextInput';
import useAppManager from '../../context/appManager';
import { containerStyle, customMapStyle, mapContainerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import * as StoreReview from 'react-native-store-review';
import * as googleMapsAPI from '../../api/googlemaps';
import { decodePolyline } from '../../util/maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BookRide = ({ route, navigation }) => {
    const { rideId } = route.params;
    const { t } = useTranslation();

    const [location, setLocation] = useState(null);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const mapViewRef = useRef(null);

    const [mainTextFrom, setMainTextFrom] = useState('');
    const [mainTextTo, setMaintextTo] = useState('');
    const [seatsOccupied, setSeatsOccupied] = useState(0);
    const [datetime, setDateTime] = useState(null);
    const [pricePerSeat, setPricePerSeat] = useState(0);
    const [objDate, setObjDate] = useState(new Date());

    const [modalMapOpen, setModalMapOpen] = useState(false);

    const [driver, setDriver] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ratings, setRatings] = useState([]);
    const [seatsAvailable, setSeatsAvailable] = useState(0);
    const [profilePicture, setProfilePicture] = useState('');
    const [polyline, setPolyline] = useState(null);

    const [voucherText, setVoucherText] = useState("");
    const [voucherErrorMessage, setVoucherErrorMessage] = useState("");
    const [voucher, setVoucher] = useState(null);

    const [distanceToPickup, setDistanceToPickup] = useState(null);
    const [distanceOfTrip, setDistanceOfTrip] = useState(null);
    const [durationToPickup, setDurationToPickup] = useState(null);
    const [durationOfTrip, setDurationOfTrip] = useState(null);


    const voucherDiscount = useRef(0);

    const [car, setCar] = useState({});

    const [numSeats, setNumSeats] = useState(1);
    const [rideDetails, setRideDetails] = useState({});

    const [paymentMethodModalVisible, setPaymentMethodModalVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState({ type: 'cash' });
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const [rideBookedModalVisible, setRideBookedModalVisible] = useState(false);
    const [useVoucherText, setUseVoucherText] = useState(t('use_voucher'));
    const [voucherModalVisible, setVoucherModalVisible] = useState(false);
    const [serviceFee, setServiceFee] = useState(0);

    const [wantPickup, setWantPickup] = useState(false);
    const [pickupEnabled, setPickupEnabled] = useState(false);
    const [pickupPrice, setPickupPrice] = useState(0);
    const [pickupLocation, setPickupLocation] = useState(null);
    const [pickupText, setPickupText] = useState("Choose Location on Map")
    const [placeId, setPlaceId] = useState(null);
    const [prevPassenger, setPrevPassenger] = useState(null);

    const [loading, setLoading] = useState(true);

    const { id, balance, availableCards } = useUserStore();
    const { cardsEnabled, passengerFee } = useAppManager();

    useEffect( function () {
        Geolocation.getCurrentPosition(
            info => {
                setLocation({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude
                });
            }
        );

        setLoading(true);
        const data = ridesAPI.rideDetails(rideId).then((data) => {
            if (data.Driver.id === id) {
                return navigation.navigate('View Trip', { tripId: rideId })
            }
            setMainTextFrom(data.mainTextFrom);
            setMaintextTo(data.mainTextTo);
            setSeatsOccupied(data.seatsOccupied);
            setDateTime(data.datetime);
            setSeatsAvailable(data.seatsAvailable);
            setPricePerSeat(data.pricePerSeat);
            setObjDate(new Date(data.datetime));
            setMarkerFrom({ latitude: data.fromLatitude, longitude: data.fromLongitude });
            setMarkerTo({ latitude: data.toLatitude, longitude: data.toLongitude });
            setPickupEnabled(data.pickupEnabled);
            setPickupPrice(data.pickupPrice);
            setPolyline(data.polyline);
            setPrevPassenger(data.Passenger);
            if (data.Passenger) {
                setNumSeats(data.Passenger.seats);
            }

            setServiceFee(Math.floor(data.pricePerSeat * passengerFee));
            if (mapViewRef) {
                mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
            }
            setDriver(data.Driver.id);
            setFirstName(data.Driver.firstName);
            setLastName(data.Driver.lastName);
            setProfilePicture(data.Driver.profilePicture);
            setCar(data.Car);

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
        });
    }, []);

    const hideRideBooked =  function () {
        setRideBookedModalVisible(false);
        navigation.navigate('Find a Ride');
    };

    const bookRide = (e) => {
        setSubmitDisabled(true);
        const voucherId = voucher ? voucher.id : null;

        ridesAPI.bookRide(rideId, numSeats, paymentMethod, voucherId, wantPickup ? pickupLocation : null, datetime, mainTextTo).then( function () {
            setRideBookedModalVisible(true);
        }).catch((e) => {
            console.log(e.stack);
        }).finally( function () {
            StoreReview.requestReview();
            setSubmitDisabled(false);
        });
    }

    const choosePayment = (paymentMethod) => {
        setPaymentMethodModalVisible(false);
        setPaymentMethod(paymentMethod);
    };

    const verifyVoucher =  function () {
        ridesAPI.tryVerifyVoucher(voucherText).then((data) => {
            voucherDiscount.current = Math.min(data.maxValue, (data.type === "PERCENTAGE" ? ((data.value / 100) * pricePerSeat) : data.value));
            setVoucherModalVisible(false);
            setVoucherErrorMessage("");
            setVoucher(data);
            console.log(data);
            setUseVoucherText(t('voucher_applied') + " - " + voucherText)
        }).catch((err) => {
            console.error(err);
            setVoucherErrorMessage(err.response.data.error.message);
        });
    };

    const onReadyDirectionsToPickup = ({ distance, duration }) => {
        setDistanceToPickup(distance);
        setDurationToPickup(duration);
    };

    const onReadyTripDirections = ({ distance, duration }) => {
        setDistanceOfTrip(distance);
        setDurationToPickup(duration);
    };


    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        // This function should calculate the distance between two coordinates.
        // You can use Haversine formula or any suitable method for your use case.
        // There are libraries available to calculate distance based on coordinates.
        // Example: https://www.npmjs.com/package/geolib
        // For simplicity, let's assume a constant radius of the Earth in meters.
        const earthRadius = 6371000; // Radius of Earth in meters

        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
    };

    const isPointInsideCircle = (point, circleCenter, radius) => {
        const distance = calculateDistance(point.lat, point.lng, circleCenter.latitude, circleCenter.longitude);

        return distance <= radius;
    };

    const handleRegionChange = async (region) => {
        const results = await googleMapsAPI.geocode(region.latitude, region.longitude);

        const description = results.formatted_address;
        const placeId = results.place_id;

        // console.log(results);

        setPickupText(description);
        setPlaceId(placeId);
    }

    const debounceRegion = useCallback(_debounce(handleRegionChange, 300), [])

    const onChangeRegion = (region) => {
        debounceRegion(region);
    };



    const choosePickupLocation = async  function () {
        const loc = await googleMapsAPI.getLocationFromPlaceId(placeId);
        // console.log(loc);
        // console.log(markerFrom);
        if (isPointInsideCircle(loc, markerFrom, 5000)) {
            setPickupLocation(loc);
            setModalMapOpen(false);
        } else {
        }
    }

    const pickupMapRef = useRef(null);

    const showPickupMapMarker =  function () {
        console.log(pickupMapRef.current);
        pickupMapRef.current.fitToCoordinates([markerFrom])
    }

    const safeAreaInsets = useSafeAreaInsets();




    return (
        <>
            <ScreenWrapper screenName={t('book_ride')} navType="back" navAction={ function () { navigation.goBack() }}>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={mapContainerStyle} contentContainerStyle={styles.flexGrow}>
                    <MapView
                        style={[styles.mapStyle]}
                        showsUserLocation={true}
                        region={location}
                        provider={PROVIDER_GOOGLE}
                        ref={mapViewRef}
                        customMapStyle={customMapStyle}
                        showsMyLocationButton
                    >
                        {markerFrom &&
                            <Marker identifier="from" coordinate={markerFrom} pinColor={palette.secondary}>
                                <Image source={require('../../assets/PickUp.png')} style={{ width: 35, height: 35 }} />
                            </Marker>}
                        {markerTo &&
                            <Marker identifier="to" coordinate={markerTo}>
                                <Image source={require('../../assets/Destination.png')} style={{ width: 35, height: 35 }} />
                            </Marker>
                        }

                        {location && markerFrom && <Polyline strokeColor={palette.accent} strokeWidth={3} lineDashPattern={[600, 200, 300, 200]} coordinates={[location, markerFrom]} />}
                        {polyline && <Polyline strokeColors={[palette.secondary, palette.primary]} coordinates={decodePolyline(polyline)} strokeWidth={3} />}

                    </MapView>

                    <View style={[containerStyle, styles.flexOne]}>
                        {
                            !loading &&
                            <>
                                <View style={[styles.flexRow, styles.w100, styles.fullCenter]}>
                                    <View style={bookRideStyles.profilePictureView}>
                                        {profilePicture && <Image source={{ uri: profilePicture }} style={bookRideStyles.profilePicture} />}
                                    </View>
                                    <View style={[styles.flexOne, styles.ml20]}>
                                        <Text style={[styles.text, styles.headerText2]}>{firstName} {lastName}</Text>
                                        <Text style={[styles.text]}>{car.year} {car.brand} {car.model}</Text>
                                        <View style={styles.flexRow}>
                                            {ratings}
                                        </View>
                                    </View>
                                    <View style={styles.alignEnd}>
                                        <TouchableOpacity onPress={ function () { navigation.navigate('Chat', { receiver: driver }) }} active={0.9} style={bookRideStyles.chatButton}>
                                            <MaterialIcons name="chat-bubble" size={30} color={palette.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={[styles.flexRow]}>
                                    <ArrowButton disabled={prevPassenger} style={[styles.flexOne, styles.mr5]} bgColor={palette.light} text={paymentMethod.type === 'cash' ? "Cash" : '•••• ' + paymentMethod.number} icon={paymentMethod.type === 'cash' ? "money-bill" : 'credit-card'} iconColor={paymentMethod.type === 'card' ? palette.success : palette.success} onPress={() => setPaymentMethodModalVisible(true)} />
                                    <Counter text={t("seat")} textPlural={t("seats")} setCounter={setNumSeats} counter={numSeats} min={prevPassenger ? prevPassenger.seats : 1} max={prevPassenger ? prevPassenger.seats + (seatsAvailable - seatsOccupied) : seatsAvailable - seatsOccupied} />
                                </View>
                                {!prevPassenger &&
                                    <ArrowButton
                                        bgColor={palette.light}
                                        text={useVoucherText}
                                        icon="gift"
                                        iconColor={palette.primary}
                                        onPress={() => setVoucherModalVisible(true)}
                                    />
                                }

                                {pickupEnabled &&
                                    <>

                                        <Text style={[styles.text, styles.inputText]}>Do you want to be picked up? (+{pickupPrice} EGP)</Text>

                                        <View style={[styles.flexRow, styles.w100, styles.mv10]}>
                                            <TouchableOpacity onPress={ function () { setWantPickup(true) }} activeOpacity={0.9} style={[styles.flexOne, styles.fullCenter, { height: 48 * rem, backgroundColor: wantPickup ? palette.primary : palette.dark }]}>
                                                <Text style={[styles.text, styles.white, styles.bold]}>Yes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={ function () { setWantPickup(false) }} activeOpacity={0.9} style={[styles.flexOne, styles.fullCenter, { height: 48 * rem, backgroundColor: !wantPickup ? palette.primary : palette.dark }]}>
                                                <Text style={[styles.text, styles.white, styles.bold]}>No</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {
                                            wantPickup &&
                                            <View style={styles.w100}>
                                                <Text style={[styles.text, styles.inputText]}>Pick Up From</Text>
                                                <Button onPress={() => setModalMapOpen(true)} bgColor={palette.white} textColor={palette.primary} borderColor={palette.primary} text={pickupText} />
                                            </View>
                                        }
                                    </>
                                }

                                <View>
                                    <View style={[styles.flexRow, styles.w100]}>
                                        <Text style={[styles.text, styles.bold, styles.dark]}>{t('fare')}</Text>
                                        <View style={styles.flexOne} />
                                        <Text style={[styles.text]}>{numSeats} {numSeats > 1 ? t("seats") : t("seat")} x {pricePerSeat} {t('EGP')} = {numSeats * pricePerSeat} {t('EGP')}</Text>
                                    </View>
                                    {balance != 0 &&
                                        <View style={[styles.flexRow, styles.w100]}>
                                            <Text style={[styles.text, styles.bold, styles.dark]}>{t('balance')}{balance < 0 ? " Owed" : ""}</Text>
                                            <View style={styles.flexOne} />
                                            <Text style={[styles.text]}>{balance > 0 ? '-' : '+'} {Math.abs(Math.min(pricePerSeat * numSeats, parseInt(balance)))} {t('EGP')}</Text>
                                        </View>
                                    }
                                    {
                                        voucher &&
                                        <View style={[styles.flexRow, styles.w100]}>
                                            <Text style={[styles.text, styles.bold, styles.dark]}>{t('voucher')} (-{parseInt(voucher.value)}{voucher.type === "PERCENTAGE" ? '%' : t('EGP')})</Text>
                                            <View style={styles.flexOne} />
                                            <Text style={[styles.text]}>-{voucherDiscount.current} {t('EGP')}</Text>
                                        </View>
                                    }
                                    {
                                        wantPickup &&
                                        <View style={[styles.flexRow, styles.w100]}>
                                            <Text style={[styles.text, styles.bold, styles.dark]}>Pick Up Fee</Text>
                                            <View style={styles.flexOne} />
                                            <Text style={[styles.text]}>+ {pickupPrice} {t('EGP')}</Text>
                                        </View>
                                    }
                                    {
                                        passengerFee !== 0 &&
                                        <View style={[styles.flexRow, styles.w100]}>
                                            <Text style={[styles.text, styles.bold, styles.dark]}>{t('service_fees')}</Text>
                                            <View style={styles.flexOne} />
                                            <Text style={[styles.text]}>+ {serviceFee * numSeats} {t('EGP')}</Text>
                                        </View>
                                    }
                                    <View style={[styles.flexRow, styles.w100]}>
                                        <Text style={[styles.text, styles.bold, styles.dark]}>{t('you_pay')}</Text>
                                        <View style={styles.flexOne} />
                                        <Text style={[styles.text]}>
                                            {
                                                Math.max(0,
                                                    Math.abs(
                                                        -(pricePerSeat * numSeats)
                                                        + ((balance > 0 ? -1 : 1) * Math.min(pricePerSeat * numSeats, parseInt(balance)))
                                                    )
                                                    - voucherDiscount.current
                                                    + (serviceFee * numSeats)
                                                    + (wantPickup ? pickupPrice : 0)
                                                )
                                            }
                                            &nbsp;{t('EGP')}</Text>
                                    </View>
                                    <View>
                                        <Button text={prevPassenger ? t('update_booking') : t('book_now')} bgColor={palette.primary} textColor={palette.white} onPress={bookRide} disabled={submitDisabled} />
                                    </View>

                                </View>

                            </>
                        }

                        {
                            loading &&
                            <>
                                <View style={styles.w100}>
                                    <SkeletonPlaceholder>
                                        <SkeletonPlaceholder.Item width={'100%'} height={80 * rem} marginVertical={5 * rem} />
                                    </SkeletonPlaceholder>

                                    <SkeletonPlaceholder>
                                        <SkeletonPlaceholder.Item width={'100%'} height={48 * rem} marginVertical={5 * rem} />
                                    </SkeletonPlaceholder>

                                    <SkeletonPlaceholder>
                                        <SkeletonPlaceholder.Item width={'100%'} height={48 * rem} marginVertical={5 * rem} />
                                    </SkeletonPlaceholder>

                                    <SkeletonPlaceholder>
                                        <SkeletonPlaceholder.Item width={'100%'} height={20 * rem} marginVertical={5 * rem} />
                                    </SkeletonPlaceholder>

                                    <SkeletonPlaceholder>
                                        <SkeletonPlaceholder.Item width={'100%'} height={20 * rem} marginVertical={5 * rem} />
                                    </SkeletonPlaceholder>

                                    <SkeletonPlaceholder>
                                        <SkeletonPlaceholder.Item width={'100%'} height={48 * rem} marginVertical={5 * rem} />
                                    </SkeletonPlaceholder>
                                </View>
                            </>
                        }

                    </View>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setPaymentMethodModalVisible(false)} modalVisible={paymentMethodModalVisible}>
                <TouchableOpacity activeOpacity={0.75} style={{ ...styles.flexRow, width: '100%', height: 48 * rem, alignItems: 'center', borderBottomWidth: 1, borderColor: palette.light }} onPress={() => choosePayment({ type: 'cash' })}>
                    <FontsAwesome5 name="money-bill" size={24 * rem} color={palette.success} />
                    <Text style={[styles.text, styles.ml15, styles.semiBold]}>{t('pay_using_cash')}</Text>
                    <View style={[styles.flexOne, styles.alignEnd]}>
                        <FontsAwesome5 name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={18 * rem} color={palette.dark} />
                    </View>
                </TouchableOpacity>
                {cardsEnabled &&
                    availableCards.map((card, index) => (
                        <BankCard key={"card" + index} type={card.type} number={card.number} onPress={() => choosePayment(card)} />
                    ))
                }
            </BottomModal>

            <BottomModal onHide={hideRideBooked} modalVisible={rideBookedModalVisible}>
                <View style={[styles.alignCenter, styles.justifyCenter]}>
                    <FontsAwesome5 name="check-circle" size={55} color={palette.success} />
                    <Text style={[styles.text, styles.mt10, styles.font18, styles.success]}>{t('booked_successfully')}</Text>

                    <Text style={[styles.text, styles.bold, styles.font18, styles.mt10]}>{t('bill_summary')}</Text>

                    <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('fare')}</Text>
                    <Text style={[styles.text]}>{numSeats} {numSeats > 1 ? t("seats") : t("seat")} x {pricePerSeat} {t('EGP')} = {numSeats * pricePerSeat} {t('EGP')}</Text>
                    {balance != 0 &&
                        <>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('balance')}{balance < 0 ? t('owed') : ""}</Text>
                            <Text style={[styles.text]}>{balance > 0 ? '-' : '+'} {Math.abs(Math.min(pricePerSeat * numSeats, parseInt(balance)))} {t('EGP')}</Text>
                        </>
                    }

                    {
                        passengerFee !== 0 &&
                        <>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('service_fees')}{balance < 0 ? t('owed') : ""}</Text>
                            <Text style={[styles.text]}>+ {serviceFee * numSeats} {t('EGP')}</Text>
                        </>
                    }

                    {voucher &&
                        <>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('voucher')} (-{parseInt(voucher.value)}{voucher.type === "PERCENTAGE" ? '%' : t('EGP')})</Text>
                            <View style={styles.flexOne} />
                            <Text style={[styles.text]}>-{voucherDiscount.current} {t('EGP')}</Text>
                        </>
                    }

                    <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('total')}</Text>
                    <Text style={[styles.text]}>{
                        Math.abs(-(pricePerSeat * numSeats) + ((balance > 0 ? -1 : 1) * Math.min(pricePerSeat * numSeats, parseInt(balance)))) - voucherDiscount.current + (serviceFee * numSeats)
                    } {t('EGP')}</Text>
                    <Button text={t('book_return')} style={[styles.mt10]} bgColor={palette.primary} textColor={palette.white} onPress={() => navigation.navigate('Find a Ride')} />
                </View>
            </BottomModal>

            <BottomModal onHide={() => setVoucherModalVisible(false)} modalVisible={voucherModalVisible}>
                <View style={[styles.w100, styles.alignStart]}>
                    <Text style={[styles.text, styles.headerText2, styles.mt10]}>{t('redeem')} {t('voucher')}</Text>
                    <CustomTextInput placeholder={t('voucher')} value={voucherText} onChangeText={(value) => setVoucherText(value)} error={voucherErrorMessage} />
                    <Button text={t('redeem')} bgColor={palette.primary} textColor={palette.white} onPress={verifyVoucher} />
                </View>
            </BottomModal>

            {modalMapOpen &&
                <View style={[styles.defaultPadding, { position: 'absolute', bottom: safeAreaInsets.bottom + 50, left: 0, width: '100%', zIndex: 8 }]}>
                    <StatusBar barStyle='dark-content' />
                    <Button text={t('choose_location')} bgColor={palette.primary} textColor={palette.white} onPress={choosePickupLocation} />
                    {/* <Button text={t('back')} bgColor={palette.red} textColor={palette.white} onPress={choosePickupLocation} /> */}
                </View>
            }

            {modalMapOpen &&
                <View style={[styles.defaultPadding, { position: 'absolute', top: safeAreaInsets.top + 50, left: 0, width: '100%', zIndex: 8 }]}>
                    <TouchableOpacity style={[styles.bgWhite, styles.shadow, styles.fullCenter, {width: 55 * rem, height: 55 * rem, borderRadius: 55/2 * rem}]} onPress={() => setModalMapOpen(false)}>
                        <MaterialIcons name="arrow-back-ios" size={16} />
                    </TouchableOpacity>
                </View>
            }

            {modalMapOpen &&
                <>
                    <MapView
                        style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}
                        showsUserLocation={true}
                        region={markerFrom}
                        onRegionChangeComplete={(region) => onChangeRegion(region)}
                        onLayout={showPickupMapMarker}
                        provider={PROVIDER_GOOGLE}
                        ref={pickupMapRef}
                        customMapStyle={customMapStyle}
                        // mapPadding={{ bottom: 144 * rem, top: 0, left: 0 * rem, right: 0 }}
                        minZoomLevel={12}
                        maxZoomLevel={14}
                        showsMyLocationButton
                    >
                        <Circle center={markerFrom} radius={5000} fillColor='rgba(46, 23, 96, 0.3)' />
                        <MaterialIcons name="place" size={48} color={palette.red} />
                    </MapView>
                </>
            }
        </>
    );
}

const bookRideStyles = StyleSheet.create({
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
        resizeMode: 'cover',
        borderRadius: 75 / 2,
        ...styles.border2,
        ...styles.borderWhite,
    },

    chatButton: {
        width: 60 * rem,
        height: 60 * rem,
        borderRadius: 60 * rem / 2,
        ...styles.bgWhite,
        ...styles.fullCenter,
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4 * rem
    },

    paymentMethod: {
        height: 48 * rem,
        width: 80 * rem,
        ...styles.borderDark,
        ...styles.fullCenter,
        ...styles.flexRow
    }
});

export default BookRide;
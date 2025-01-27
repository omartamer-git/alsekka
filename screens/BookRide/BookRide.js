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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import * as StoreReview from 'react-native-store-review';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import * as googleMapsAPI from '../../api/googlemaps';
import * as ridesAPI from '../../api/ridesAPI';
import ArrowButton from '../../components/ArrowButton';
import BankCard from '../../components/BankCard';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import Counter from '../../components/Counter';
import CustomTextInput from '../../components/CustomTextInput';
import useAppManager from '../../context/appManager';
import { addSecondsToDate, containerStyle, customMapStyle, getDurationValues, getTime, mapContainerStyle, palette, rem, styles } from '../../helper';
import { getDeviceLocation } from '../../util/location';
import { decodePolyline } from '../../util/maps';
import ScreenWrapper from '../ScreenWrapper';
import { useFocusEffect } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Triangle } from '../../components/Triangle';

function BookRide({ route, navigation }) {
    const { rideId } = route.params;
    const { t } = useTranslation();

    const [location, setLocation] = useState({
        latitude: 30.0444,
        longitude: 31.2357,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
    });
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

    useEffect(function () {
        getDeviceLocation().then(result => {
            if (result) {
                setLocation(loc => ({ ...loc, ...result }));
            }
        })

        setLoading(true);
        const data = ridesAPI.rideDetails(rideId).then((data) => {
            console.log(data);
            if (data.Driver.id === id) {
                return navigation.navigate('View Trip', { tripId: rideId })
            }
            setMainTextFrom(data.mainTextFrom);
            setMaintextTo(data.mainTextTo);
            setSeatsOccupied(data.seatsOccupied);
            setDateTime(data.datetime);
            setDurationOfTrip(data.duration);
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
                if (data.Passenger.pickupLocationLat && data.Passenger.pickupLocationLng) {
                    setWantPickup(true);
                    setPickupLocation({
                        lat: data.Passenger.pickupLocationLat,
                        lng: data.Passenger.pickupLocationLng
                    });
                    // const locationName = await googleMapsAPI.geocode(data.Passenger.pickupLocationLat, data.Passenger.pickupLocationLng)).formatted_address;
                    googleMapsAPI.geocode(data.Passenger.pickupLocationLat, data.Passenger.pickupLocationLng).then(
                        result => {
                            setPickupText(result.formatted_address)
                        }
                    )
                }
            }
            if (data.Passenger) {
                setNumSeats(data.Passenger.seats);
            }

            setServiceFee(Math.floor(data.pricePerSeat * passengerFee));
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


    useEffect(function () {
        setTimeout(() => {
            if (mapViewRef) {
                mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 }, animated: true });
            }
        }, 1000);
    }, [mapViewRef.current]);


    const hideRideBooked = function () {
        setRideBookedModalVisible(false);
        navigation.navigate('Find a Ride');
    };

    function bookRide(e) {
        setSubmitDisabled(true);
        const voucherId = voucher ? voucher.id : null;
        ridesAPI.bookRide(rideId, numSeats, paymentMethod, voucherId, wantPickup ? pickupLocation : null, datetime, mainTextTo).then(function (data) {
            if (paymentMethod.type === 'cash') {
                setRideBookedModalVisible(true);
                StoreReview.requestReview();
            } else {
                navigation.navigate('Payment', { data });
            }
        }).catch((e) => {
            console.log(e);
        }).finally(function () {
            setSubmitDisabled(false);
        });
    }


    function choosePayment(paymentMethod) {
        setPaymentMethodModalVisible(false);
        setPaymentMethod(paymentMethod);
    };

    const verifyVoucher = function () {
        ridesAPI.tryVerifyVoucher(voucherText).then((data) => {
            voucherDiscount.current = Math.min(data.maxValue, (data.type === "PERCENTAGE" ? ((data.value / 100) * pricePerSeat) : data.value));
            setVoucherModalVisible(false);
            setVoucherErrorMessage("");
            setVoucher(data);
            setUseVoucherText(t('voucher_applied') + " - " + voucherText)
        }).catch((err) => {
            console.error(err);
            setVoucherErrorMessage(err.response.data.error.message);
        });
    };

    function onReadyDirectionsToPickup({ distance, duration }) {
        setDistanceToPickup(distance);
        setDurationToPickup(duration);
    };

    function onReadyTripDirections({ distance, duration }) {
        setDistanceOfTrip(distance);
        setDurationToPickup(duration);
    };


    function calculateDistance(lat1, lon1, lat2, lon2) {
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

    function isPointInsideCircle(point, circleCenter, radius) {
        const distance = calculateDistance(point.lat, point.lng, circleCenter.latitude, circleCenter.longitude);

        return distance <= radius;
    };

    async function handleRegionChange(region) {
        const results = await googleMapsAPI.geocode(region.latitude, region.longitude);

        const description = results.formatted_address;
        const placeId = results.place_id;


        setPickupText(description);
        setPlaceId(placeId);
    }

    const debounceRegion = useCallback(_debounce(handleRegionChange, 300), [])

    function onChangeRegion(region) {
        debounceRegion(region);
    };



    const choosePickupLocation = async function () {
        const loc = await googleMapsAPI.getLocationFromPlaceId(placeId);
        if (isPointInsideCircle(loc, markerFrom, 5000)) {
            setPickupLocation(loc);
            setModalMapOpen(false);
        } else {
        }
    }

    const pickupMapRef = useRef(null);

    const showPickupMapMarker = function () {
        pickupMapRef.current.fitToCoordinates([markerFrom])
    }

    function closeModalMap() {
        setModalMapOpen(false);
        setPickupText("Choose Location on Map");
    }

    const safeAreaInsets = useSafeAreaInsets();




    return (
        <>
            <ScreenWrapper screenName={t('book_ride')} navType="back" navAction={function () { navigation.goBack() }}>
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
                                <View style={[styles.fullCenter]}>
                                    <View style={[styles.bgPrimary, styles.p8, styles.br16]}>
                                        <Text style={[styles.white, styles.font12]}>{t('pick_up')}</Text>
                                    </View>
                                    <Triangle color={palette.primary} style={{ transform: [{ rotate: "180deg" }] }} />
                                </View>
                            </Marker>}
                        {markerTo &&
                            <Marker identifier="to" coordinate={markerTo}>
                                <View style={[styles.fullCenter]}>
                                    <View style={[styles.bgSecondary, styles.p8, styles.br16]}>
                                        <Text style={[styles.white, styles.font12]}>{t('drop_off')}</Text>
                                    </View>
                                    <Triangle color={palette.secondary} style={{ transform: [{ rotate: "180deg" }] }} />
                                </View>
                            </Marker>
                        }

                        {/* {location && markerFrom && <Polyline strokeColor={palette.accent} strokeWidth={3} lineDashPattern={[600, 200, 300, 200]} coordinates={[location, markerFrom]} />} */}
                        {polyline && <Polyline strokeColors={[palette.primary, palette.secondary]} coordinates={decodePolyline(polyline)} strokeWidth={3} />}

                    </MapView>

                    <View style={[containerStyle, styles.p24, styles.bgPrimary, styles.fullCenter, { borderTopWidth: 1 }, styles.borderLight]}>
                        <View style={[styles.flexRow, styles.w100, styles.fullCenter]}>
                            <View style={{ maxWidth: '60%', alignItems: 'flex-start' }}>
                                <Text style={[styles.white, styles.text, styles.font12]}>{new Date(datetime).toDateString()}</Text>
                                <View style={[styles.flexRow, styles.mt5]}>
                                    <View>
                                        <Text style={[styles.text, styles.white, { fontWeight: '700', fontSize: 16 }]}>{getTime(new Date(datetime))[0]}
                                            <Text style={[styles.font12]}>&nbsp;{t(getTime(new Date(datetime))[1])}</Text>
                                        </Text>
                                    </View>
                                    <View style={[styles.flexRow, styles.fullCenter, styles.mt5]}>
                                        <View style={{ height: 0.5, backgroundColor: 'darkgray', marginHorizontal: 4, width: 25 }} />
                                        <Text style={[styles.text, { color: palette.white, fontWeight: '600', marginHorizontal: 2, fontSize: 10 }]}>{getDurationValues(durationOfTrip)[0]}{t('h')}{getDurationValues(durationOfTrip)[1]}{t('m')}</Text>
                                        <View style={{ height: 0.5, backgroundColor: 'darkgray', marginHorizontal: 4, width: 25 }} />
                                    </View>
                                </View>
                                <Text style={[styles.text, styles.pr8, styles.white]} numberOfLines={2} ellipsizeMode='tail'>{mainTextFrom.split(',')[0].split('،')[0]}</Text>
                            </View>

                            <View style={[styles.flexOne, styles.alignStart]}>
                                <Text style={[styles.text, styles.white, { fontWeight: '700', fontSize: 16 }]}>{getTime(addSecondsToDate(new Date(datetime), durationOfTrip))[0]}<Text style={styles.font12}>&nbsp;{t(getTime(addSecondsToDate(new Date(datetime), durationOfTrip))[1])}</Text></Text>
                                <Text style={[styles.text, styles.white]} numberOfLines={2} ellipsizeMode='tail'>{mainTextTo.split(',')[0].split('،')[0]}</Text>
                            </View>
                        </View>

                    </View>

                    <View style={[containerStyle, styles.flexOne]}>
                        {
                            !loading &&
                            <>
                                <View style={[styles.flexRow, styles.w100, styles.fullCenter]}>
                                    <View style={bookRideStyles.profilePictureView}>
                                        {profilePicture && <FastImage source={{ uri: profilePicture }} style={bookRideStyles.profilePicture} />}
                                    </View>
                                    <View style={[styles.flexOne, styles.ml20]}>
                                        <Text style={[styles.text, styles.headerText2]}>{firstName} {lastName}</Text>
                                        <Text style={[styles.text]}>{car.year} {car.brand} {car.model}</Text>
                                        <View style={styles.flexRow}>
                                            {ratings}
                                        </View>
                                    </View>
                                    <View style={styles.alignEnd}>
                                        <TouchableOpacity onPress={function () { navigation.navigate('Chat', { receiver: driver }) }} active={0.9} style={bookRideStyles.chatButton}>
                                            <MaterialIcons name="chat-bubble" size={30} color={palette.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={[styles.flexRow]}>
                                    <ArrowButton disabled={prevPassenger} style={[styles.flexOne, styles.mr5]} bgColor={palette.light} text={paymentMethod.type === 'cash' ? "Cash" : paymentMethod.type === 'newcard' ? 'Card' : '•••• ' + paymentMethod.number} icon={paymentMethod.type === 'cash' ? "money" : 'add-card'} iconColor={paymentMethod.type === 'card' ? palette.success : palette.success} onPress={() => setPaymentMethodModalVisible(true)} />
                                    <Counter text={t("seat")} textPlural={t("seats")} setCounter={setNumSeats} counter={numSeats} min={prevPassenger ? prevPassenger.seats : 1} max={prevPassenger ? prevPassenger.seats + (seatsAvailable - seatsOccupied) : seatsAvailable - seatsOccupied} />
                                </View>
                                {!prevPassenger &&
                                    <ArrowButton
                                        bgColor={palette.light}
                                        text={useVoucherText}
                                        icon="discount"
                                        iconColor={palette.primary}
                                        onPress={() => setVoucherModalVisible(true)}
                                    />
                                }

                                {pickupEnabled &&
                                    <>

                                        <Text style={[styles.text, styles.inputText]}>{t('pickup_question')} (+{Math.ceil(pickupPrice / 100)} {t('EGP')})</Text>

                                        <View style={[styles.flexRow, styles.w100, styles.mv10]}>
                                            <TouchableOpacity onPress={function () { setWantPickup(true) }} activeOpacity={0.9} style={[styles.flexOne, styles.fullCenter, { height: 48 * rem, backgroundColor: wantPickup ? palette.secondary : palette.dark }]}>
                                                <Text style={[styles.text, styles.white, styles.bold]}>{t('yes')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={function () { setWantPickup(false) }} activeOpacity={0.9} style={[styles.flexOne, styles.fullCenter, { height: 48 * rem, backgroundColor: !wantPickup ? palette.secondary : palette.dark }]}>
                                                <Text style={[styles.text, styles.white, styles.bold]}>{t('no')}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {
                                            wantPickup &&
                                            <View style={styles.w100}>
                                                <Text style={[styles.text, styles.inputText]}>{t('pickup_from')}</Text>
                                                <Button onPress={() => setModalMapOpen(true)} bgColor={palette.white} textColor={palette.primary} borderColor={palette.primary} text={pickupText} />
                                            </View>
                                        }
                                    </>
                                }

                                <View>
                                    <View style={[styles.flexRow, styles.w100]}>
                                        <Text style={[styles.text, styles.bold, styles.dark]}>{t('fare')}</Text>
                                        <View style={styles.flexOne} />
                                        <Text style={[styles.text]}>{numSeats} {numSeats > 1 ? t("seats") : t("seat")} x {Math.ceil(pricePerSeat / 100)} {t('EGP')} = {Math.ceil(numSeats * pricePerSeat / 100)} {t('EGP')}</Text>
                                    </View>
                                    {balance != 0 &&
                                        <View style={[styles.flexRow, styles.w100]}>
                                            <Text style={[styles.text, styles.bold, styles.dark]}>{t('balance')}{balance < 0 ? " Owed" : ""}</Text>
                                            <View style={styles.flexOne} />
                                            <Text style={[styles.text]}>{balance > 0 ? '-' : '+'} {Math.abs(Math.min(Math.ceil((pricePerSeat * numSeats) / 100), Math.ceil(balance / 100)))} {t('EGP')}</Text>
                                        </View>
                                    }
                                    {
                                        voucher &&
                                        <View style={[styles.flexRow, styles.w100]}>
                                            <Text style={[styles.text, styles.bold, styles.dark]}>{t('voucher')} (-{parseInt(voucher.type === "PERCENTAGE" ? voucher.value : Math.ceil(voucher.value / 100))}{voucher.type === "PERCENTAGE" ? '%' : t('EGP')})</Text>
                                            <View style={styles.flexOne} />
                                            <Text style={[styles.text]}>-{Math.ceil(voucherDiscount.current / 100)} {t('EGP')}</Text>
                                        </View>
                                    }
                                    {
                                        wantPickup &&
                                        <View style={[styles.flexRow, styles.w100]}>
                                            <Text style={[styles.text, styles.bold, styles.dark]}>{t('pickup_fee')}</Text>
                                            <View style={styles.flexOne} />
                                            <Text style={[styles.text]}>+ {Math.ceil(pickupPrice / 100)} {t('EGP')}</Text>
                                        </View>
                                    }
                                    {
                                        passengerFee !== 0 &&
                                        <View style={[styles.flexRow, styles.w100]}>
                                            <Text style={[styles.text, styles.bold, styles.dark]}>{t('service_fees')}</Text>
                                            <View style={styles.flexOne} />
                                            <Text style={[styles.text]}>+ {Math.ceil(serviceFee * numSeats / 100)} {t('EGP')}</Text>
                                        </View>
                                    }
                                    <View style={[styles.flexRow, styles.w100]}>
                                        <Text style={[styles.text, styles.bold, styles.dark]}>{t('you_pay')}</Text>
                                        <View style={styles.flexOne} />
                                        <Text style={[styles.text]}>
                                            {/* {
                                                Math.max(0,
                                                    Math.abs(
                                                        -(pricePerSeat * numSeats)
                                                        + ((balance > 0 ? -1 : 1) * Math.min(pricePerSeat * numSeats, parseInt(balance)))
                                                    )
                                                    - voucherDiscount.current
                                                    + (serviceFee * numSeats)
                                                    + (wantPickup ? pickupPrice : 0)
                                                )
                                            } */}
                                            {
                                                Math.max(0,
                                                    (
                                                        Math.ceil(((balance * -1)
                                                            + (pricePerSeat * numSeats)
                                                            - voucherDiscount.current
                                                            + (serviceFee * numSeats)
                                                            + (wantPickup ? pickupPrice : 0)) / 100)
                                                    )
                                                )
                                            }
                                            &nbsp;{t('EGP')}</Text>
                                    </View>
                                    <View>
                                        <Button text={prevPassenger ? t('update_booking') : t('book_now')} bgColor={palette.primary} textColor={palette.white} onPress={bookRide} disabled={submitDisabled || (wantPickup && !pickupLocation)} />
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
                <TouchableOpacity activeOpacity={0.75} style={[styles.flexRow, styles.w100, styles.alignCenter, styles.borderLight, { height: 48 * rem, borderBottomWidth: 1 }]} onPress={() => choosePayment({ type: 'cash' })}>
                    <MaterialIcons name="money" size={24 * rem} color={palette.success} />
                    <Text style={[styles.text, styles.ml15, styles.semiBold]}>{t('pay_using_cash')}</Text>
                    <View style={[styles.flexOne, styles.alignEnd]}>
                        <MaterialIcons name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={18 * rem} color={palette.dark} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.75} style={[styles.flexRow, styles.w100, styles.alignCenter, styles.borderLight, { height: 48 * rem, borderBottomWidth: 1 }]} onPress={() => choosePayment({ type: 'newcard' })}>
                    <MaterialIcons name="add-card" size={24 * rem} color={palette.success} />
                    <Text style={[styles.text, styles.ml15, styles.semiBold]}>{t('add_card')}</Text>
                    <View style={[styles.flexOne, styles.alignEnd]}>
                        <MaterialIcons name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={18 * rem} color={palette.dark} />
                    </View>
                </TouchableOpacity>
                {/* <BankCard type={'mastercard'} number={'4819'} onPress={() => choosePayment(card)} /> */}

                {cardsEnabled &&
                    availableCards.map((card, index) => (
                        <BankCard key={"card" + index} type={card.type} number={card.number} onPress={() => choosePayment(card)} />
                    ))
                }
            </BottomModal>

            <BottomModal onHide={hideRideBooked} modalVisible={rideBookedModalVisible}>
                <View style={[styles.alignCenter, styles.justifyCenter]}>
                    <MaterialIcons name="check-circle" size={55} color={palette.success} />
                    <Text style={[styles.text, styles.mt10, styles.font18, styles.success]}>{t('booked_successfully')}</Text>

                    <Text style={[styles.text, styles.bold, styles.font18, styles.mt10]}>{t('bill_summary')}</Text>

                    <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('fare')}</Text>
                    <Text style={[styles.text]}>{numSeats} {numSeats > 1 ? t("seats") : t("seat")} x {Math.ceil(pricePerSeat / 100)} {t('EGP')} = {Math.ceil(numSeats * pricePerSeat / 100)} {t('EGP')}</Text>
                    {balance != 0 &&
                        <>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('balance')}{balance < 0 ? t('owed') : ""}</Text>
                            <Text style={[styles.text]}>{balance > 0 ? '+' : '-'} {Math.ceil(Math.abs(Math.min(pricePerSeat * numSeats, parseInt(balance))) / 100)} {t('EGP')}</Text>
                        </>
                    }

                    {pickupEnabled && wantPickup &&
                        <>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('pickup_fee')}</Text>
                            <Text style={[styles.text]}>+ {Math.ceil(pickupPrice / 100)} {t('EGP')}</Text>
                        </>
                    }

                    {
                        passengerFee !== 0 &&
                        <>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('service_fees')}{balance < 0 ? t('owed') : ""}</Text>
                            <Text style={[styles.text]}>+ {Math.ceil(serviceFee * numSeats / 100)} {t('EGP')}</Text>
                        </>
                    }

                    {voucher &&
                        <>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('voucher')} (-{parseInt(voucher.type === "PERCENTAGE" ? voucher.value : Math.ceil(voucher.value / 100))}{voucher.type === "PERCENTAGE" ? '%' : t('EGP')})</Text>
                            <View style={styles.flexOne} />
                            <Text style={[styles.text]}>-{Math.ceil(voucherDiscount.current / 100)} {t('EGP')}</Text>
                        </>
                    }

                    <Text style={[styles.text, styles.bold, styles.dark, styles.mt5]}>{t('total')}</Text>
                    <Text style={[styles.text]}>
                        {
                            Math.max(0,
                                Math.ceil((
                                    (balance * -1)
                                    + (pricePerSeat * numSeats)
                                    - voucherDiscount.current
                                    + (serviceFee * numSeats)
                                    + (wantPickup ? pickupPrice : 0)
                                ) / 100)
                            )
                        }
                        &nbsp;{t('EGP')}</Text>
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
                    <TouchableOpacity style={[styles.bgWhite, styles.shadow, styles.fullCenter, { width: 55 * rem, height: 55 * rem, borderRadius: 55 / 2 * rem }]} onPress={closeModalMap}>
                        <MaterialIcons name="arrow-back-ios" size={16} />
                    </TouchableOpacity>
                </View>
            }

            {modalMapOpen &&
                <>
                    <View style={[{ ...StyleSheet.absoluteFillObject }, styles.fullCenter]}>
                        <MapView
                            style={[styles.fullCenter, { ...StyleSheet.absoluteFillObject }]}
                            showsUserLocation={true}
                            region={{ ...markerFrom, longitudeDelta: 0.2, latitudeDelta: 0.2 }}
                            onRegionChangeComplete={(region) => onChangeRegion(region)}
                            onLayout={showPickupMapMarker}
                            provider={PROVIDER_GOOGLE}
                            ref={pickupMapRef}
                            customMapStyle={customMapStyle}
                            // mapPadding={{ bottom: 144 * rem, top: 0, left: 0 * rem, right: 0 }}
                            minZoomLevel={15}
                            maxZoomLevel={18}
                            showsMyLocationButton
                        >
                            <Circle center={markerFrom} radius={5000} fillColor='rgba(46, 23, 96, 0.3)' />
                            {/* <MaterialIcons name="place" size={48} color={palette.red} /> */}
                        </MapView>

                        <MaterialIcons
                            name="place"
                            size={48}
                            color={palette.red}
                            style={{
                                position: 'absolute',
                                alignSelf: 'center',
                                marginTop: '0%', // Adjust this to center the icon as needed
                                transform: [{ translateY: (24 / 2) }], // Adjust based on icon size to center correctly
                            }}
                        />
                    </View>
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
        shadowRadius: 4 * rem,
        elevation: 10
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
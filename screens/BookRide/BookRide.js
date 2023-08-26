import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useRef, useState } from 'react';
import {
    I18nManager,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import * as ridesAPI from '../../api/ridesAPI';
import ArrowButton from '../../components/ArrowButton';
import BankCard from '../../components/BankCard';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import Counter from '../../components/Counter';
import { containerStyle, customMapStyle, mapContainerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';
import CustomTextInput from '../../components/CustomTextInput';
import MapViewDirections from 'react-native-maps-directions';

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

    const [driver, setDriver] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ratings, setRatings] = useState([]);
    const [seatsAvailable, setSeatsAvailable] = useState(0);
    const [profilePicture, setProfilePicture] = useState('');

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

    const [rideBookedModalVisible, setRideBookedModalVisible] = useState(false);
    const [useVoucherText, setUseVoucherText] = useState(t('use_voucher'));
    const [voucherModalVisible, setVoucherModalVisible] = useState(false);

    const { balance, availableCards } = useUserStore();

    useEffect(() => {
        Geolocation.getCurrentPosition(
            info => {
                setLocation({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude
                });
            }
        );


        const data = ridesAPI.rideDetails(rideId).then((data) => {
            setMainTextFrom(data.mainTextFrom);
            setMaintextTo(data.mainTextTo);
            setSeatsOccupied(data.seatsOccupied);
            setDateTime(data.datetime);
            setSeatsAvailable(data.seatsAvailable);
            setPricePerSeat(data.pricePerSeat);
            setObjDate(new Date(data.datetime));
            setMarkerFrom({ latitude: data.fromLatitude, longitude: data.fromLongitude });
            setMarkerTo({ latitude: data.toLatitude, longitude: data.toLongitude });
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
        });
    }, []);

    const hideRideBooked = () => {
        setRideBookedModalVisible(false);
        navigation.navigate('Find a Ride');
    };

    const bookRide = (e) => {
        const voucherId = voucher ? voucher.id : null;
        console.log("BookRide VID: " + voucher);
        ridesAPI.bookRide(rideId, numSeats, paymentMethod, voucherId); // payment method
        setRideBookedModalVisible(true);
    }

    const choosePayment = (paymentMethod) => {
        setPaymentMethodModalVisible(false);
        setPaymentMethod(paymentMethod);
    };

    const verifyVoucher = () => {
        ridesAPI.tryVerifyVoucher(voucherText).then((data) => {
            voucherDiscount.current = Math.min(data.maxValue, (data.type === "PERCENTAGE" ? ((data.value / 100) * pricePerSeat) : data.value));
            setVoucherModalVisible(false);
            setVoucherErrorMessage("");
            setVoucher(data);
            setUseVoucherText(t('voucher_applied') + " - " + voucherText)
        }).catch((err) => {
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

    const isDarkMode = useColorScheme === 'dark';

    return (
        <>
            <ScreenWrapper screenName={t('book_ride')} navType="back" navAction={() => { navigation.goBack() }}>
                <ScrollView style={mapContainerStyle} contentContainerStyle={styles.flexGrow}>
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
                            </Marker>}
                        {markerTo && <Marker identifier="to" coordinate={markerTo} />}

                        {markerFrom && (distanceToPickup * 1 / distanceOfTrip) < 1 / 3 &&
                            <MapViewDirections
                                origin={`${location.latitude},${location.longitude}`}
                                destination={`${markerFrom.latitude},${markerFrom.longitude}`}
                                apikey='AIzaSyDUNz5SYhR1nrdfk9TW4gh3CDpLcDMKwuw'
                                strokeWidth={3}
                                strokeColor={palette.accent}
                                onReady={onReadyDirectionsToPickup}
                            />
                        }

                        {markerFrom && markerTo && <MapViewDirections
                            origin={`${markerFrom.latitude},${markerFrom.longitude}`}
                            destination={`${markerTo.latitude},${markerTo.longitude}`}
                            apikey='AIzaSyDUNz5SYhR1nrdfk9TW4gh3CDpLcDMKwuw'
                            strokeWidth={3}
                            strokeColor={palette.secondary}
                            onReady={onReadyTripDirections}
                        />}


                    </MapView>

                    <View style={[containerStyle, styles.flexOne]}>
                        <View style={[styles.flexRow, styles.w100, styles.fullCenter]}>
                            <View style={bookRideStyles.profilePictureView}>
                                {profilePicture && <Image source={{ uri: profilePicture }} style={bookRideStyles.profilePicture} />}
                            </View>
                            <View style={[styles.flexOne, styles.ml20]}>
                                <Text style={styles.headerText2}>{firstName} {lastName}</Text>
                                <Text>{car.year} {car.brand} {car.model}</Text>
                                <View style={styles.flexRow}>
                                    {ratings}
                                </View>
                            </View>
                            <View style={styles.alignEnd}>
                                <TouchableOpacity onPress={() => { navigation.navigate('Chat', { receiver: driver }) }} active={0.9} style={bookRideStyles.chatButton}>
                                    <MaterialIcons name="chat-bubble" size={30} color={palette.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={[styles.flexRow]}>
                            <ArrowButton style={[styles.flexOne, styles.mr5]} bgColor={palette.light} text={paymentMethod.type === 'cash' ? "Cash" : '•••• ' + paymentMethod.number} icon={paymentMethod.type === 'cash' ? "money-bill" : 'credit-card'} iconColor={paymentMethod.type === 'card' ? palette.success : palette.success} onPress={() => setPaymentMethodModalVisible(true)} />
                            <Counter text={t("seat")} textPlural={t("seats")} setCounter={setNumSeats} counter={numSeats} min={1} max={seatsAvailable - seatsOccupied} />
                        </View>
                        <ArrowButton
                            bgColor={palette.light}
                            text={useVoucherText}
                            icon="gift"
                            iconColor={palette.primary}
                            onPress={() => setVoucherModalVisible(true)}
                        />

                        <View>
                            <View style={[styles.flexRow, styles.w100]}>
                                <Text style={[styles.bold, styles.dark]}>{t('fare')}</Text>
                                <View style={styles.flexOne} />
                                <Text>{numSeats} {numSeats > 1 ? t("seats") : t("seat")} x {pricePerSeat} {t('EGP')} = {numSeats * pricePerSeat} {t('EGP')}</Text>
                            </View>
                            {balance != 0 &&
                                <View style={[styles.flexRow, styles.w100]}>
                                    <Text style={[styles.bold, styles.dark]}>{t('balance')}{balance < 0 ? " Owed" : ""}</Text>
                                    <View style={styles.flexOne} />
                                    <Text>{balance > 0 ? '-' : '+'} {Math.abs(Math.min(pricePerSeat * numSeats, parseInt(balance)))} {t('EGP')}</Text>
                                </View>
                            }
                            {
                                voucher &&
                                <View style={[styles.flexRow, styles.w100]}>
                                    <Text style={[styles.bold, styles.dark]}>{t('voucher')} (-{parseInt(voucher.value)}{voucher.type === "PERCENTAGE" ? '%' : t('EGP')})</Text>
                                    <View style={styles.flexOne} />
                                    <Text>-{voucherDiscount.current} {t('EGP')}</Text>
                                </View>
                            }
                            <View style={[styles.flexRow, styles.w100]}>
                                <Text style={[styles.bold, styles.dark]}>{t('you_pay')}</Text>
                                <View style={styles.flexOne} />
                                <Text>
                                    {
                                        Math.max(0,
                                            Math.abs(
                                                -(pricePerSeat * numSeats)
                                                + ((balance > 0 ? -1 : 1) * Math.min(pricePerSeat * numSeats, parseInt(balance)))
                                            )
                                            - voucherDiscount.current
                                        )
                                    }
                                    &nbsp;{t('EGP')}</Text>
                            </View>
                            <View>
                                <Button text={t('book_now')} bgColor={palette.primary} textColor={palette.white} onPress={bookRide} />
                            </View>

                        </View>

                    </View>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setPaymentMethodModalVisible(false)} modalVisible={paymentMethodModalVisible}>
                <TouchableOpacity activeOpacity={0.75} style={{ ...styles.flexRow, width: '100%', height: 48 * rem, alignItems: 'center', borderBottomWidth: 1, borderColor: palette.light }} onPress={() => choosePayment({ type: 'cash' })}>
                    <FontsAwesome5 name="money-bill" size={24 * rem} color={palette.success} />
                    <Text style={[styles.ml15, styles.semiBold]}>{t('pay_using_cash')}</Text>
                    <View style={[styles.flexOne, styles.alignEnd]}>
                        <FontsAwesome5 name={I18nManager.isRTL ? "chevron-left" : "chevron-right"} size={18 * rem} color={palette.dark} />
                    </View>
                </TouchableOpacity>
                {
                    availableCards.map((card, index) => (
                        <BankCard key={"card" + index} type={card.type} number={card.number} onPress={() => choosePayment(card)} />
                    ))
                }
            </BottomModal>

            <BottomModal onHide={hideRideBooked} modalVisible={rideBookedModalVisible}>
                <View style={[styles.alignCenter, styles.justifyCenter]}>
                    <FontsAwesome5 name="check-circle" size={55} color={palette.success} />
                    <Text style={[styles.mt10, styles.font18, styles.success]}>{t('booked_successfully')}</Text>

                    <Text style={[styles.bold, styles.font18, styles.mt10]}>{t('bill_summary')}</Text>

                    <Text style={[styles.bold, styles.dark, styles.mt5]}>{t('fare')}</Text>
                    <Text>{numSeats} {numSeats > 1 ? t("seats") : t("seat")} x {pricePerSeat} {t('EGP')} = {numSeats * pricePerSeat} {t('EGP')}</Text>

                    {balance != 0 &&
                        <>
                            <Text style={[styles.bold, styles.dark, styles.mt5]}>{t('balance')}{balance < 0 ? t('owed') : ""}</Text>
                            <Text>{balance > 0 ? '-' : '+'} {Math.abs(Math.min(pricePerSeat * numSeats, parseInt(balance)))} {t('EGP')}</Text>
                        </>
                    }

                    {voucher &&
                        <>
                            <Text style={[styles.bold, styles.dark, styles.mt5]}>{t('voucher')} (-{parseInt(voucher.value)}{voucher.type === "PERCENTAGE" ? '%' : t('EGP')})</Text>
                            <View style={styles.flexOne} />
                            <Text>-{voucherDiscount.current} {t('EGP')}</Text>
                        </>
                    }

                    <Text style={[styles.bold, styles.dark, styles.mt5]}>{t('total')}</Text>
                    <Text>{
                        Math.abs(-(pricePerSeat * numSeats) + ((balance > 0 ? -1 : 1) * Math.min(pricePerSeat * numSeats, parseInt(balance)))) - voucherDiscount.current
                    } {t('EGP')}</Text>
                    <Button text={t('book_return')} style={[styles.mt10]} bgColor={palette.primary} textColor={palette.white} />
                </View>
            </BottomModal>

            <BottomModal onHide={() => setVoucherModalVisible(false)} modalVisible={voucherModalVisible}>
                <Text style={[styles.headerText2, styles.mt10]}>{t('redeem')} {t('voucher')}</Text>
                <CustomTextInput placeholder={t('voucher')} value={voucherText} onChangeText={(value) => setVoucherText(value)} error={voucherErrorMessage} />
                <Button text={t('redeem')} bgColor={palette.primary} textColor={palette.white} onPress={verifyVoucher} />
            </BottomModal>
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
        resizeMode: 'center',
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
import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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

const BookRide = ({ route, navigation }) => {
    const { rideId } = route.params;

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

    const [car, setCar] = useState({});

    const [numSeats, setNumSeats] = useState(1);
    const [rideDetails, setRideDetails] = useState({});

    const [paymentMethodModalVisible, setPaymentMethodModalVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState({ type: 'cash' });

    const [rideBookedModalVisible, setRideBookedModalVisible] = useState(false);

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
            // console.log(data);

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
        ridesAPI.bookRide(rideId, numSeats, paymentMethod); // payment method
        setRideBookedModalVisible(true);
    }

    const choosePayment = (paymentMethod) => {
        setPaymentMethodModalVisible(false);
        setPaymentMethod(paymentMethod);
    };

    const isDarkMode = useColorScheme === 'dark';

    return (
        <>
            <ScreenWrapper screenName="Book Ride" navType="back" navAction={() => { navigation.goBack() }}>
                <ScrollView style={mapContainerStyle} contentContainerStyle={styles.flexGrow}>
                    <MapView
                        style={[styles.mapStyle]}
                        showUserLocation={true}
                        region={location}
                        provider={PROVIDER_GOOGLE}
                        ref={mapViewRef}
                        customMapStyle={customMapStyle}
                    >
                        {markerFrom && <Marker identifier="from" coordinate={markerFrom} pinColor="blue" />}
                        {markerTo && <Marker identifier="to" coordinate={markerTo} />}
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
                            <Counter text="seat" textPlural="seats" setCounter={setNumSeats} counter={numSeats} min={1} max={seatsAvailable - seatsOccupied} />
                        </View>
                        <ArrowButton bgColor={palette.light} text="Use Voucher" icon="gift" iconColor={palette.primary} />

                        <View>
                            <View style={[styles.flexRow, styles.w100]}>
                                <Text style={[styles.bold, styles.dark]}>Fare</Text>
                                <View style={styles.flexOne} />
                                <Text>{numSeats} {numSeats > 1 ? "seats" : "seat"} x {pricePerSeat} EGP = {numSeats * pricePerSeat} EGP</Text>
                            </View>
                            <View style={[styles.flexRow, styles.w100]}>
                                <Text style={[styles.bold, styles.dark]}>Balance{balance < 0 ? " Owed" : ""}</Text>
                                <View style={styles.flexOne} />
                                <Text>{balance > 0 ? '-' : '+'} {Math.abs(Math.min(pricePerSeat * numSeats, parseInt(balance)))} EGP</Text>
                            </View>
                            <View style={[styles.flexRow, styles.w100]}>
                                <Text style={[styles.bold, styles.dark]}>You Pay</Text>
                                <View style={styles.flexOne} />
                                <Text>{Math.abs(-(pricePerSeat * numSeats) + ((balance > 0 ? -1 : 1) * Math.min(pricePerSeat * numSeats, parseInt(balance))))} EGP</Text>
                            </View>
                            <View>
                                <Button text="Book Now" bgColor={palette.primary} textColor={palette.white} onPress={bookRide} />
                            </View>

                        </View>

                    </View>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setPaymentMethodModalVisible(false)} modalVisible={paymentMethodModalVisible}>
                <TouchableOpacity activeOpacity={0.75} style={{ flexDirection: 'row', width: '100%', height: 48 * rem, alignItems: 'center', borderBottomWidth: 1, borderColor: palette.light }} onPress={() => choosePayment({ type: 'cash' })}>
                    <FontsAwesome5 name="money-bill" size={24 * rem} color={palette.success} />
                    <Text style={[styles.ml15, styles.semiBold]}>Pay Using Cash</Text>
                    <View style={[styles.flexOne, styles.alignEnd]}>
                        <FontsAwesome5 name="chevron-right" size={18 * rem} color={palette.dark} />
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
                    <Text style={[styles.mt10, styles.font18, styles.success]}>Trip successfully booked!</Text>

                    <Text style={[styles.bold, styles.font18, styles.mt10]}>Summary</Text>

                    <Text style={[styles.bold, styles.dark, styles.mt5]}>Fare</Text>
                    <Text>{numSeats} {numSeats > 1 ? "seats" : "seat"} x {pricePerSeat} EGP = {numSeats * pricePerSeat} EGP</Text>

                    {balance != 0 &&
                        <>
                            <Text style={[styles.bold, styles.dark, styles.mt5]}>Balance{balance < 0 ? " Owed" : ""}</Text>
                            <Text>{balance > 0 ? '-' : '+'} {Math.abs(Math.min(pricePerSeat * numSeats, parseInt(balance)))} EGP</Text>
                        </>
                    }

                    <Text style={[styles.bold, styles.dark, styles.mt5]}>Total</Text>
                    <Text>{Math.abs(-(pricePerSeat * numSeats) + ((balance > 0 ? -1 : 1) * Math.min(pricePerSeat * numSeats, parseInt(balance))))} EGP</Text>
                    <Button text="Book Return Trip" style={[styles.mt10]} bgColor={palette.primary} textColor={palette.white} />
                </View>
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
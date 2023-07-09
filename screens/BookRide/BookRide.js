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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import AvailableRide from '../../components/AvailableRide';
import Button from '../../components/Button';
import { containerStyle, customMapStyle, getDateShort, getTime, mapContainerStyle, palette, rem, styles } from '../../helper';
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
    const [profilePicture, setProfilePicture] = useState('');

    const [popoverVisible, setPopoverVisible] = useState(false);



    const [rideDetails, setRideDetails] = useState({});
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



    const bookRide = (e) => {
        ridesAPI.bookRide(rideId, 'CASH'); // payment method
    }

    const isDarkMode = useColorScheme === 'dark';

    return (
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

                <AvailableRide style={[styles.br0, styles.bgWhite, styles.flexOne]} fromAddress={mainTextFrom} toAddress={mainTextTo} seatsOccupied={seatsOccupied} pricePerSeat={pricePerSeat} date={getDateShort(objDate)} time={getTime(objDate)} />
                <View style={[containerStyle, styles.flexOne]}>
                    <View style={[styles.flexRow, styles.w100, styles.fullCenter, styles.pv16]}>
                        <View style={bookRideStyles.profilePictureView}>
                            {profilePicture && <Image source={{ uri: profilePicture }} style={bookRideStyles.profilePicture} />}
                        </View>
                        <View style={[styles.flexOne, styles.ml20]}>
                            <Text style={styles.headerText2}>{firstName} {lastName}</Text>
                            <Text style={[styles.smallText, styles.black]}>Something else here</Text>
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


                    <View style={[styles.w100, styles.pv8, styles.flexRow, styles.fullCenter]}>
                        <TouchableOpacity style={bookRideStyles.paymentMethod}>
                            <MaterialIcons name="payments" size={18} color='#008000' />
                            <Text style={[styles.bold, styles.ml5, styles.dark]}>Cash</Text>
                            <MaterialIcons name="expand-more" size={18} color={palette.dark} />
                        </TouchableOpacity>


                        <Button text="Book Now" bgColor={palette.primary} textColor={palette.white} onPress={bookRide} style={[styles.flexOne, styles.ml20]} />
                    </View>
                </View>
            </ScrollView>
        </ScreenWrapper>
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
        borderRadius: 75/2,
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
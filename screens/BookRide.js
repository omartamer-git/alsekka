import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../components/HeaderView';
import AutoComplete from '../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../components/FromToIndicator';
import AvailableRide from '../components/AvailableRide';

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

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ratings, setRatings] = useState([]);
    const [profilePicture, setProfilePicture] = useState('');



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

        const url = `${SERVER_URL}/ridedetails?rideId=${rideId}`;
        fetch(url).then(response => response.json()).then(data => {
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
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setProfilePicture(data.profilePicture);

            const fullStars = Math.floor(data.rating);
            const halfStars = Math.ceil(data.rating) - Math.abs(data.rating);

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
        const url = `${SERVER_URL}/bookride?uid=${globalVars.getUserId()}&rideId=${rideId}&paymentMethod=0`;
        fetch(url).then(response => response.json()).then(data => {
            if (data[0].affectedRows === 1) {
                // do something
            } else {
                // send error
            }
        });
    }

    const isDarkMode = useColorScheme === 'dark';

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Book Ride" borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <View style={styles.wrapper}>
                <SafeAreaView style={{ backgroundColor: palette.white, borderRadius: 10, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                    </View>
                    <MapView
                        style={{ height: 300, width: '100%', zIndex: 3, elevation: 3, position: 'relative', marginTop: -20, borderBottomColor: '#d9d9d9', borderBottomWidth: 1 }}
                        showUserLocation={true}
                        region={location}
                        provider={PROVIDER_GOOGLE}
                        ref={mapViewRef}
                        customMapStyle={customMapStyle}
                    >
                        {markerFrom && <Marker identifier="from" coordinate={markerFrom} pinColor="blue" />}
                        {markerTo && <Marker identifier="to" coordinate={markerTo} />}
                    </MapView>

                    <AvailableRide style={{ borderRadius: 0, backgroundColor: palette.white, flex: 0.5 }} fromAddress={mainTextFrom} toAddress={mainTextTo} seatsOccupied={seatsOccupied} pricePerSeat={pricePerSeat} date={getDateShort(objDate)} time={getTime(objDate)} />

                    <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'center', justifyContent: 'center', flex: 0.5 }]}>

                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingTop: '5%', paddingBottom: '2.5%' }}>
                            <View style={{ flex: 0.275 }}>
                                <View style={{ width: 80, height: 80, borderRadius: 80 / 2, borderColor: palette.primary, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={{ uri: profilePicture }} style={{ height: 75, width: 75, resizeMode: 'center', borderRadius: 37.5, borderWidth: 2, borderColor: palette.white }} />
                                </View>
                            </View>
                            <View style={{ flex: 0.475 }}>
                                <Text style={styles.headerText2}>{firstName} {lastName}</Text>
                                <Text style={[styles.smallText, styles.black]}>Something else here</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {ratings}
                                </View>
                            </View>
                            <View style={{ flex: 0.25, alignItems: 'flex-end' }}>
                                <View style={{ width: 60, height: 60, borderRadius: 60 / 2, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', shadowColor: palette.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4 }}>
                                    <MaterialIcons style={{}} name="chat-bubble" size={30} color={palette.primary} />
                                </View>
                            </View>
                        </View>

                        <View style={{ width: '100%', paddingTop: '2.5%', paddingBottom: '5%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flex: 0.2, height: 48, borderRadius: 5, borderColor: palette.dark, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingLeft: 20, paddingRight: 20 }}>
                                <MaterialIcons name="payments" size={18} color='#008000' />
                                <Text style={{ fontWeight: '600', marginLeft: 5, color: palette.dark }}>Cash</Text>
                                <MaterialIcons name="expand-more" size={18} color={palette.dark} />
                            </View>
                            <Button text="Book Now" bgColor={palette.primary} textColor={palette.white} onPress={bookRide} style={{ flex: 0.8, marginLeft: 10 }} />
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default BookRide;
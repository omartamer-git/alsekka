import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import * as ridesAPI from '../../api/ridesAPI';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import Popover from 'react-native-popover-view/dist/Popover';
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
            setDriver(data.uid);
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
        ridesAPI.bookRide(rideId, 0); // payment method
    }

    const isDarkMode = useColorScheme === 'dark';

    return (
        <ScreenWrapper screenName="Book Ride" navType="back" navAction={() => {navigation.goBack()}}>
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

            <AvailableRide style={{ borderRadius: 0, backgroundColor: palette.white, flex: 1 }} fromAddress={mainTextFrom} toAddress={mainTextTo} seatsOccupied={seatsOccupied} pricePerSeat={pricePerSeat} date={getDateShort(objDate)} time={getTime(objDate)} />
            <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingTop: '5%', paddingBottom: '2.5%' }}>
                    <View style={{ flex: 0.275 }}>
                        <View style={{ width: 80, height: 80, borderRadius: 80 / 2, borderColor: palette.primary, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }}>
                            {profilePicture && <Image source={{ uri: profilePicture }} style={{ height: 75, width: 75, resizeMode: 'center', borderRadius: 37.5, borderWidth: 2, borderColor: palette.white }} />}
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
                        <TouchableOpacity onPress={() => { navigation.navigate('Chat', { receiver: driver }) }} active={0.9} style={{ width: 60, height: 60, borderRadius: 60 / 2, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', shadowColor: palette.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4 }}>
                            <MaterialIcons style={{}} name="chat-bubble" size={30} color={palette.primary} />
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={{ width: '100%', paddingTop: '2.5%', paddingBottom: '5%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Popover animationConfig={{ duration: 0 }} arrowSize={{ width: 0, height: 0 }} from={(
                        <TouchableOpacity style={{ flex: 0.2, height: 48, borderRadius: 5, borderColor: palette.dark, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingLeft: 20, paddingRight: 20 }}>
                            <MaterialIcons name="payments" size={18} color='#008000' />
                            <Text style={{ fontWeight: '600', marginLeft: 5, color: palette.dark }}>Cash</Text>
                            <MaterialIcons name="expand-more" size={18} color={palette.dark} />
                        </TouchableOpacity>
                    )}>
                        <TouchableOpacity>
                            <Text>Cash</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text>Card</Text>
                        </TouchableOpacity>
                    </Popover>

                    <Button text="Book Now" bgColor={palette.primary} textColor={palette.white} onPress={bookRide} style={{ flex: 0.8, marginLeft: 10 }} />
                </View>
            </View>

        </ScreenWrapper>
    );
}

export default BookRide;
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableHighlight,
    ScrollView,
    TouchableOpacity
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
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import Passenger from '../../components/Passenger';
import * as ridesAPI from '../../api/ridesAPI';
import ScreenWrapper from '../ScreenWrapper';


const ViewTrip = ({ route, navigation }) => {
    const { tripId } = route.params;
    const [tripDetails, setTripDetails] = useState(null);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [location, setLocation] = useState(null);
    const [objDate, setObjDate] = useState(new Date());
    const [isDriver, setIsDriver] = useState(false);

    const [tripReady, setTripReady] = useState(false);
    const [tripCancellable, setTripCancellable] = useState(false);
    const [tripStatus, setTripStatus] = useState(0);

    const mapViewRef = useRef(null);

    useEffect(() => {
        Geolocation.getCurrentPosition(
            info => {
                setLocation({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude
                });
            }
        );

        ridesAPI.tripDetails(tripId).then(
            data => {
                setTripDetails(data);

                setIsDriver(data.isDriver === 1);
                setObjDate(new Date(data.datetime));
                setMarkerFrom({ latitude: data.fromLatitude, longitude: data.fromLongitude });
                setMarkerTo({ latitude: data.toLatitude, longitude: data.toLongitude });
                fitMarkers();
                setTripStatus(data.status);

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
            }
        );

    }, []);

    // useeffect to set tripready and cancellable??
    useEffect(() => {
        const currDate = new Date();
        const objDateTime = objDate.getTime();
        const currTime = currDate.getTime();
        const timeToTrip = objDateTime - currTime;

        if (timeToTrip < 1000 * 60 * 60) { // within an hour, or time has already passed
            setTripReady(true);
        } else {
            setTripReady(false);
        }

        if (timeToTrip >= 1000 * 60 * 60 * 12) {
            setTripCancellable(true);
        } else {
            setTripCancellable(false);
        }
    }, [objDate]);

    const fitMarkers = () => {
        if (mapViewRef) {
            mapViewRef.current.fitToSuppliedMarkers(["from", "to"], { edgePadding: { top: 70, bottom: 50, right: 50, left: 50 } });
        }
    };

    const cancelRide = () => {
        ridesAPI.cancelRide(tripId).then(data => {
            console.log(data);
        });
    };

    const startTrip = () => {
        ridesAPI.cancelRide(tripId).then(data => {
            if (data) {
                setTripStatus(1);
            }
        });
    };

    const manageTrip = () => {
        navigation.navigate('Manage Trip', { tripId: tripId });
    };

    const goToChat = (receiver) => {
        navigation.navigate('Chat', { receiver: receiver });
    };


    const isDarkMode = useColorScheme === 'dark';

    return (
        <ScreenWrapper screenName="View Trip" navAction={() => navigation.goBack()} navType="back">
            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: '25%' }}>
                <MapView
                    style={{ height: 300, width: '100%', zIndex: 3, elevation: 3, position: 'relative', marginTop: -20, borderBottomColor: '#d9d9d9', borderBottomWidth: 1 }}
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
                    tripDetails &&
                    <AvailableRide style={{ borderRadius: 0, backgroundColor: palette.white, height: '25%' }} fromAddress={tripDetails.mainTextFrom} toAddress={tripDetails.mainTextTo} seatsOccupied={tripDetails.seatsOccupied} pricePerSeat={tripDetails.pricePerSeat} date={getDateShort(objDate)} time={getTime(objDate)} />
                }
                <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
                    {tripDetails &&
                        <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingTop: '5%', paddingBottom: '5%' }}>
                            <View style={{ width: 80, height: 80, borderRadius: 80 / 2, borderColor: palette.primary, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={{ uri: tripDetails.profilePicture }} style={{ height: 75, width: 75, resizeMode: 'center', borderRadius: 37.5, borderWidth: 2, borderColor: palette.white }} />
                            </View>
                            <View style={{ flex: 2, alignItems: 'flex-start', justifyContent: 'flex-start', marginLeft: 10 }}>
                                <Text style={styles.headerText2}>{isDriver ? "You're driving!" : tripDetails.firstName}</Text>
                                <Text style={[styles.smallText, { color: palette.dark, fontWeight: '500' }]}>Peugeot 508</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {ratings}
                                </View>
                            </View>
                            {!isDriver && <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <TouchableOpacity style={{ width: 60, height: 60, borderRadius: 60 / 2, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center', shadowColor: palette.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4 }}>
                                    <MaterialIcons style={{}} name="chat-bubble" size={30} color={palette.primary} />
                                </TouchableOpacity>
                            </View>}
                        </View>
                    }


                    {
                        isDriver &&
                        <View style={{ width: '100%', borderWidth: 1, borderColor: palette.light, borderRadius: 4 }}>
                            {
                                tripDetails.passengers.map((data, index) => {
                                    let borderTopWidth = 1;
                                    if (index == 0) {
                                        borderTopWidth = 0;
                                    }
                                    return (
                                        <Passenger key={"passenger" + index} borderTopWidth={borderTopWidth} data={data}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <TouchableOpacity activeOpacity={0.9} style={{ marginRight: 8 }} onPress={() => goToChat(data.id)}>
                                                    <MaterialIcons name="chat-bubble" size={24} color={palette.secondary} />
                                                </TouchableOpacity>
                                                <MaterialIcons name="phone" size={24} color={palette.secondary} style={{ marginLeft: 8 }} />
                                            </View>
                                        </Passenger>
                                    );
                                })
                            }
                        </View>
                    }
                    {
                        !isDriver &&
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Button bgColor={palette.secondary} textColor={palette.white} onPress={() => { }} style={{ flex: 0.8, marginRight: 10 }} >
                                <MaterialIcons name="check" size={24} color={palette.white} />
                            </Button>
                            <View style={{ flex: 0.2, height: 48, borderRadius: 4 }}>
                                <TouchableOpacity style={{ width: '100%', height: 48, borderRadius: 4, backgroundColor: palette.red, justifyContent: 'center', alignItems: 'center' }}>
                                    <MaterialIcons name="close" size={24} color={palette.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    {
                        isDriver &&
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {tripStatus === 0 && tripCancellable && <Button bgColor={palette.red} text="Cancel Ride" textColor={palette.white} onPress={cancelRide} />}

                            {tripStatus === 0 && tripReady && <Button bgColor={palette.secondary} text="Start Trip" textColor={palette.white} onPress={startTrip} />}

                            {tripStatus === 1 && <Button bgColor={palette.secondary} text="Manage Trip" textColor={palette.white} onPress={manageTrip} />}

                            {tripStatus === 4 && <Button bgColor={palette.primary} text="Trip Cancelled" textColor={palette.white} onPress={() => { }} />}

                        </View>
                    }
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
}

export default ViewTrip;
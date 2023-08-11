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
import Passenger from '../../components/Passenger';
import { customMapStyle, getDateShort, getTime, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import ArrowButton from '../../components/ArrowButton';
import BottomModal from '../../components/BottomModal';


const ViewTrip = ({ route, navigation }) => {
    const { tripId } = route.params;
    const [tripDetails, setTripDetails] = useState(null);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [location, setLocation] = useState(null);
    const [objDate, setObjDate] = useState(new Date());
    const [isDriver, setIsDriver] = useState(false);

    const [cancelModalVisible, setCancelModalVisible] = useState(false);

    const [tripReady, setTripReady] = useState(false);
    const [tripCancellable, setTripCancellable] = useState(false);
    const [tripStatus, setTripStatus] = useState('SCHEDULED');

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
                console.log(data);
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
            }
        );

    }, []);

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
            setTripStatus('CANCELLED');
        });
    };

    const cancelPassenger = () => {
        ridesAPI.cancelPassenger(tripId);
    };

    const startTrip = () => {
        ridesAPI.startRide(tripId).then(data => {
            if (data) {
                setTripStatus('ONGOING');
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
        <>
            <ScreenWrapper screenName="View Trip" navAction={() => navigation.goBack()} navType="back">
                <ScrollView style={styles.flexOne} contentContainerStyle={[styles.flexGrow]}>
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
                        tripDetails &&
                        <AvailableRide style={viewTripStyles.availableRide} fromAddress={tripDetails.mainTextFrom} toAddress={tripDetails.mainTextTo} seatsOccupied={tripDetails.seatsOccupied} DriverId={tripDetails.DriverId} seatsAvailable={tripDetails.seatsAvailable} pricePerSeat={tripDetails.pricePerSeat} date={getDateShort(objDate)} time={getTime(objDate)} />
                    }
                    <View style={[styles.defaultPadding, styles.bgLightGray, styles.w100, styles.fullCenter, styles.flexOne, { zIndex: 5 }]}>
                        {tripDetails &&
                            <View style={[styles.flexRow, styles.w100, styles.fullCenter, styles.mv5, styles.justifyStart]}>
                                <View style={viewTripStyles.profilePictureView}>
                                    <Image source={{ uri: tripDetails.Driver.profilePicture }} style={viewTripStyles.profilePicture} />
                                </View>
                                <View style={[styles.alignStart, styles.justifyStart, styles.ml10, styles.flexOne]}>
                                    <Text numberOfLines={1} adjustsFontSizeToFit style={styles.headerText3}>{isDriver ? "You're driving!" : tripDetails.Driver.firstName + " is driving"}</Text>
                                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.smallText, styles.dark, styles.semiBold]}>{tripDetails.Car.color} {tripDetails.Car.brand} {tripDetails.Car.model} ({tripDetails.Car.year})</Text>
                                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.smallText, styles.dark, styles.bold]}>{tripDetails.Car.licensePlateLetters.split('').join(' ')} - {tripDetails.Car.licensePlateNumbers}</Text>
                                    <View style={styles.flexRow}>
                                        {ratings}
                                    </View>
                                </View>

                                {!isDriver &&
                                    <View style={[styles.ml10]}>
                                        <TouchableOpacity activeOpacity={0.9} style={viewTripStyles.chatBubble}>
                                            <MaterialIcons name="chat-bubble" size={30} color={palette.primary} onPress={() => goToChat(tripDetails.Driver.id)} />
                                        </TouchableOpacity>
                                    </View>}
                            </View>
                        }


                        {
                            isDriver &&
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
                            <View style={[styles.w100, styles.flexRow, styles.justifyStart, styles.alignStart]}>
                                <ArrowButton style={[styles.flexOne]} bgColor={palette.light} text="Directions to Pickup" />

                                <View style={[styles.alignCenter, styles.justifyStart, styles.ml10, { marginTop: 8 * rem, marginBottom: 8 * rem }]}>
                                    <TouchableOpacity onPress={() => setCancelModalVisible(true)} style={{ backgroundColor: palette.light, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 1, width: 44 * rem, height: 44 * rem }}>
                                        <MaterialIcons name="close" size={25} />
                                    </TouchableOpacity>
                                    <Text style={[styles.smallText, styles.black, { marginTop: 2 * rem }]}>Cancel</Text>
                                </View>
                            </View>
                        }
                        {
                            isDriver &&
                            <View style={[styles.w100, styles.fullCenter]}>
                                {tripStatus === 'SCHEDULED' && tripCancellable && <Button bgColor={palette.red} text="Cancel Ride" textColor={palette.white} onPress={cancelRide} />}

                                {tripStatus === 'SCHEDULED' && tripReady && <Button bgColor={palette.secondary} text="Start Trip" textColor={palette.white} onPress={startTrip} />}

                                {tripStatus === 'ONGOING' && <Button bgColor={palette.secondary} text="Manage Trip" textColor={palette.white} onPress={manageTrip} />}

                                {tripStatus === 'CANCELLED' && <Button bgColor={palette.primary} text="Trip Cancelled" textColor={palette.white} onPress={() => { }} />}

                            </View>
                        }
                    </View>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setCancelModalVisible(false)} modalVisible={cancelModalVisible}>
                <View style={[styles.w100, styles.flexOne, styles.fullCenter, styles.pv24, styles.ph16]}>
                    <Text style={[styles.headerText3, styles.mv5]}>Are you sure you want to cancel?</Text>
                    <Text style={[styles.textCenter, styles.mv5]}>You can cancel for free up until 24 hours before the trip.</Text>
                    <Button style={[styles.mt15]} bgColor={palette.primary} textColor={palette.white} text="Go Back" onPress={() => setCancelModalVisible(false)} />
                    <Button bgColor={palette.red} textColor={palette.white} text="Cancel" onPress={cancelPassenger} />
                </View>
            </BottomModal>
        </>
    );
}

const viewTripStyles = StyleSheet.create({
    availableRide: {
        ...styles.br0,
        ...styles.bgWhite,
        height: 140 * rem
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
        width: 60 * rem,
        height: 60 * rem,
        borderRadius: 60 * rem / 2,
        ...styles.bgWhite,
        ...styles.fullCenter,
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    }
});

export default ViewTrip;
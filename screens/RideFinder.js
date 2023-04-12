import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    ScrollView
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, palette, customMapStyle, getDateShort, getTime } from '../helper';
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


const RideFinder = ({ route, navigation }) => {
    const { fromLat, fromLng, toLat, toLng, date, textFrom, textTo } = route.params;
    const [availableRides, setAvailableRides] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const loc = route.params?.loc;

    const [location, setLocation] = useState(null);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const mapViewRef = useRef(null);

    useEffect(() => {
        let url = `${SERVER_URL}/nearbyrides?startLng=${fromLng}&startLat=${fromLat}&endLng=${toLng}&endLat=${toLat}&date=${date}`;
        console.log(url);
        fetch(url).then
            (response => response.json()).then(
                data => {
                    setAvailableRides(data);
                }
            );
    }, []);

    const onClickRide = (rid) => {
        navigation.navigate('Book Ride', { rideId: rid });
    }


    const isDarkMode = useColorScheme === 'dark';


    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Search Rides" borderVisible={false} action={() => { navigation.goBack() }} >
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
                    <ScrollView style={{ width: '100%', flex: 1 }}>
                        <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.white, width: '100%', zIndex: 5, alignItems: 'flex-start' }]}>
                            <View style={{ width: '100%', borderRadius: 4, shadowColor: palette.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 4, zIndex: 6 }}>
                                <CustomTextInput key="fromText" iconLeft="my-location" value={textFrom} style={{ marginTop: 0, marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 0.5, borderColor: palette.light, backgroundColor: palette.white }} />
                                <CustomTextInput key="toText" iconLeft="place" value={textTo} style={{ marginTop: 0, marginBottom: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTopWidth: 0.5, borderColor: palette.light, backgroundColor: palette.white }} />
                            </View>

                            <Text style={[styles.headerText3, styles.black, { marginTop: 30 }]}>Available Rides</Text>
                            {
                                availableRides.map((data, index) => {
                                    const objDate = new Date(data.datetime);
                                    return (<AvailableRide key={"ar" + index} rid={data.id} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} seatsOccupied={data.seatsOccupied} pricePerSeat={data.pricePerSeat} date={getDateShort(objDate)} time={getTime(objDate)} onPress={onClickRide} style={{marginTop: 8, marginBottom: 8, height: 140}} />);
                                }
                                )
                            }
                            <View style={{ flex: 1 }} />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>

    );

}

export default RideFinder;
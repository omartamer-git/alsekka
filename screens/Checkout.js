import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
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
import Passenger from '../components/Passenger';


const Checkout = ({ route, navigation }) => {
    const { tripId, passengerId } = route.params;

    const isDarkMode = useColorScheme === 'dark';
    const [passengerDetails, setPassengerDetails] = useState(null);
    const [amountPaid, setAmountPaid] = useState("");
    const [rating, setRating] = useState(5);

    useEffect(() => {
        const url = SERVER_URL + `/passengerdetails?passenger=${passengerId}&tripId=${tripId}`;
        console.log(url);
        fetch(url).then(response => response.json()).then(
            data => {
                setPassengerDetails(data);
                setAmountPaid(String(data.amountDue));
            });
    }, []);

    const checkout = () => {
        Alert.alert('Checkout', 'By clicking CONFIRM, you confirm that the passenger has paid the amount you specified and has left the car.',
            [
                {
                    text: 'Cancel',
                    style: 'Cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => checkoutConfirmed()
                }
            ]);
    };

    const onChangeAmountPaid = (text) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setAmountPaid(numericValue);
    };

    const checkoutConfirmed = () => {
        const url = SERVER_URL + `/checkout?passenger=${passengerId}&tripId=${tripId}&amountPaid=${amountPaid}&rating=${rating}`;
        console.log(url);
        fetch(url).then(response => response.json()).then(
            data => {

            });
    }


    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Checkout" borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <View style={styles.wrapper}>
                <View style={{ backgroundColor: palette.white, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }} />
                    <View style={{ width: '100%', flex: 1 }}>
                        <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }]}>
                            {
                                passengerDetails &&
                                <Text style={styles.headerText3}>Checking Out {passengerDetails.firstName}</Text>
                            }
                            <Text>Amount Due: {passengerDetails && passengerDetails.amountDue} EGP</Text>

                            {
                                passengerDetails &&
                                passengerDetails.paymentMethod === 0 &&
                                <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Enter Amount Paid</Text>
                            }

                            {
                                passengerDetails &&
                                passengerDetails.paymentMethod === 0 &&
                                <CustomTextInput value={amountPaid} placeholder="Amount Paid" style={{ backgroundColor: palette.white }} onChangeText={onChangeAmountPaid} />}

                            <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Rate {passengerDetails && passengerDetails.firstName}</Text>
                            <View style={{ width: '100%', flex: 1, flexDirection: 'row' }}>
                                {Array.from({ length: 5 }, (_, index) => {
                                    return (
                                        <TouchableOpacity key={ "ratingStar" + index } onPress={() => { setRating(index + 1) }}>
                                            <MaterialIcons name="star" size={30} color={(rating <= index) ? palette.light : palette.primary} />
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <Button text="Checkout" bgColor={palette.primary} textColor={palette.white} onPress={checkout} />

                        </View>
                    </View>
                </View >
            </View >
        </View >
    );
};


export default Checkout;
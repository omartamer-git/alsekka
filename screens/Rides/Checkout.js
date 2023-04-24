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
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
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
import Passenger from '../../components/Passenger';
import ScreenWrapper from '../ScreenWrapper';


const Checkout = ({ route, navigation }) => {
    const { tripId, passengerId } = route.params;

    const isDarkMode = useColorScheme === 'dark';
    const [passengerDetails, setPassengerDetails] = useState(null);
    const [amountPaid, setAmountPaid] = useState("");
    const [rating, setRating] = useState(5);

    useEffect(() => {
        ridesAPI.passengerDetails(passengerId, tripId).then(
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
        ridesAPI.checkPassengerOut(passengerId, tripId).then(
            data => {

            });
    }


    return (
        <ScreenWrapper screenName="Checkout Passenger" navType={"back"} navAction={() => navigation.goBack()}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={containerStyle}>

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
                            <TouchableOpacity key={"ratingStar" + index} onPress={() => { setRating(index + 1) }}>
                                <MaterialIcons name="star" size={30} color={(rating <= index) ? palette.light : palette.primary} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <Button text="Checkout" bgColor={palette.primary} textColor={palette.white} onPress={checkout} />
            </ScrollView>
        </ScreenWrapper>
    );
};


export default Checkout;
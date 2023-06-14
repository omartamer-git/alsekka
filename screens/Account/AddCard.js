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
    Platform,
    ScrollView,
    StyleSheet
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle, rem } from '../../helper';
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
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Visa from '../../svgs/visa';
import Mastercard from '../../svgs/mastercard';
import ScreenWrapper from '../ScreenWrapper';
import { addCard } from '../../api/accountAPI';

const AddCard = ({ navigation, route }) => {
    const [cardholderName, setCardholderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardType, setCardType] = useState("");

    const [expiryDate, setExpiryDate] = useState(null);
    const [cvv, setCvv] = useState(null);
    useEffect(() => {

    }, []);

    const changeCardNumber = (data) => {
        if (data.length < 20) {
            const textInput = data.replace(/\D/g, '').replace(/(.{4})(?!$)/g, '$1 ');
            setCardNumber(textInput);
        }

        if (data) {
            const typeIdentifier = data.charAt(0);

            if (typeIdentifier == '2' || typeIdentifier == '5') {
                setCardType("mastercard");
            } else if (typeIdentifier == '4') {
                setCardType("visa");
            } else {
                setCardType("other");
            }



        }
    }

    const addNewCard = () => {
        // store cvv in asyncstorage

        addCard(cardNumber.replace(/\s+/g, ''), expiryDate, cardholderName).then(data => {
            navigation.goBack();
        });
    };

    const changeExpiryDate = (data) => {
        setExpiryDate(
            data.replace(
                /[^0-9]/g, '' // To allow only numbers
            ).replace(
                /^([2-9])$/g, '0$1' // To handle 3 > 03
            ).replace(
                /^(1{1})([3-9]{1})$/g, '0$1/$2' // 13 > 01/3
            ).replace(
                /^0{1,}/g, '0' // To handle 00 > 0
            ).replace(
                /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2' // To handle 113 > 11/3
            )
        );
    }

    const changeCvv = (data) => {
        const numeric = data.replace(/[^0-9]/g, '');
        if (data.length <= 3) {
            setCvv(numeric);
        }
    }

    return (
        <ScreenWrapper screenName="Add Card" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <LinearGradient colors={[palette.secondary, palette.accent]} style={addCardStyles.card}>
                    <Text adjustsFontSizeToFit
                        numberOfLines={1}
                        style={[styles.white, styles.bold, styles.font28]}>{cardNumber ? cardNumber : "1234 5678 9123 4567"}</Text>
                    <View style={[styles.flexOne, styles.flexRow, styles.spaceBetween, styles.alignEnd]}>
                        <>
                            <Text style={addCardStyles.cardDetailsText}>EXP: {expiryDate}</Text>
                        </>
                        <>
                            {
                                cardType === "visa" ? <Visa color={palette.white} width={50} height={50} /> : (cardType === "mastercard") ? <Mastercard color={palette.white} width={50} height={50} /> : ""
                            }
                        </>
                    </View>
                </LinearGradient>
                <View style={styles.w100}>
                    <Text style={styles.inputText}>Card Number</Text>
                    <CustomTextInput iconLeft="credit-card" placeholder="1234 5678 9123 4567" value={cardNumber} onChangeText={changeCardNumber} />
                </View>




                <View style={[styles.flexRow, styles.w100]}>
                    <View style={{flex: 1.5}}>
                        <Text style={styles.inputText}>Card Holder Name</Text>
                        <CustomTextInput iconLeft="badge" placeholder="Cardholder Name" value={cardholderName} onChangeText={setCardholderName} />
                    </View>

                    <View style={[styles.flexOne, styles.ml5]}>
                        <Text style={styles.inputText}>Expiry Date</Text>
                        <CustomTextInput placeholder="MM/YY" value={expiryDate} onChangeText={changeExpiryDate} />
                    </View>
                    {/* <View style={[styles.flexOne, styles.pl8]}>
                        <Text style={styles.inputText}>CVV</Text>
                        <CustomTextInput iconRight="help" placeholder="123" value={cvv} onChangeText={changeCvv} />
                    </View> */}
                </View>



                <Button bgColor={palette.primary} textColor={palette.white} text="Add Card" onPress={addNewCard} />

            </ScrollView>
        </ScreenWrapper>
    );
};

const addCardStyles = StyleSheet.create({
    cardDetailsText: {
        ...styles.white,
        ...styles.bold,
    },

    card: {
        ...styles.w100,
        height: 200 * rem,
        ...styles.br16,
        ...styles.p24,
        ...styles.mt10,
        paddingTop: 40 * rem
    }
});

export default AddCard;
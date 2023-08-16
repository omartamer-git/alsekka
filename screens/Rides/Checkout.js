import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import { containerStyle, palette, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';


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
        ridesAPI.checkPassengerOut(passengerId, tripId, amountPaid, rating).then(
            data => {
            });
    }


    if(Platform.OS === 'ios') {
        const onFocusEffect = useCallback(() => {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return () => {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }, []);
    
        useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    const {t} = useTranslation();


    return (
        <ScreenWrapper screenName={t('checkout_passenger')} navType={"back"} navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>

                {
                    passengerDetails &&
                    <Text style={styles.headerText3}>{t('checking_out')} {passengerDetails.firstName}</Text>
                }
                <Text>{t('amount_due')} {passengerDetails && passengerDetails.amountDue} {t('EGP')}</Text>

                {
                    passengerDetails &&
                    passengerDetails.paymentMethod === 0 &&
                    <Text style={styles.inputText}>{t('amount_paid')}</Text>
                }

                {
                    passengerDetails &&
                    passengerDetails.paymentMethod === 0 &&
                    <CustomTextInput value={amountPaid} placeholder={t('amount_paid')} style={styles.bgWhite} onChangeText={onChangeAmountPaid} />}

                <Text style={styles.inputText}>{t('rate')} {passengerDetails && passengerDetails.firstName}</Text>
                <View style={[styles.w100, styles.flexOne, styles.flexRow]}>
                    {Array.from({ length: 5 }, (_, index) => {
                        return (
                            <TouchableOpacity key={"ratingStar" + index} onPress={() => { setRating(index + 1) }}>
                                <MaterialIcons name="star" size={30} color={(rating <= index) ? palette.light : palette.primary} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <Button text={t('checkout')} bgColor={palette.primary} textColor={palette.white} onPress={checkout} />
            </ScrollView>
        </ScreenWrapper>
    );
};


export default Checkout;
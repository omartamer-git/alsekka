import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import { containerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';


function Checkout({ route, navigation }) {
    const { tripId, passengerId } = route.params;

    const [passengerDetails, setPassengerDetails] = useState(null);
    const [amountPaid, setAmountPaid] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    useEffect(function () {
        setLoading(true);
        ridesAPI.passengerDetails(passengerId, tripId).then(
            data => {
                setPassengerDetails(data);
                setAmountPaid(String(data.amountDue));
                setLoading(false);
            });
    }, []);

    const checkout = function () {
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

    function onChangeAmountPaid(text) {
        const numericValue = text.replace(/[^0-9]/g, '');
        setAmountPaid(numericValue);
    };

    const checkoutConfirmed = function () {
        setSubmitDisabled(true);
        ridesAPI.checkPassengerOut(passengerId, tripId, amountPaid, rating).then(
            data => {
            }).catch(console.error).finally(function () {
                setSubmitDisabled(false);
            });
    }


    if (Platform.OS === 'ios') {
        const onFocusEffect = useCallback(function () {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return function () {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }, []);

        useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    const { t } = useTranslation();


    return (
        <ScreenWrapper screenName={t('checkout_passenger')} navType={"back"} navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    !loading &&
                    <>
                        {
                            passengerDetails &&
                            <Text style={[styles.text, styles.headerText3]}>{t('checking_out')} {passengerDetails.firstName}</Text>
                        }
                        <Text style={[styles.text]}>{t('amount_due')} {passengerDetails && Math.ceil(passengerDetails.amountDue/100)} {t('EGP')}</Text>

                        {
                            passengerDetails &&
                            passengerDetails.paymentMethod === 0 &&
                            <Text style={[styles.text, styles.inputText]}>{t('amount_paid')}</Text>
                        }

                        {
                            passengerDetails &&
                            passengerDetails.paymentMethod === 0 &&
                            <CustomTextInput value={amountPaid} placeholder={t('amount_paid')} style={styles.bgWhite} onChangeText={onChangeAmountPaid} />}

                        <Text style={[styles.text, styles.inputText]}>{t('rate')} {passengerDetails && passengerDetails.firstName}</Text>
                        <View style={[styles.w100, styles.flexOne, styles.flexRow]}>
                            {Array.from({ length: 5 }, (_, index) => {
                                return (
                                    <TouchableOpacity key={"ratingStar" + index} onPress={function () { setRating(index + 1) }}>
                                        <MaterialIcons name="star" size={30} color={(rating <= index) ? palette.light : palette.primary} />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <Button disabled={submitDisabled} text={t('checkout')} bgColor={palette.primary} textColor={palette.white} onPress={checkout} />

                    </>
                }

                {
                    loading &&
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={25 * rem} marginVertical={5} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={25 * rem} marginVertical={5} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={44 * rem} marginVertical={5} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={25 * rem} marginVertical={5} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={44 * rem} marginVertical={5} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={44 * rem} marginVertical={5} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }


            </ScrollView>
        </ScreenWrapper>
    );
};


export default Checkout;
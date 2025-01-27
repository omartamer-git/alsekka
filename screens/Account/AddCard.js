import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import LinearGradient from 'react-native-linear-gradient';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import ErrorMessage from '../../components/ErrorMessage';
import { containerStyle, palette, rem, styles } from '../../helper';
import Mastercard from '../../svgs/mastercard';
import Visa from '../../svgs/visa';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';

function AddCard({ navigation, route }) {
    const { t } = useTranslation();
    const [cardholderName, setCardholderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardType, setCardType] = useState("");
    const [expiryDate, setExpiryDate] = useState(null);

    const [errorMessage, setErrorMessage] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const { addCard } = useUserStore();

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events    


    Yup.addMethod(Yup.string, 'luhn', function () {
        return this.test('luhn', 'Invalid card number', function (value) {
            if (!value) {
                return true; // Skip validation if value is empty
            }

            // Remove any spaces or dashes from the card number
            const cardNumber = value.replace(/\s+/g, '').replace(/-/g, '');

            // Convert the card number into an array of digits
            const cardDigits = cardNumber.split('').map(Number);

            // Apply the Luhn algorithm
            let sum = 0;
            let isEven = false;

            for (let i = cardDigits.length - 1; i >= 0; i--) {
                let digit = cardDigits[i];

                if (isEven) {
                    digit *= 2;
                    if (digit > 9) {
                        digit -= 9;
                    }
                }

                sum += digit;
                isEven = !isEven;
            }

            // The card number is valid if the sum is divisible by 10
            return sum % 10 === 0;
        });
    });

    function changeCardNumber(data) {
        let newCardNumber = "";
        if (data.length < 20) {
            const textInput = data.replace(/\D/g, '').replace(/(.{4})(?!$)/g, '$1 ');
            newCardNumber = textInput;
        } else {
            newCardNumber = cardNumber;
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

        return newCardNumber;
    }

    function addNewCard() {
        setSubmitDisabled(true);
        addCard(cardNumber.replace(/\s+/g, ''), expiryDate, cardholderName).then(data => {
            navigation.goBack();
        }).catch(err => {
            setErrorMessage(err.response.data.error.message);
        }).finally(function () {
            setSubmitDisabled(false);
        });
    };

    const changeExpiryDate = (data) => {
        const newExpiry = data.replace(
            /[^0-9]/g, '' // To allow only numbers
        ).replace(
            /^([2-9])$/g, '0$1' // To handle 3 > 03
        ).replace(
            /^(1{1})([3-9]{1})$/g, '0$1/$2' // 13 > 01/3
        ).replace(
            /^0{1,}/g, '0' // To handle 00 > 0
        ).replace(
            /^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, '$1/$2' // To handle 113 > 11/3
        );
        setExpiryDate(
            newExpiry
        );
        return newExpiry;
    }

    const cardValidation = Yup.object().shape({
        cardNumberInput: Yup.string().luhn().required(t('error_required')).min(19, t('error_card_number')),
        cardHolderNameInput: Yup.string().required(t('error_required')).min(2, t('error_name_short')).max(60, t('error_name_long')),
        expiryDateInput: Yup.string().matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, t('error_invalid_expiry')).required(t('error_required'))
    });


    return (
        <ScreenWrapper screenName={t('add_card')} navType="back" navAction={function () { navigation.goBack() }}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                <LinearGradient colors={[palette.secondary, palette.dark]} style={addCardStyles.card}>
                    <Text adjustsFontSizeToFit
                        numberOfLines={1}
                        style={[styles.text, styles.white, styles.bold, styles.font28]}>{cardNumber ? cardNumber : "1234 5678 9123 4567"}</Text>
                    <View style={[styles.flexOne, styles.flexRow, styles.spaceBetween, styles.alignEnd]}>
                        <>
                            <View style={styles.flexOne}>
                                <Text style={[styles.text, addCardStyles.cardDetailsText]}>{t('EXP')}: {expiryDate}</Text>
                                <Text style={[styles.text, addCardStyles.cardDetailsText, styles.mt5]}>{cardholderName.toUpperCase()}</Text>
                            </View>
                            {
                                cardType === "visa" ? <Visa color={palette.white} width={50} height={50} /> : (cardType === "mastercard") ? <Mastercard color={palette.white} width={50} height={50} /> : ""
                            }
                        </>
                    </View>
                </LinearGradient>
                <ErrorMessage message={errorMessage} condition={errorMessage} />
                <Formik
                    initialValues={{ cardNumberInput: '', cardHolderNameInput: '', expiryDateInput: '' }}
                    validationSchema={cardValidation}
                    onSubmit={function () { addNewCard() }}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
                        <>
                            <View style={styles.w100}>
                                <Text style={[styles.text, styles.inputText]}>{t('card_number')}</Text>
                                <CustomTextInput
                                    iconLeft="credit-card"
                                    placeholder="1234 5678 9123 4567"
                                    value={values.cardNumberInput}
                                    onChangeText={(data) => {
                                        const newCardNumber = changeCardNumber(data);
                                        setFieldValue('cardNumberInput', newCardNumber);
                                        setCardNumber(newCardNumber);
                                    }}
                                    onBlur={handleBlur('cardNumberInput')}
                                    error={touched.cardNumberInput && errors.cardNumberInput}
                                />
                            </View>




                            <View style={[styles.flexRow, styles.w100]}>
                                <View style={{ flex: 1.5 }}>
                                    <Text style={[styles.text, styles.inputText]}>{t('cardholder_name')}</Text>
                                    <CustomTextInput
                                        iconLeft="badge"
                                        placeholder={t('cardholder_name')}
                                        value={values.cardHolderNameInput}
                                        onChangeText={(data) => {
                                            setCardholderName(data);
                                            setFieldValue('cardHolderNameInput', data);
                                        }}
                                        onBlur={handleBlur('cardHolderNameInput')}
                                        error={touched.cardHolderNameInput && errors.cardHolderNameInput}
                                    />
                                </View>

                                <View style={[styles.flexOne, styles.ml5]}>
                                    <Text style={[styles.text, styles.inputText]}>{t('expiry_date')}</Text>
                                    <CustomTextInput
                                        placeholder="MM/YY"
                                        value={values.expiryDateInput}
                                        onChangeText={(data) => {
                                            const newExpiry = changeExpiryDate(data);
                                            setFieldValue('expiryDateInput', newExpiry);
                                        }}
                                        onBlur={handleBlur('expiryDateInput')}
                                        error={touched.expiryDateInput && errors.expiryDateInput}
                                    />
                                </View>
                            </View>



                            <Button
                                bgColor={palette.primary}
                                textColor={palette.white}
                                text={t("add_card")}
                                onPress={handleSubmit}
                                disabled={!isValid || submitDisabled}
                            />
                        </>
                    )}
                </Formik>
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
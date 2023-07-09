import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
import useUserStore from '../../api/accountAPI';
import * as Yup from 'yup';
import { Formik } from 'formik';
import ErrorMessage from '../../components/ErrorMessage';
import { useFocusEffect } from '@react-navigation/native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';

const AddBank = ({ navigation, route }) => {
    const [addBankError, setAddBankError] = useState(null);
    const { addBankAccount } = useUserStore();
    const addAccount = (fullName, bankName, accNumber, swiftCode) => {
        addBankAccount(fullName, bankName, accNumber, swiftCode).then(data => {
            navigation.goBack();
        }).catch(err => {
            setAddBankError(err.response.data.error.message);
        });
    }

    const bankAccountSchema = Yup.object().shape({
        fullNameInput: Yup.string().required('This field is required').min(5, "Please enter your full name").max(60, "Your full name should be a maximum of 60 characters"),
        bankNameInput: Yup.string().required('This field is required').max(30, "Bank name is too long, feel free to abbreviate"),
        accountNumberInput: Yup.string().required('This field is required').max(34, "Account number too long"),
        swiftCodeInput: Yup.string().max(11, "Swift Code too long")
    });

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


    return (
        <ScreenWrapper screenName="Add Account" navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle, { alignItems: 'flex-start' }]}>
                <ErrorMessage message={addBankError} condition={addBankError} />
                <Formik
                    initialValues={{ fullNameInput: '', bankNameInput: '', accountNumberInput: '', swiftCodeInput: '' }}
                    validationSchema={bankAccountSchema}
                    onSubmit={(values) => { addAccount(values.fullNameInput, values.bankNameInput, values.accountNumberInput, values.swiftCodeInput) }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                        <>
                            <Text style={styles.inputText}>Account Holder Full Name</Text>

                            <CustomTextInput
                                placeholder="Account Holder Full Name"
                                value={values.fullNameInput}
                                onBlur={handleBlur('fullNameInput')}
                                onChangeText={handleChange('fullNameInput')}
                                error={touched.fullNameInput && errors.fullNameInput}
                                iconLeft="badge"
                            />


                            <Text style={styles.inputText}>Bank Name</Text>

                            <CustomTextInput
                                placeholder="Bank Name"
                                value={values.bankNameInput}
                                onBlur={handleBlur('bankNameInput')}
                                onChangeText={handleChange('bankNameInput')}
                                error={touched.bankNameInput && errors.bankNameInput}
                                iconLeft="account-balance"
                            />

                            <Text style={styles.inputText}>IBAN/Account Number</Text>

                            <CustomTextInput
                                placeholder="IBAN/Account Number"
                                value={values.accountNumberInput}
                                onBlur={handleBlur('accountNumberInput')}
                                onChangeText={handleChange('accountNumberInput')}
                                error={touched.accountNumberInput && errors.accountNumberInput}
                                iconLeft="tag"
                            />


                            <Text style={styles.inputText}>SWIFT Code</Text>

                            <CustomTextInput
                                placeholder="SWIFT Code"
                                value={values.swiftCodeInput}
                                onBlur={handleBlur('swiftCodeInput')}
                                onChangeText={handleChange('swiftCodeInput')}
                                error={touched.swiftCodeInput && errors.swiftCodeInput}
                                iconLeft="next-week"
                            />

                            <View style={styles.flexOne} />
                            <Button text="Add Account" bgColor={palette.accent} textColor={palette.white} onPress={handleSubmit} />
                        </>
                    )}
                </Formik>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddBank;
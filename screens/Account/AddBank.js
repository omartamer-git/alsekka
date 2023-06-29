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
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
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
import { addBankAccount } from '../../api/accountAPI';
import * as Yup from 'yup';
import { Formik } from 'formik';
import ErrorMessage from '../../components/ErrorMessage';

const AddBank = ({ navigation, route }) => {
    const [addBankError, setAddBankError] = useState(null);
    const addAccount = (fullName, bankName, accNumber, swiftCode) => {
        addBankAccount(fullName, bankName, accNumber, swiftCode).then(data => {
            navigation.goBack();
        }).catch(err => {
            setAddBankError(err.response.data.error.message);
        });
    }

    const bankAccountSchema = Yup.object().shape({
        fullNameInput: Yup.string().required('This field is required'),
        bankNameInput: Yup.string().required('This field is required'),
        accountNumberInput: Yup.string().required('This field is required'),
        swiftCodeInput: Yup.string()
    });

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
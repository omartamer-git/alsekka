import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import {
    ScrollView,
    Text,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import ErrorMessage from '../../components/ErrorMessage';
import { containerStyle, palette, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';

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
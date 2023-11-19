import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import {
    Platform,
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
import { useTranslation } from 'react-i18next';

const AddBank = ({ navigation, route }) => {
    const {t} = useTranslation();
    const [addBankError, setAddBankError] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const { addBankAccount } = useUserStore();
    const addAccount = (fullName, bankName, accNumber, swiftCode) => {
        setSubmitDisabled(true);
        addBankAccount(fullName, bankName, accNumber, swiftCode).then(data => {
            navigation.goBack();
        }).catch(err => {
            setAddBankError(err.response.data.error.message);
        }).finally(() => {
            setSubmitDisabled(false);
        });
    }

    const bankAccountSchema = Yup.object().shape({
        fullNameInput: Yup.string().required(t('error_required')).min(5, t('error_name_short')).max(60, t('error_name_long')),
        bankNameInput: Yup.string().required(t('error_required')).max(30, t('error_bank_long')),
        accountNumberInput: Yup.string().required(t('error_required')).max(34, t('error_accountnumber_long')),
        swiftCodeInput: Yup.string().max(11, t('error_swift_long'))
    });

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


    return (
        <ScreenWrapper screenName={t('add_bank_account')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle, { alignItems: 'flex-start' }]}>
                <ErrorMessage message={addBankError} condition={addBankError} />
                <Formik
                    initialValues={{ fullNameInput: '', bankNameInput: '', accountNumberInput: '', swiftCodeInput: '' }}
                    validationSchema={bankAccountSchema}
                    onSubmit={(values) => { addAccount(values.fullNameInput, values.bankNameInput, values.accountNumberInput, values.swiftCodeInput) }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                        <>
                            <Text style={styles.inputText}>{t('account_holder_name')}</Text>

                            <CustomTextInput
                                placeholder={t('account_holder_name')}
                                value={values.fullNameInput}
                                onBlur={handleBlur('fullNameInput')}
                                onChangeText={handleChange('fullNameInput')}
                                error={touched.fullNameInput && errors.fullNameInput}
                                iconLeft="badge"
                            />


                            <Text style={styles.inputText}>{t('bank_name')}</Text>

                            <CustomTextInput
                                placeholder={t('bank_name')}
                                value={values.bankNameInput}
                                onBlur={handleBlur('bankNameInput')}
                                onChangeText={handleChange('bankNameInput')}
                                error={touched.bankNameInput && errors.bankNameInput}
                                iconLeft="account-balance"
                            />

                            <Text style={styles.inputText}>{t('account_number')}</Text>

                            <CustomTextInput
                                placeholder={t('account_number')}
                                value={values.accountNumberInput}
                                onBlur={handleBlur('accountNumberInput')}
                                onChangeText={handleChange('accountNumberInput')}
                                error={touched.accountNumberInput && errors.accountNumberInput}
                                iconLeft="tag"
                            />


                            <Text style={styles.inputText}>{t('swift_code')}</Text>

                            <CustomTextInput
                                placeholder={t('swift_code')}
                                value={values.swiftCodeInput}
                                onBlur={handleBlur('swiftCodeInput')}
                                onChangeText={handleChange('swiftCodeInput')}
                                error={touched.swiftCodeInput && errors.swiftCodeInput}
                                iconLeft="next-week"
                            />

                            <View style={styles.flexOne} />
                            <Button text={t('add_account')} bgColor={palette.accent} textColor={palette.white} onPress={handleSubmit} disabled={submitDisabled} />
                        </>
                    )}
                </Formik>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddBank;
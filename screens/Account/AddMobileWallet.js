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

const AddMobileWallet = ({ navigation, route }) => {
    const { t } = useTranslation();
    const [addWalletError, setAddWalletError] = useState(null);
    const { addMobileWallet } = useUserStore();
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const addAccount = (phoneInput) => {
        phoneInput = "0" + phoneInput;
        setSubmitDisabled(true);
        addMobileWallet(phoneInput).then(data => {
            navigation.goBack();
        }).catch(err => {
            setAddWalletError(err.response.data.error.message);
        }).finally(function () {
            setSubmitDisabled(false);
        });
    }

    const walletAccountSchema = Yup.object().shape({
        phoneInput: Yup.string().required(t('error_required')).matches(
            /^1[0-2,5]{1}[0-9]{8}$/,
            t('error_invalid_phone')
        )
    }
    );

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events    


    return (
        <ScreenWrapper screenName={t('add_wallet')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={[containerStyle, { alignItems: 'flex-start' }]}>
                <ErrorMessage message={addWalletError} condition={addWalletError} />
                <Formik
                    initialValues={{ phoneInput: '' }}
                    validationSchema={walletAccountSchema}
                    onSubmit={(values) => { addAccount(values.phoneInput) }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                        <>
                            <Text style={[styles.text, styles.inputText]}>{t('phone_number')}</Text>

                            <CustomTextInput
                                placeholder={t('phone_number') + " (i.e 01234567890)"}
                                value={values.phoneInput}
                                prefix={"+20"}
                                overrideRTL
                                emojiLeft={"🇪🇬"}
                                onChangeText={(text) => {
                                    handleChange('phoneInput')(text);
                                }}
                                value={values.phoneInput}
                                onBlur={handleBlur('phoneInput')}
                                keyboardType="number-pad"
                                error={touched.phoneInput && errors.phoneInput}
                                iconLeft="badge"
                            />

                            <View style={styles.flexOne} />
                            <Button text={t('add_wallet')} bgColor={palette.secondary} textColor={palette.white} onPress={handleSubmit} disabled={submitDisabled} />
                        </>
                    )}
                </Formik>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddMobileWallet;
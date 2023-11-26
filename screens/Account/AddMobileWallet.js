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
        }).finally(() => {
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

    if (Platform.OS === 'ios') {
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
        <ScreenWrapper screenName={t('add_wallet')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle, { alignItems: 'flex-start' }]}>
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
                                value={"+20 " + values.phoneInput}
                                emojiLeft={"🇪🇬"}
                                onBlur={handleBlur('phoneInput')}
                                keyboardType="number-pad"
                                onChangeText={(text) => {
                                    if (text == '') return;
                                    let sanitizedText = text.replace("+20", "").trim();
                                    handleChange('phoneInput')(sanitizedText);
                                }}
                                error={touched.phoneInput && errors.phoneInput}
                                iconLeft="badge"
                            />

                            <View style={styles.flexOne} />
                            <Button text={t('add_wallet')} bgColor={palette.accent} textColor={palette.white} onPress={handleSubmit} disabled={submitDisabled} />
                        </>
                    )}
                </Formik>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddMobileWallet;
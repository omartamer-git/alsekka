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
    const [addWalletError, setAddWalletError] = useState(null);
    const {addMobileWallet} = useUserStore();
    const addAccount = (phoneInput) => {
        addMobileWallet(phoneInput).then(data => {
            navigation.goBack();
        }).catch(err => {
            setAddWalletError(err.response.data.error.message);
        });
    }

    const walletAccountSchema = Yup.object().shape({
        phoneInput: Yup.string().matches(
            /^01[0-2,5]{1}[0-9]{8}$/,
            'Please enter a valid phone number in international format'
          )
        }
    );

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
                            <Text style={styles.inputText}>{t('phone_number')}</Text>

                            <CustomTextInput
                                placeholder={t('phone_number') + " (i.e 01234567890)"}
                                value={values.phoneInput}
                                onBlur={handleBlur('phoneInput')}
                                onChangeText={handleChange('phoneInput')}
                                error={touched.phoneInput && errors.phoneInput}
                                iconLeft="badge"
                            />

                            <View style={styles.flexOne} />
                            <Button text={t('add_wallet')} bgColor={palette.accent} textColor={palette.white} onPress={handleSubmit} />
                        </>
                    )}
                </Formik>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddMobileWallet;
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    Text,
    View
} from 'react-native';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import { containerStyle, palette, styles } from '../../helper';
import Treasure from '../../svgs/treasure';
import ScreenWrapper from '../ScreenWrapper';
import { Formik } from 'formik';
import SuccessCheck from '../../components/SuccessCheck';


function AddReferral({ navigation, route }) {
    const referralCode = route.params?.referralCode;
    const id = useUserStore((state) => state.id);
    const addReferral = useUserStore((state) => state.addReferral);
    const { t } = useTranslation();
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [success, setSuccess] = useState(false);

    function onSubmitReferralCode(referralCode) {
        console.log(referralCode);
        setSubmitDisabled(true);
        addReferral(referralCode).then(res => {
            setSuccess(true);
        }).catch(err => {
            setSubmitDisabled(false);
        });
    }

    useEffect(function () {
        if (referralCode) {
            onSubmitReferralCode(referralCode);
        }
    }, []);

    return (
        <ScreenWrapper screenName={t('refer_friend')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={[styles.flexOne]} contentContainerStyle={[containerStyle, styles.w100]}>
                {!success &&
                    <>
                        <View style={[styles.w100, styles.fullCenter]}>
                            <Treasure width={250} height={250} />
                        </View>
                        <Formik
                            initialValues={{
                                referralCodeInput: referralCode || ''
                            }}
                            onSubmit={(values) => {
                                onSubmitReferralCode(values.referralCodeInput);
                            }}
                        >
                            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
                                <>
                                    <Text style={[styles.text, styles.inputText]}>{t('referral_code')}</Text>
                                    <CustomTextInput value={values.referralCodeInput} onChangeText={handleChange('referralCodeInput')} placeholder={`${t('referral_code')} (${t('eg')}. SEAATS00000)`} />
                                    <Button onPress={handleSubmit} bgColor={palette.primary} textColor={palette.white} text={t('submit')} disabled={submitDisabled} />
                                </>
                            )}
                        </Formik>
                    </>
                }
                {
                    success &&
                    <>
                        <View style={[styles.w100, styles.flexOne, styles.fullCenter]}>
                            <SuccessCheck />
                            <Text style={[styles.text, styles.headerText3, styles.primary, styles.textCenter]}>{t('referral_code_applied')}</Text>
                            <Text style={[styles.text, styles.textCenter, styles.mt5]}>{t('referral_description')}</Text>
                            <Button style={[styles.mt10]} bgColor={palette.accent} textColor={palette.white} text={t('back')} onPress={() => navigation.navigate('Account Home')} />
                        </View>
                    </>
                }

            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddReferral;
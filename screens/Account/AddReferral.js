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

const List = ({ icon, headline, text }) => {
    return (
        <View style={[styles.flexRow, styles.w100, styles.mt15]}>
            <View>
                <FontsAwesome5 style={styles.icon} name={icon} size={20} color={palette.accent} light />
            </View>
            <View style={[styles.flexOne, styles.justifyCenter, styles.ml5]}>
                <Text style={[styles.font12, styles.bold]}>{headline}</Text>
                <Text style={[styles.font12, styles.mt5]}>{text}</Text>
            </View>
        </View>
    )
};

const AddReferral = ({ navigation, route }) => {
    const referralCode = route.params?.referralCode;
    const { id, addReferral } = useUserStore();
    const { t } = useTranslation();
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [success, setSuccess] = useState(false);

    const onSubmitReferralCode = (referralCode) => {
        setSubmitDisabled(true);
        addReferral(referralCode).then(res => {
            setSuccess(true);
        }).catch(err => {
            setSubmitDisabled(false);
        });
    }

    useEffect(() => {
        if (referralCode) {
            onSubmitReferralCode(referralCode);
        }
    }, []);



    return (
        <ScreenWrapper screenName={t('refer_friend')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={[styles.flexOne]} contentContainerStyle={[containerStyle, styles.w100]}>
                { !success &&
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
                                    <Text style={styles.inputText}>{t('referral_code')}</Text>
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
                            <Text style={[styles.freeSans, styles.headerText3, styles.primary, styles.textCenter]}>Referral Code Applied!</Text>
                            <Text style={[styles.textCenter, styles.mt5]}>We have added 50 EGP to your wallet redeemable on any future ride!</Text>
                            <Button style={[styles.mt10]} bgColor={palette.accent} textColor={palette.white} text="Go Back" onPress={() => navigation.navigate('Account', { screen: 'Account Home' })} />
                        </View>
                    </>
                }

            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddReferral;
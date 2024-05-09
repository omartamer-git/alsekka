import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import {
    I18nManager,
    ScrollView,
    Share,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import ErrorMessage from '../../components/ErrorMessage';
import { containerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import Treasure from '../../svgs/treasure';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { config } from '../../config';
// import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';

function List({ icon, headline, text }) {
    return (
        <View style={[styles.flexRow, styles.w100, styles.mt15, styles.justifyCenter, styles.alignCenter]}>
            <View>
                <MaterialIcons style={styles.icon} name={icon} size={22 * rem} color={palette.accent} light />
            </View>
            <View style={[styles.flexOne, styles.justifyCenter, styles.ml5]}>
                <Text style={[styles.text, styles.font12, styles.bold]}>{headline}</Text>
                <Text style={[styles.text, styles.font12, styles.mt5]}>{text}</Text>
            </View>
        </View>
    )
};

function Referral({ navigation, route }) {

    const { id } = useUserStore();
    const [copied, setCopied] = useState(false);
    const shareMsg = `Hey! Carpool using Seaats and save money commuting! Get 100 EGP off your first trip using my referral code ${config.REFERRAL_PREFIX}${config.REFERRAL_INCREMENT + id}. Join now and let's ride together! https://seaats.app/share/referral/${config.REFERRAL_PREFIX}${config.REFERRAL_INCREMENT + id}`;
    const shareMsgAr = `نزل تطبيق Seaats لمشاركة الرحلات ووفر فلوس المواصلات والبنزين! إكسب خصم 100 جنيه مصري في أول رحلة ليك على التطبيق باستخدام كود الإحالة ${config.REFERRAL_PREFIX}${config.REFERRAL_INCREMENT + id}. انضم الآن! https://seaats.app/share/referral/${config.REFERRAL_PREFIX}${config.REFERRAL_INCREMENT + id}`
    const onShare = async function () {
        try {
            const result = await Share.share({
                message: I18nManager.isRTL ? shareMsgAr : shareMsg
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.error(error);
        }
    };

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('refer_friend')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={[styles.flexOne]} contentContainerStyle={[containerStyle, styles.w100, styles.alignCenter]}>
                <Treasure width={250} height={250} />
                <View style={[styles.w100, styles.mt5]}>
                    <Text style={[styles.text, styles.font18, styles.bold, styles.mt20]}>{t('share_earn_repeat')}</Text>
                    <List icon="group" headline={t('share_your_code')} text={t('share_your_code2')} />
                    <List icon="paid" headline={t('earn_vouchers')} text={t('earn_vouchers2')} />
                    <List icon="replay" headline={t('repeat')} text={t('repeat2')} />
                </View>

                <View style={[styles.flexOne, styles.justifyEnd, styles.w100]}>
                    <TouchableWithoutFeedback
                        onPress={function () {
                            // Clipboard.setString(shareMsg)
                            setCopied(true);
                            setTimeout(function () {
                                setCopied(false);
                            }, 3000)
                        }}
                        style={[styles.w100, styles.br8, styles.mt10]}>
                        <View style={[styles.bgAccent, styles.alignCenter, styles.justifyCenter, styles.border1, styles.p8, styles.br8]}>
                            <Text style={[styles.text, styles.white]}>{t('your_code')}</Text>
                            {!copied && <Text style={[styles.text, styles.white, styles.bold]}>{config.REFERRAL_PREFIX}{config.REFERRAL_INCREMENT + id}</Text>}
                            {copied && <Text style={[styles.text, styles.white, styles.bold]}>{t('copied')}</Text>}
                        </View>
                    </TouchableWithoutFeedback>
                    <Button onPress={onShare} text={t('share')} bgColor={palette.primary} textColor={palette.white} />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default Referral;
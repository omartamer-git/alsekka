import { Formik } from 'formik';
import React, { useCallback, useState } from 'react';
import {
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
import { containerStyle, palette, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import Treasure from '../../svgs/treasure';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { config } from '../../config';
import Clipboard from '@react-native-community/clipboard';

const FlatList = ({ icon, headline, text }) => {
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

const Referral = ({ navigation, route }) => {

    const { id } = useUserStore();
    const [copied, setCopied] = useState(false);
    const shareMsg = `Hey! Carpool using seaats and save money commuting! Get a 50 EGP voucher for your first trip with my referral code ${config.REFERRAL_PREFIX}${config.REFERRAL_INCREMENT + id}. Join now and let's ride together!`;
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: shareMsg

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

    return (
        <ScreenWrapper screenName="Refer a friend" navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={[styles.flexOne]} contentContainerStyle={[containerStyle, styles.w100, styles.alignCenter]}>
                <Treasure width={250} height={250} />
                <View style={[styles.w100, styles.mt5]}>
                    <Text style={[styles.font18, styles.bold, styles.mt20]}>Share. Earn. Repeat.</Text>
                    <FlatList icon="share" headline="Share your referral code" text="Invite an unlimited amount of friends with your referral code and reap the benefits together!" />
                    <FlatList icon="coins" headline="Earn vouchers for every referral" text="Get a voucher worth 50 EGP for you and your loved ones for every referral" />
                    <FlatList icon="redo" headline="Repeat as many times as you want" text="There is no limit to how many people you can invite, share your code and watch your rewards stack up!" />
                </View>

                <View style={[styles.flexOne, styles.justifyEnd, styles.w100]}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            Clipboard.setString(shareMsg)
                            setCopied(true);
                            setTimeout(() => {
                                setCopied(false);
                            }, 3000)
                        }}
                        style={[styles.w100, styles.br8, styles.mt10]}>
                        <View style={[styles.bgAccent, styles.alignCenter, styles.justifyCenter, styles.border1, styles.p8, styles.br8]}>
                            <Text style={styles.white}>Your code is</Text>
                            {!copied && <Text style={[styles.white, styles.bold]}>{config.REFERRAL_PREFIX}{config.REFERRAL_INCREMENT + id}</Text>}
                            {copied && <Text style={[styles.white, styles.bold]}>Copied to clipboard!</Text>}
                        </View>
                    </TouchableWithoutFeedback>
                    <Button onPress={onShare} text="Share Now" bgColor={palette.primary} textColor={palette.white} />
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default Referral;
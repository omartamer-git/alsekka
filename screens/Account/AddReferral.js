import Clipboard from '@react-native-community/clipboard';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ScrollView,
    Share,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import { config } from '../../config';
import { containerStyle, palette, styles } from '../../helper';
import Treasure from '../../svgs/treasure';
import ScreenWrapper from '../ScreenWrapper';
import CustomTextInput from '../../components/CustomTextInput';

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
    const { referralCode } = route.params;
    const { id } = useUserStore();
    const {t} = useTranslation();

    return (
        <ScreenWrapper screenName={t('refer_friend')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={[styles.flexOne]} contentContainerStyle={[containerStyle, styles.w100]}>
                <Text style={styles.inputText}>Referral Code</Text>
                <CustomTextInput placeholder="Referral Code (e.g. SEAATS00000)" />
            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddReferral;
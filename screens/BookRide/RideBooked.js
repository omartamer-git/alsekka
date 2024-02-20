import { useFocusEffect } from '@react-navigation/native';
import _debounce from 'lodash/debounce';
import React, { useCallback, useState } from 'react';
import {
    Platform,
    ScrollView,
    Text,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import * as communitiesAPI from '../../api/communitiesAPI';
import CommunityCard from '../../components/CommunityCard';
import CustomTextInput from '../../components/CustomTextInput';
import { containerStyle, palette, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';
import SuccessfulBooking from '../../svgs/SuccessfulBooking';
import Button from '../../components/Button';


function RideBooked({ navigation, route }) {
    const { t } = useTranslation();

    return (
        <ScreenWrapper navType="back" navAction={() => navigation.goBack()}>
            <View style={[styles.flexOne, styles.w100, styles.fullCenter, styles.defaultPadding, styles.defaultContainer]}>
                <SuccessfulBooking width={400} height={130} />

                <Text style={[styles.text, styles.textCenter, styles.font28, styles.bold, styles.mt10]}>
                    {t('booked_successfully')}
                </Text>

                <Button bgColor={palette.primary} textColor={palette.white} text={t('book_return')} onPress={() => navigation.goBack()} />
            </View>
        </ScreenWrapper>
    );
};

export default RideBooked;
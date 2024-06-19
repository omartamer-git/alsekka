import React, { useEffect, useState } from 'react';
import {
    I18nManager,
    Image,
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { containerStyle, palette, rem, styles } from '../../helper';

import { useTranslation } from 'react-i18next';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useUserStore from '../../api/accountAPI';
import * as chatAPI from '../../api/chatAPI';
import ScreenWrapper from '../ScreenWrapper';
import FastImage from 'react-native-fast-image';


function ChatsList({ navigation, route }) {
    const [chats, setChats] = useState(null);
    const [loading, setLoading] = useState(true);
    const userStore = useUserStore();
    useEffect(function () {
        setLoading(true);
        chatAPI.getChats().then((data) => {
            setChats(data);
            console.log(data);
            setLoading(false);
        });
    }, []);


    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('messages')} navAction={() => navigation.goBack()} navType="back">
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    !loading &&
                    <>
                        <TouchableOpacity onPress={function () { 
                            Linking.openURL("https://wa.me/201028182577")
                         }} activeOpacity={0.9} key={"chat_cs"} style={[styles.flexRow, styles.justifyStart, styles.alignCenter, styles.w100, styles.pv8, styles.borderLight, { borderBottomWidth: 1 }]}>
                            <FastImage source={{ uri: 'https://storage.googleapis.com/alsekka_profile_pics/customer_service.png' }} style={[styles.borderAccent, styles.border1, { borderRadius: 60 / 2, height: 60, width: 60 }]} />
                            <View style={[styles.flexRow, styles.flexOne, styles.spaceBetween, styles.alignCenter]}>
                                <Text style={[styles.text, styles.ml10, styles.semiBold, styles.font18]}>{t('customer_service')}</Text>
                                <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} />
                            </View>
                        </TouchableOpacity>

                        {
                            chats &&
                            chats.map((data, index) => {
                                console.log(data);
                                const secondParty = data.User;
                                return (
                                    <TouchableOpacity onPress={function () { navigation.navigate('Chat', { receiver: data.SenderId == userStore.id ? data.ReceiverId : data.SenderId, rideDate: null }) }} activeOpacity={0.9} key={"chat" + index} style={[styles.flexRow, styles.justifyStart, styles.alignCenter, styles.w100, styles.pv8, styles.borderLight, { borderBottomWidth: 1 }]}>
                                        <FastImage source={{ uri: secondParty.profilePicture }} style={[styles.borderAccent, styles.border1, { borderRadius: 60 / 2, height: 60, width: 60 }]} />
                                        <View style={[styles.flexRow, styles.flexOne, styles.spaceBetween, styles.alignCenter]}>
                                            <Text style={[styles.text, styles.ml10, styles.semiBold, styles.font18, {color: data.messageread === 0 ? palette.accent : palette.black, fontWeight: data.messageread === 0 ? '600': 'normal'}]}>{secondParty.firstName} {secondParty.lastName}</Text>
                                            <MaterialIcons color={data.messageread ? palette.dark : palette.accent} name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} />
                                        </View>
                                    </TouchableOpacity>
                                );
                            })
                        }
                    </>
                }
                {
                    loading &&
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width='100%' height={70 * rem} marginVertical={10} />
                                <SkeletonPlaceholder.Item width='100%' height={70 * rem} marginVertical={10} />
                                <SkeletonPlaceholder.Item width='100%' height={70 * rem} marginVertical={10} />
                                <SkeletonPlaceholder.Item width='100%' height={70 * rem} marginVertical={10} />
                                <SkeletonPlaceholder.Item width='100%' height={70 * rem} marginVertical={10} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }
            </ScrollView>
        </ScreenWrapper>

    );
};

export default ChatsList;
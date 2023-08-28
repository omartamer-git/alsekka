import React, { useEffect, useState } from 'react';
import {
    I18nManager,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { containerStyle, palette, rem, styles } from '../../helper';

import useUserStore from '../../api/accountAPI';
import * as chatAPI from '../../api/chatAPI';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


const ChatsList = ({ navigation, route }) => {
    const [chats, setChats] = useState(null);
    const [loading, setLoading] = useState(true);
    const userStore = useUserStore();
    useEffect(() => {
        setLoading(true);
        chatAPI.getChats().then((data) => {
            setChats(data);
            setLoading(false);
        });
    }, []);


    const isDarkMode = useColorScheme === 'dark';
    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('messages')} navAction={() => navigation.goBack()} navType="back">
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    !loading &&
                    <>
                        <TouchableOpacity onPress={() => { navigation.navigate('Customer Service') }} activeOpacity={0.9} key={"chat_cs"} style={{ ...styles.flexRow, justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderColor: palette.light }}>
                            <Image source={{ uri: 'https://storage.googleapis.com/alsekka_profile_pics/customer_service.png' }} width={60} height={60} style={{ borderRadius: 60 / 2, borderWidth: 1, borderColor: palette.accent }} />
                            <View style={[styles.flexRow, styles.flexOne, styles.spaceBetween, styles.alignCenter]}>
                                <Text style={[styles.ml10, styles.semiBold, styles.font18]}>{t('customer_service')}</Text>
                                <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} />
                            </View>
                        </TouchableOpacity>

                        {
                            chats &&
                            chats.map((data, index) => {
                                const secondParty = data.Sender === null ? data.Receiver : data.Sender;
                                console.log(secondParty);
                                return (
                                    <TouchableOpacity onPress={() => { navigation.navigate('Chat', { receiver: data.senderId == userStore.id ? data.receiverId : data.senderId }) }} activeOpacity={0.9} key={"chat" + index} style={{ ...styles.flexRow, justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderColor: palette.light }}>
                                        <Image source={{ uri: secondParty.profilePicture }} width={60} height={60} style={{ borderRadius: 60 / 2, borderWidth: 1, borderColor: palette.accent }} />
                                        <View style={[styles.flexRow, styles.flexOne, styles.spaceBetween, styles.alignCenter]}>
                                            <Text style={[styles.ml10, styles.semiBold, styles.font18]}>{secondParty.firstName} {secondParty.lastName}</Text>
                                            <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} />
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
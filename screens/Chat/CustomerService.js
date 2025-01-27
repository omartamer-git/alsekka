import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { chatStyles, palette, rem, styles, translatedFormat } from '../../helper';

import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../ScreenWrapper';
import useUserStore from '../../api/accountAPI';
import * as chatAPI from '../../api/chatAPI';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { useFocusEffect } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import FastImage from 'react-native-fast-image';


function CustomerService({ navigation, route }) {
    const { t } = useTranslation();
    const ref = useRef(null);
    const userStore = useUserStore();
    const [messageText, setMessageText] = useState('');
    const cs_profile_pic = 'https://storage.googleapis.com/alsekka_profile_pics/customer_service.png';
    const { firstName } = useUserStore();
    const [chatMessages, setChatMessages] = useState([]);
    const [chatActive, setChatActive] = useState(false);
    const lastSender = useRef(false);
    const [loading, setLoading] = useState(true);

    const sendMessage = function () {
        if (!(messageText.trim())) return;
        setMessageText('');
        chatAPI.sendCSMessage(messageText).then(data => {
            setChatMessages([data].concat(chatMessages));
        }).catch(err => console.log(err.stack))
    };

    useEffect(function () {
        setLoading(true);
        chatAPI.csChatHistory().then((data) => {
            if (data.length !== 0) {
                setChatActive(true);
            }
            setChatMessages(data);
            setLoading(false);
        });
    }, []);

    function addMessage(msg) {
        setChatMessages(msg.concat(chatMessages));
    }

    useEffect(function () {
        if (!chatActive) {
            return;
        }

        const fetchNewMessages = async function () {
            chatAPI.findNewCSMessages().then(data => {
                if (data.length >= 1) {
                    addMessage(data);
                }
            }).catch(err => console.log(err));
        }

        const intervalId = setInterval(function () {
            fetchNewMessages();
        }, 10000);


        return () => clearInterval(intervalId);
    }, [chatMessages, chatActive]);

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events    


    return (
        <ScreenWrapper screenName={t('customer_service')} navType='back' navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={[styles.flexGrow, styles.pv8, styles.alignCenter]}
                ref={ref}
                onContentSizeChange={() => ref.current.scrollToEnd({ animated: true })}>
                {!loading &&
                    <>
                        <View key={"message_default"} style={[chatStyles.message, styles.alignStart]}>
                            <View style={{ height: 50 * rem, width: 50 * rem }}>
                                <FastImage
                                    source={{ uri: cs_profile_pic }}
                                    style={chatStyles.profilePicture}
                                />
                            </View>
                            <View style={chatStyles.receiverBubble}>
                                <Text style={[styles.text, chatStyles.receiverBubbleText]}>
                                    {translatedFormat(t('cs_chat_message'), [firstName])}
                                </Text>
                            </View>
                        </View>

                        {
                            chatMessages &&
                            chatMessages.slice(0).reverse().map((data, index) => {
                                const oldLastSender = lastSender.current;

                                if (data.sentByUser === true) {
                                    // I'm the sender
                                    lastSender.current = true;
                                    return (
                                        <View key={"message" + index} style={[chatStyles.message, styles.alignEnd]}>
                                            <View style={chatStyles.senderBubble}>
                                                <Text style={[styles.text, chatStyles.senderBubbleText]}>{data.message}</Text>
                                            </View>
                                            <View style={{ width: 50 * rem, height: 50 * rem }}>
                                                {(oldLastSender === null || !oldLastSender) &&
                                                    <FastImage source={{ uri: userStore.profilePicture }} style={chatStyles.profilePicture} />
                                                }
                                            </View>
                                        </View>);
                                } else {
                                    // He's the sender
                                    lastSender.current = false;
                                    return (
                                        <View key={"message" + index} style={[chatStyles.message, styles.alignStart]}>
                                            <View style={{ height: 50 * rem, width: 50 * rem }}>
                                                {(oldLastSender === null || oldLastSender) && <FastImage source={{ uri: cs_profile_pic }} style={chatStyles.profilePicture} />}
                                            </View>
                                            <View style={chatStyles.receiverBubble}>
                                                <Text style={[styles.text, chatStyles.receiverBubbleText]}>{data.message}</Text>
                                            </View>
                                        </View>
                                    );
                                }
                            })
                        }
                    </>
                }

                {
                    loading &&
                    <>
                        <View style={[styles.w100]}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item alignSelf='center' flexDirection='row' width={'90%'} height={65 * rem} marginTop={10 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item alignSelf='center' flexDirection='row' width={'90%'} height={65 * rem} marginTop={10 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item alignSelf='center' flexDirection='row' width={'90%'} height={65 * rem} marginTop={10 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item alignSelf='center' flexDirection='row' width={'90%'} height={65 * rem} marginTop={10 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item alignSelf='center' flexDirection='row' width={'90%'} height={65 * rem} marginTop={10 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item alignSelf='center' flexDirection='row' width={'90%'} height={65 * rem} marginTop={10 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item alignSelf='center' flexDirection='row' width={'90%'} height={65 * rem} marginTop={10 * rem} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }


            </ScrollView>
            <View style={[styles.ph16, styles.w100, styles.flexRow, styles.mb5]}>
                <View style={chatStyles.messageView}>
                    <TextInput style={[styles.text, styles.flexOne]} placeholderTextColor={palette.dark} placeholder={t('send_a_message')} value={messageText} onChangeText={(text) => { setMessageText(text) }} />
                </View>
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.9} style={chatStyles.sendBtn}>
                    <MaterialIcons name="send" size={22} color={palette.white} />
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};



export default CustomerService;
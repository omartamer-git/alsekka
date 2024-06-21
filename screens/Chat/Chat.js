import React, { useEffect, useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { chatStyles, palette, rem, styles } from '../../helper';

import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useUserStore from '../../api/accountAPI';
import * as chatAPI from '../../api/chatAPI';
import ScreenWrapper from '../ScreenWrapper';


function Chat({ navigation, route }) {
    const { receiver } = route.params;
    const [receiverData, setReceiverData] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    const userStore = useUserStore();

    const ref = useRef();
    const lastSender = useRef(null);
    const [loading, setLoading] = useState(true);

    const sendMessage = function () {
        if (!(messageText.trim())) return;
        setMessageText('');

        chatAPI.sendMessage(receiver, messageText).then(
            data => {
                setChatMessages(data.concat(chatMessages));
            }
        );
    };

    useEffect(function () {
        setLoading(true);
        Promise.all([
            chatAPI.loadChat(receiver),
            chatAPI.chatHistory(receiver)
        ])
            .then(([receiverData, chatMessages]) => {
                setReceiverData(receiverData);
                setChatMessages(chatMessages.chat);
                setLoading(false);
                if (chatMessages.readCount !== 0) {
                    userStore.setUnreadMessages(u => u - parseInt(chatMessages.readCount));
                }
            })
            .catch(error => {
                console.log(error)
                // Handle error if needed
            });
    }, []);

    useEffect(function () {
        const fetchNewMessages = async function () {
            // Make an API call to get the latest messages
            chatAPI.findNewMessages(receiver).then(
                data => {
                    if (data.length >= 1) {
                        setChatMessages(data.concat(chatMessages));
                    }
                }
            );
        };

        // Schedule polling for new messages every 10 seconds
        const intervalId = setInterval(function () {
            fetchNewMessages();
        }, 10000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [chatMessages]);


    const { t } = useTranslation();

    const insets = useSafeAreaInsets();


    return (
        <ScreenWrapper screenName={t('chat')} navAction={() => navigation.goBack()} navType="back">
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={[styles.flexGrow, styles.pv8, styles.alignCenter]}
                ref={ref}
                onContentSizeChange={() => ref.current.scrollToEnd({ animated: true })}>
                {
                    !loading &&
                    chatMessages &&
                    chatMessages.slice(0).reverse().map((data, index) => {
                        const oldLastSender = lastSender.current;

                        if (data.senderId === userStore.id) {
                            // I'm the sender
                            lastSender.current = true;
                            return (
                                <View key={"message" + index} style={[chatStyles.message, styles.alignEnd]}>
                                    <View style={chatStyles.senderBubble}>
                                        <Text style={[styles.text, chatStyles.senderBubbleText]}>{data.message}</Text>
                                    </View>
                                    <View style={{ width: 50 * rem, height: 50 * rem }}>
                                        <FastImage source={{ uri: userStore.profilePicture }} style={chatStyles.profilePicture} />
                                    </View>
                                </View>);
                        } else {
                            // He's the sender
                            lastSender.current = false;
                            return (
                                <View key={"message" + index} style={[chatStyles.message, styles.alignStart]}>
                                    <View style={{ height: 50 * rem, width: 50 * rem }}>
                                        <FastImage source={{ uri: receiverData.profilePicture }} style={chatStyles.profilePicture} />
                                    </View>
                                    <View style={chatStyles.receiverBubble}>
                                        <Text style={[styles.text, chatStyles.receiverBubbleText]}>{data.message}</Text>
                                    </View>
                                </View>
                            );
                        }
                    })
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

                <View style={styles.flexOne} />
            </ScrollView>

            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.select({ ios: 80 })} style={[styles.w100]}>
                <View behavior='height' style={[styles.ph16, styles.w100, styles.flexRow, { paddingBottom: insets.bottom, paddingHorizontal: 12 * rem, alignSelf: 'flex-end' }]}>
                    <View style={chatStyles.messageView}>
                        <TextInput style={[styles.text, styles.flexOne]} placeholderTextColor={palette.dark} placeholder={t('send_a_message')} value={messageText} onPressIn={() => {
                            setTimeout(
                                () => ref.current.scrollToEnd({ animated: true }), 400)
                        }} onChangeText={(text) => { setMessageText(text) }} />
                    </View>
                    <TouchableOpacity onPress={sendMessage} activeOpacity={0.9} style={chatStyles.sendBtn}>
                        <MaterialIcons name="send" size={22} color={palette.white} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ScreenWrapper >
    );
};

export default Chat;
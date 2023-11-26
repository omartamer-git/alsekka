import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { chatStyles, palette, rem, styles } from '../../helper';

import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useUserStore from '../../api/accountAPI';
import * as chatAPI from '../../api/chatAPI';
import ScreenWrapper from '../ScreenWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Chat = ({ navigation, route }) => {
    const { receiver } = route.params;
    const [receiverData, setReceiverData] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageText, setMessageText] = useState('');

    const userStore = useUserStore();

    const ref = useRef();
    const lastSender = useRef(null);
    const [loading, setLoading] = useState(true);

    const sendMessage = () => {
        if (!(messageText.trim())) return;
        setMessageText('');

        chatAPI.sendMessage(receiver, messageText).then(
            data => {
                setChatMessages(data.concat(chatMessages));
            }
        );
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([
            chatAPI.loadChat(receiver),
            chatAPI.chatHistory(receiver)
        ])
            .then(([receiverData, chatMessages]) => {
                setReceiverData(receiverData);
                setChatMessages(chatMessages);
                setLoading(false);
            })
            .catch(error => {
                // Handle error if needed
            });
    }, []);

    useEffect(() => {
        const fetchNewMessages = async () => {
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
        const intervalId = setInterval(() => {
            fetchNewMessages();
        }, 10000);

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [chatMessages]);

    const onFocusEffect = useCallback(() => {
        if (Platform.OS === 'ios') {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return () => {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }
    }, []);


    useFocusEffect(onFocusEffect); // register callback to focus events    




    const { t } = useTranslation();

    const insets = useSafeAreaInsets();
    console.log(insets);
    return (
        <ScreenWrapper screenName={t('chat')} navAction={() => navigation.goBack()} navType="back">
            <ScrollView style={styles.flexOne} contentContainerStyle={[styles.flexGrow, styles.pv8, styles.alignCenter]}
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
                                        <Image source={{ uri: userStore.profilePicture }} width={50} height={50} style={chatStyles.profilePicture} />
                                    </View>
                                </View>);
                        } else {
                            // He's the sender
                            lastSender.current = false;
                            return (
                                <View key={"message" + index} style={[chatStyles.message, styles.alignStart]}>
                                    <View style={{ height: 50 * rem, width: 50 * rem }}>
                                        <Image source={{ uri: receiverData.profilePicture }} width={50} height={50} style={chatStyles.profilePicture} />
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

                <View style={{ flex: 1 }} />

                <View style={[styles.ph16, styles.w100, styles.flexRow, styles.mb5, { paddingBottom: insets.bottom, paddingHorizontal: 12 * rem, alignSelf: 'flex-end' }]}>
                    <View style={chatStyles.messageView}>
                        <TextInput style={[styles.text, styles.flexOne]} placeholderTextColor={palette.dark} placeholder={t('send_a_message')} value={messageText} onChangeText={(text) => { setMessageText(text) }} />
                    </View>
                    <TouchableOpacity onPress={sendMessage} activeOpacity={0.9} style={chatStyles.sendBtn}>
                        <MaterialIcons name="send" size={22} color={palette.white} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ScreenWrapper >
    );
};

export default Chat;
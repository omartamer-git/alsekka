import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView,
    Dimensions,
    KeyboardAvoidingView,
    StyleSheet
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, rem } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import * as chatAPI from '../../api/chatAPI';
import ScreenWrapper from '../ScreenWrapper';


const Chat = ({ navigation, route }) => {
    const { receiver } = route.params;
    const [receiverData, setReceiverData] = useState(null);
    const [chatMessages, setChatMessages] = useState(null);
    const [messageText, setMessageText] = useState('');
    const ref = useRef();
    let lastSender = null;

    const sendMessage = () => {
        console.log(receiver);
        chatAPI.sendMessage(receiver, messageText).then(
            data => {
                setChatMessages(data.concat(chatMessages));
                console.log(data);
                setMessageText('');
            }
        );
    };

    useEffect(() => {
        chatAPI.loadChat(receiver).then((data) => {
            setReceiverData(data);
        });


        chatAPI.chatHistory(receiver).then((data) => {
            setChatMessages(data);
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
    }, [chatMessages])


    const isDarkMode = useColorScheme === 'dark';

    return (
        <ScreenWrapper screenName="Chat" navAction={() => navigation.goBack()} navType="back">
            <ScrollView style={styles.flexOne} contentContainerStyle={[styles.flexGrow, styles.pv8, styles.alignCenter]}
            ref={ref}
            onContentSizeChange={() => ref.current.scrollToEnd({animated: true})}>
                {
                    chatMessages &&
                    chatMessages.slice(0).reverse().map((data, index) => {
                        const oldLastSender = lastSender;

                        if (data.senderId === globalVars.getUserId()) {
                            // I'm the sender
                            lastSender = true;
                            return (
                                <View key={"message" + index} style={[chatStyles.message, styles.alignEnd]}>
                                    <View style={chatStyles.senderBubble}>
                                        <Text style={chatStyles.senderBubbleText}>{data.message}</Text>
                                    </View>
                                    <View style={{ width: 50 * rem, height: 50 * rem }}>
                                        {(oldLastSender === null || !oldLastSender) &&
                                            <Image source={{ uri: globalVars.getProfilePicture() }} width={50} height={50} style={chatStyles.profilePicture} />
                                        }
                                    </View>
                                </View>);
                        } else {
                            // He's the sender
                            lastSender = false;
                            return (
                                <View key={"message" + index} style={[chatStyles.message, styles.alignStart]}>
                                    <View style={{ height: 50 * rem, width: 50 * rem }}>
                                        {(oldLastSender === null || oldLastSender) && <Image source={{ uri: receiverData.profilePicture }} width={50} height={50} style={chatStyles.profilePicture} />}
                                    </View>
                                    <View style={chatStyles.receiverBubble}>
                                        <Text style={chatStyles.receiverBubbleText}>{data.message}</Text>
                                    </View>
                                </View>
                            );
                        }
                    })
                }
            </ScrollView>
            <View style={[styles.ph16, styles.w100, styles.flexRow, styles.mb5]}>
                <View style={chatStyles.messageView}>
                    <TextInput style={styles.flexOne} placeholder="Send a message..." value={messageText} onChangeText={(text) => { setMessageText(text) }} />
                </View>
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.9} style={chatStyles.sendBtn}>
                    <MaterialIcons name="send" size={22} color={palette.white} />
                </TouchableOpacity>
            </View>
        </ScreenWrapper >
    );
};

const chatStyles = StyleSheet.create({
    message: {
        ...styles.flexRow,
        ...styles.mt10,
        width: '80%',
    },
    receiverBubble: {
        ...styles.flexOne,
        ...styles.p16,
        ...styles.bgAccent,
        ...styles.br8,
        ...styles.ml10
    },
    receiverBubbleText: {
        ...styles.white,
    },

    senderBubble: {
        ...styles.flexOne,
        ...styles.p16,
        ...styles.bgPrimary,
        ...styles.br8,
        ...styles.mr10
    },
    senderBubbleText: {
        ...styles.white
    },
    profilePicture: {
        borderRadius: 25,
        ...styles.border1,
        ...styles.borderAccent
    },
    messageView: {
        ...styles.flexOne,
        height: 48 * rem,
        ...styles.border1,
        ...styles.br8,
        ...styles.pl16,
        ...styles.borderLight
    },
    sendBtn: {
        ...styles.fullCenter,
        ...styles.border1,
        ...styles.borderDark,
        ...styles.bgPrimary,
        height: 48 * rem,
        width: 48 * rem,
        borderRadius: 48 * rem/2,
        ...styles.ml10
    }
});

export default Chat;
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
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HeaderView from '../components/HeaderView';
import AutoComplete from '../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../components/FromToIndicator';
import AvailableRide from '../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';


const Chat = ({ navigation, route }) => {
    const { receiver } = route.params;
    const [receiverData, setReceiverData] = useState(null);
    const [chatMessages, setChatMessages] = useState(null);
    const [messageText, setMessageText] = useState('');
    let lastSender = null;

    const sendMessage = () => {
        let url = SERVER_URL + `/sendmessage?uid=${globalVars.getUserId()}&receiver=${receiver}&message=${messageText}`;

        fetch(url).then(response => response.json()).then(
            data => {
                setChatMessages(
                    [{
                        "datetime": new Date().toISOString(),
                        "id": data.id,
                        "message": messageText,
                        "receiver": receiver,
                        "sender": globalVars.getUserId(),
                    }].concat(chatMessages));
                setMessageText('');
                console.log(data);
            }
        );
    };
    useEffect(() => {

        let url = SERVER_URL + `/loadchat?receiver=${receiver}`;

        fetch(url).then(response => response.json()).then(
            data => {
                console.log(data);
                setReceiverData(data);
            }
        );


        url = SERVER_URL + `/chathistory?uid=${globalVars.getUserId()}&receiver=${receiver}`;
        fetch(url).then(response => response.json()).then(
            data => {
                setChatMessages(data);
                console.log(data);
            }
        );
    }, []);

    useEffect(() => {
        const fetchNewMessages = async () => {
            // Make an API call to get the latest messages
            const newMessagesUrl = SERVER_URL + `/newmessages?uid=${globalVars.getUserId()}&receiver=${receiver}`;
            console.log(newMessagesUrl);
            fetch(newMessagesUrl).then(response => response.json()).then(
                data => {
                    console.log(data);
                    console.log(" CHAT MESSAGES ");
                    console.log(chatMessages);
                    console.log("DATA");
                    console.log(data);
                    console.log(data.concat(chatMessages));
                    if (data.length >= 1) {
                        // console.log([...chatMessages, data]);

                        setChatMessages(data.concat(chatMessages));
                    }
                }
            );
            // Update the messages state with the new messages
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
        <KeyboardAvoidingView behavior='padding' style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                {receiverData && <HeaderView navType="back" screenName={`Chat`} borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>}
            </SafeAreaView>

            <View style={styles.wrapper}>
                <SafeAreaView style={{ backgroundColor: palette.inputbg, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                    </View>

                    <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', justifyContent: 'flex-start', flex: 0 }]}>
                        {
                            chatMessages &&
                            chatMessages.slice(0).reverse().map((data, index) => {
                                const oldLastSender = lastSender;

                                if (data.sender === globalVars.getUserId()) {
                                    // I'm the sender
                                    lastSender = true;
                                    return (<View key={"message" + index} style={{ flexDirection: 'row', marginTop: 10, alignSelf: 'flex-end' }}>
                                        <View style={chatStyles.senderBubble}>
                                            <Text style={chatStyles.senderBubbleText}>{data.message}</Text>
                                        </View>
                                        <View style={{ width: 50, height: 50 }}>
                                            {(oldLastSender === null || !oldLastSender) &&
                                                <Image source={{ uri: globalVars.getProfilePicture() }} width={50} height={50} style={chatStyles.profilePicture} />
                                            }
                                        </View>
                                    </View>);
                                } else {
                                    // He's the sender
                                    lastSender = false;
                                    return (
                                        <View key={"message" + index} style={{ flexDirection: 'row', marginTop: 10, alignSelf: 'flex-start' }}>
                                            <View style={{ height: 50, width: 50 }}>
                                                { (oldLastSender === null || oldLastSender) && <Image source={{ uri: receiverData.profilePicture }} width={50} height={50} style={chatStyles.profilePicture} /> }
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
                    <View style={{ paddingLeft: 16, paddingRight: 16, width: '100%', flexDirection: 'row', marginBottom: 5 }}>
                        <View style={{ flex: 1, height: 48, borderWidth: 1, borderRadius: 8, paddingLeft: 16, borderColor: palette.light }}>
                            <TextInput style={{ width: '100%', flex: 1 }} placeholder="Send a message..." value={messageText} onChangeText={(text) => { setMessageText(text) }} />
                        </View>
                        <TouchableOpacity onPress={sendMessage} activeOpacity={0.9} style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: palette.dark, backgroundColor: palette.primary, height: 48, width: 48, borderRadius: 24, marginLeft: 10 }}>
                            <MaterialIcons name="send" size={22} color={palette.white} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView >
            </View >
        </KeyboardAvoidingView >
    );
};

const chatStyles = StyleSheet.create({
    receiverBubble: {
        width: '60%',
        padding: 16,
        backgroundColor: palette.accent,
        borderRadius: 8,
        marginLeft: 10
    },
    receiverBubbleText: {
        color: palette.white
    },

    senderBubble: {
        width: '60%',
        padding: 16,
        backgroundColor: palette.primary,
        borderRadius: 8,
        marginRight: 10
    },
    senderBubbleText: {
        color: palette.white
    },
    profilePicture: {
        borderRadius: 25,
        borderWidth: 1,
        borderColor: palette.accent
    }
});

export default Chat;
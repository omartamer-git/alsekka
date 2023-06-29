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
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import * as chatAPI from '../../api/chatAPI';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import ScreenWrapper from '../ScreenWrapper';


const ChatsList = ({ navigation, route }) => {
    const [chats, setChats] = useState(null);
    useEffect(() => {
        chatAPI.getChats().then((data) => {
            setChats(data)
        });
    }, []);


    const isDarkMode = useColorScheme === 'dark';

    return (
        <ScreenWrapper screenName="Chats" navAction={() => navigation.goBack()} navType="back">
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    chats &&
                    chats.map((data, index) => {
                        const secondParty = data.Sender === null ? data.Receiver : data.Sender;
                        console.log(secondParty);
                        return (
                            <TouchableOpacity onPress={() => { navigation.navigate('Chat', { receiver: data.senderId == globalVars.getUserId() ? data.receiverId : data.senderId }) }} activeOpacity={0.9} key={"chat" + index} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderColor: palette.light }}>
                                <Image source={{ uri: secondParty.profilePicture }} width={60} height={60} style={{ borderRadius: 60 / 2, borderWidth: 1, borderColor: palette.accent }} />
                                <View style={[styles.flexRow, styles.flexOne, styles.spaceBetween, styles.alignCenter]}>
                                    <Text style={[styles.ml10, styles.semiBold, styles.font18]}>{secondParty.firstName} {secondParty.lastName}</Text>
                                    <MaterialIcons name="arrow-forward-ios" size={18} />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        </ScreenWrapper>

    );
};

export default ChatsList;
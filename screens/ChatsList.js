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


const ChatsList = ({ navigation, route }) => {
    const [chats, setChats] = useState(null);
    useEffect(() => {
        url = SERVER_URL + `/chats?uid=${globalVars.getUserId()}`;
        fetch(url).then(response => response.json()).then(
            data => {
                setChats(data);
            }
        );
    }, []);


    const isDarkMode = useColorScheme === 'dark';

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                 <HeaderView navType="back" screenName={`Chats`} borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <View style={styles.wrapper}>
                <SafeAreaView style={{ backgroundColor: palette.inputbg, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                    </View>

                    <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', justifyContent: 'flex-start', flex: 0 }]}>
                    {
                        chats &&
                        chats.map((data, index) => {
                            return (
                                <TouchableOpacity onPress={() => { navigation.navigate('Chat', {receiver: data.id}) }} activeOpacity={0.9} key={"chat" + index} style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderColor: palette.light}}>
                                    <Image source={{uri: data.profilePicture}} width={60} height={60} style={{borderRadius: 60/2, borderWidth: 1, borderColor: palette.accent}}/>
                                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Text style={{marginLeft: 10, fontWeight: '500', fontSize: 18}}>{data.firstName} {data.lastName}</Text>
                                        <MaterialIcons name="arrow-forward-ios" size={18} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })
                    }
                    </ScrollView>
                </SafeAreaView >
            </View >
        </View >
    );
};

export default ChatsList;
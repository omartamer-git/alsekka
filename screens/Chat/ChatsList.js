import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { containerStyle, palette, styles } from '../../helper';

import useUserStore from '../../api/accountAPI';
import * as chatAPI from '../../api/chatAPI';
import ScreenWrapper from '../ScreenWrapper';


const ChatsList = ({ navigation, route }) => {
    const [chats, setChats] = useState(null);
    const userStore = useUserStore();
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
                            <TouchableOpacity onPress={() => { navigation.navigate('Chat', { receiver: data.senderId == userStore.id ? data.receiverId : data.senderId }) }} activeOpacity={0.9} key={"chat" + index} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingTop: 8, paddingBottom: 8, borderBottomWidth: 1, borderColor: palette.light }}>
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
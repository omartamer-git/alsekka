import React, { useState, useRef, useEffect } from 'react';
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
    ScrollView
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import * as accountAPI from '../../api/accountAPI';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Card from '../../components/Card';
import Visa from '../../svgs/visa';
import Mastercard from '../../svgs/mastercard';
import ScreenWrapper from '../ScreenWrapper';


const Wallet = ({ navigation, route }) => {
    const [balance, setBalance] = useState(0);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        accountAPI.getWallet().then((data) => {
            setBalance(data.balance);
            setCards(data.cards);
        })
    }, []);

    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const isDarkMode = useColorScheme === 'dark';

    return (
        <ScreenWrapper screenName="Wallet" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={containerStyle}>
                <Text style={styles.headerText}>Wallet</Text>
                <LinearGradient colors={[palette.primary, palette.secondary]} style={{ width: '100%', height: 200, borderRadius: 16, padding: 24, marginTop: 16 }}>
                    <Text style={[styles.white, { fontWeight: '600' }]}>Balance</Text>
                    <Text style={[styles.headerText, styles.white]}>EGP {balance}</Text>
                    {/* <View style={{ flex: 1 }} /> */}
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Button text="Add Balance" bgColor={palette.white} style={{ flex: 0.5 }} />
                    </View>
                </LinearGradient>

                <Text style={[styles.headerText3, { marginTop: 16 }]}>Payment Methods</Text>
                {
                    cards.map((data, index) => {
                        return (
                            <Card type={data.type} number={data.number} key={"card" + index} />
                        );
                    })
                }
                <TouchableOpacity onPress={() => { navigation.navigate('Add Card') }} activeOpacity={0.9} style={{ height: 44, width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', backgroundColor: palette.light, borderRadius: 4, paddingLeft: 12, paddingRight: 12, marginTop: 16 }}>
                    <MaterialIcons name="add" size={18} color={palette.dark} />
                    <Text style={{ color: palette.dark, fontWeight: '600', marginLeft: 16 }}>Add Payment Method</Text>
                </TouchableOpacity>

                <Text style={[styles.headerText3, { marginTop: 16 }]}>Withdrawal Options</Text>
                <TouchableOpacity onPress={() => { navigation.navigate('Add Bank') }} activeOpacity={0.9} style={{ height: 44, width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', backgroundColor: palette.light, borderRadius: 4, paddingLeft: 12, paddingRight: 12, marginTop: 16 }}>
                    <MaterialIcons name="account-balance" size={18} color={palette.dark} />
                    <Text style={{ color: palette.dark, fontWeight: '600', marginLeft: 16 }}>Add Bank Account</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.9} style={{ height: 44, width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', backgroundColor: palette.light, borderRadius: 4, paddingLeft: 12, paddingRight: 12, marginTop: 16 }}>
                    <MaterialIcons name="wallet-travel" size={18} color={palette.dark} />
                    <Text style={{ color: palette.dark, fontWeight: '600', marginLeft: 16 }}>Add Mobile Wallet</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default Wallet;
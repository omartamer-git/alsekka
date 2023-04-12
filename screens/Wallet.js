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
    Platform
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
import Card from '../components/Card';
import Visa from '../svgs/visa';
import Mastercard from '../svgs/mastercard';


const Wallet = ({ navigation, route }) => {
    const [balance, setBalance] = useState(0);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetch(SERVER_URL + `/wallet?uid=${globalVars.getUserId()}`).then(response => response.json()).then(
            data => {
                if (data.length != 0) {
                    setBalance(data.balance);
                    setCards(data.cards);
                }
            }
        );
    }, []);

    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const isDarkMode = useColorScheme === 'dark';

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Wallet" borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <View style={styles.wrapper}>
                <SafeAreaView style={{ backgroundColor: palette.white, borderRadius: 10, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    </View>

                    <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1 }]}>
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
                                    <Card type={data.type} number={data.number} key={"card" + index}/>
                                );
                            })
                        }
                        <TouchableOpacity onPress={() => { navigation.navigate('Add Card') }} activeOpacity={0.9} style={{ height: 44, width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', backgroundColor: palette.light, borderRadius: 4, paddingLeft: 12, paddingRight: 12, marginTop: 16 }}>
                            <MaterialIcons name="add" size={18} color={palette.dark} />
                            <Text style={{ color: palette.dark, fontWeight: '600', marginLeft: 16 }}>Add Payment Method</Text>
                        </TouchableOpacity>

                        <Text style={[styles.headerText3, { marginTop: 16 }]}>Withdrawal Options</Text>
                        <TouchableOpacity activeOpacity={0.9} style={{ height: 44, width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', backgroundColor: palette.light, borderRadius: 4, paddingLeft: 12, paddingRight: 12, marginTop: 16 }}>
                            <MaterialIcons name="account-balance" size={18} color={palette.dark} />
                            <Text style={{ color: palette.dark, fontWeight: '600', marginLeft: 16 }}>Add Bank Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.9} style={{ height: 44, width: '100%', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', backgroundColor: palette.light, borderRadius: 4, paddingLeft: 12, paddingRight: 12, marginTop: 16 }}>
                            <MaterialIcons name="wallet-travel" size={18} color={palette.dark} />
                            <Text style={{ color: palette.dark, fontWeight: '600', marginLeft: 16 }}>Add Mobile Wallet</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View >
        </View >
    );
};

export default Wallet;
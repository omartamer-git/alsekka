import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../components/HeaderView';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';

const Account = ({ route, navigation }) => {
    const isDarkMode = useColorScheme === 'dark';
    const [ratings, setRatings] = useState(null);

    useEffect(() => {
        const fullStars = Math.floor(globalVars.getRating());
        const halfStars = Math.ceil(globalVars.getRating()) - Math.abs(globalVars.getRating());

        let ratingsItems = [];
        for (let i = 0; i < fullStars; i++) {
            ratingsItems.push(<MaterialIcons key={"fullStar" + i} name="star" color={palette.secondary} />);
        }

        for (let j = 0; j < halfStars; j++) {
            ratingsItems.push(<MaterialIcons key={"halfStar" + j} name="star-half" color={palette.secondary} />);
        }
        
        setRatings(ratingsItems);
    }, []);

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Account" borderVisible={false} action={() => { navigation.goBack() }} >
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

                    <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5 }]}>
                        <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ width: 110, height: 110, borderRadius: 110 / 2, borderColor: palette.primary, borderWidth: 3, alignItems: 'center', justifyContent: 'center' }}>
                                {globalVars.getProfilePicture() && <Image source={{ uri: globalVars.getProfilePicture() }} style={{ height: 100, width: 100, resizeMode: 'center', borderRadius: 50, borderWidth: 2, borderColor: palette.white }} />}

                                <View style={{ position: 'absolute', borderRadius: 50, width: 100, height: 100, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(125,125,125,0.5)' }}>
                                    <MaterialIcons name="photo-camera" size={50} style={{ borderRadius: 50, position: 'absolute' }} color={palette.light} />
                                </View>


                            </View>
                        </View>

                        <View style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={styles.headerText2}>{globalVars.getFirstName()} {globalVars.getLastName()}</Text>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                {ratings}
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', height: 100, paddingTop: 20, paddingBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity style={{ backgroundColor: palette.primary, height: 80, flex:1, marginLeft: 5, marinRight: 5, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                                    <MaterialIcons name="message" size={40} color={palette.white} />
                                    <Text style={{ color: palette.white, fontWeight: '600', marginTop: 5 }}>Messages</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: palette.primary, height: 80, flex: 1, marginLeft: 5, marinRight: 5, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }} onPress={() => {  navigation.navigate('Wallet') }}>
                                    <MaterialIcons name="account-balance-wallet" size={40} color={palette.white} />
                                    <Text style={{ color: palette.white, fontWeight: '600', marginTop: 5 }}>Wallet</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ backgroundColor: palette.primary, height: 80, flex: 1, marginLeft: 5, marinRight: 5, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }} onPress={() => { navigation.navigate('All Trips') }}>
                                    <MaterialIcons name="history" size={40} color={palette.white} />
                                    <Text style={{ color: palette.white, fontWeight: '600', marginTop: 5 }}>Trips</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: '100%' }}>
                                <Button text="Manage My Cars" textColor={palette.white} bgColor={palette.primary} onPress={() => { navigation.navigate('Manage Cars') }}/>
                                <CustomTextInput
                                    value={globalVars.getFirstName() + " " + globalVars.getLastName()}
                                    iconLeft="badge"
                                    iconRight="edit"
                                    editable={false}
                                    style={{ backgroundColor: palette.white }}
                                />
                                <CustomTextInput
                                    value={globalVars.getPhone()}
                                    iconLeft="phone"
                                    iconRight="edit"
                                    editable={false}
                                    style={{ backgroundColor: palette.white }}
                                />
                                <CustomTextInput
                                    value={globalVars.getEmail()}
                                    iconLeft="mail"
                                    iconRight="edit"
                                    editable={false}
                                    style={{ backgroundColor: palette.white }}
                                />
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default Account;
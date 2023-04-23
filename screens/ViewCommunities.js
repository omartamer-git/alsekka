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
    ScrollView,
    Dimensions
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
import CommunityCard from '../components/CommunityCard';


const ViewCommunities = ({ navigation, route }) => {
    const [communities, setCommunities] = useState(null);
    const [feed, setFeed] = useState(null);
    useEffect(() => {
        fetch(SERVER_URL + `/communities`).then(response => response.json()).then(
            data => {
                if (data.length != 0) {
                    setCommunities(data);
                }
            }
        );

        fetch(SERVER_URL + `/myfeed?uid=${globalVars.getUserId()}`).then(response => response.json()).then(
            data => {
                if (data.length != 0) {
                    setFeed(data);
                }
            }
        );


    }, []);

    const isDarkMode = useColorScheme === 'dark';

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Communities" borderVisible={false} action={() => { navigation.goBack() }} >
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
                        <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',marginTop: 20}}>
                            <Text style={[styles.headerText2]}>Communities</Text>
                            <MaterialIcons name="search" size={24} />
                        </View>

                        <View style={{ flex: 1, width: '100%', marginTop: 10, borderTopWidth: 1, borderTopColor: palette.light }}>
                            <Text style={[styles.headerText3, { marginTop: 10 }]}>Your Feed</Text>
                            {
                                feed && feed.map((data, index) => {
                                    const nextRideDate = new Date(data.datetime);
                                    return (
                                        <View style={{ flex: 1, width: '100%' }} key={"feed" + index}>
                                            <AvailableRide rid={data.ride_id} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} pricePerSeat={data.pricePerSeat} seatsOccupied={data.seatsOccupied} driverName={data.firstName + " " + data.lastName} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={{ marginTop: 10 }} />
                                            <Text style={{ marginLeft: 5, marginTop: 5, color: palette.dark, fontSize: 12 }}>Posted by {data.firstName} {data.lastName} in {data.community_name}</Text>
                                        </View>
                                    );
                                })
                            }
                            <Text style={{alignSelf: 'center', marginTop: 10, fontWeight: '600', color: palette.accent}}>See More</Text>
                        </View>

                        <View style={{ flex: 1, width: '100%', marginTop: 10, borderTopWidth: 1, borderTopColor: palette.light }}>
                            <Text style={[styles.headerText3, { marginTop: 10 }]}>Recommended Communities</Text>
                            {
                                communities && communities.map((data, index) => {
                                    console.log(data);
                                    return (<CommunityCard key={"communitycard" + index} name={data.name} picture={data.picture} description={data.description} style={{ marginTop: 10 }} />);
                                })
                            }
                        </View>

                    </ScrollView>
                </SafeAreaView>
            </View >
        </View >
    );
};

export default ViewCommunities;
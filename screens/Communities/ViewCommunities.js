import React, { useState, useRef, useEffect, useCallback } from 'react';
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
    RefreshControl
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
import * as communitiesAPI from '../../api/communitiesAPI';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import CommunityCard from '../../components/CommunityCard';
import ScreenWrapper from '../ScreenWrapper';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { useFocusEffect } from '@react-navigation/native';


const ViewCommunities = ({ navigation, route }) => {
    const [communities, setCommunities] = useState(null);
    const [feed, setFeed] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        loadFeed();
        setRefreshing(false);
    };

    useEffect(() => {
        loadFeed();
    }, []);

    const loadFeed = () => {
        communitiesAPI.getCommunities().then(
            data => {
                if (data.length != 0) {
                    setCommunities(data);
                }
            }
        );

        communitiesAPI.communitiesFeed().then(
            data => {
                if (data.length != 0) {
                    setFeed(data);
                }
            }
        );
    };

    const onFocusEffect = useCallback(() => {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setShouldMimicIOSBehavior(true);
        AvoidSoftInput.setEnabled(true);
        return () => {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
            AvoidSoftInput.setShouldMimicIOSBehavior(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events



    return (
        <ScreenWrapper screenName={"Communities"}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}  >
                <View style={[styles.w100, styles.flexRow, styles.alignCenter, styles.spaceBetween, styles.mt20]}>
                    <Text style={[styles.headerText2]}>Communities</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Search Communities')}><MaterialIcons name="search" size={24} /></TouchableOpacity>
                </View>

                {feed && feed.length > 0 &&
                    <View style={[styles.w100, styles.mt10, styles.borderLight, styles.pb8, { borderTopWidth: 1 }]}>
                        <Text style={[styles.headerText3, styles.mt10]}>Your Feed</Text>
                        {
                            feed.map((data, index) => {
                                const nextRideDate = new Date(data.datetime);
                                return (
                                    <View style={[styles.flexOne, styles.w100]} key={"feed" + index}>
                                        <AvailableRide rid={data.ride_id} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} pricePerSeat={data.pricePerSeat} seatsOccupied={data.seatsOccupied} driverName={data.Driver.firstName + " " + data.Driver.lastName} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={styles.mt10} />
                                        <Text style={[styles.ml5, styles.mt5, styles.dark, styles.font12]}>Posted by {data.Driver.firstName} {data.Driver.lastName} in {data.Communities[0].community_name}</Text>
                                    </View>
                                );
                            })
                        }
                        <Text style={[styles.alignSelfCenter, styles.mt10, styles.bold, styles.accent]}>See More</Text>
                    </View>}

                <View style={[styles.flexOne, styles.mt10, styles.w100, styles.borderLight, { borderTopWidth: 1 }]}>
                    <Text style={[styles.headerText3, styles.mt10]}>Recommended Communities</Text>
                    {
                        communities && communities.map((data, index) => {
                            return (
                                <CommunityCard
                                    key={"communitycard" + index} name={data.name}
                                    picture={data.picture} description={data.description}
                                    style={styles.mt10}
                                    onPress={
                                        () => navigation.navigate('View Community', {
                                            communityId: data.id,
                                            communityName: data.name,
                                            communityPicture: data.picture,
                                            communityDescription: data.description,
                                            communityPrivacy: data.private
                                        })
                                    }
                                />);
                        })
                    }
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default ViewCommunities;
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
import { styles, palette, containerStyle, getDateShort, getTime } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import _debounce from 'lodash/debounce';
import HeaderView from '../../components/HeaderView';
import * as communitiesAPI from '../../api/communitiesAPI';
import ScreenWrapper from '../ScreenWrapper';
import CommunityCard from '../../components/CommunityCard';
import AvailableRide from '../../components/AvailableRide';
import CoffeeIcon from '../../svgs/coffee';


const ViewCommunity = ({ navigation, route }) => {
    const { communityId, communityName, communityPicture, communityDescription, communityPrivacy } = route.params;

    const [feed, setFeed] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [joinQuestion, setJoinQuestion] = useState(null);
    const [joinAnswer, setJoinAnswer] = useState(null);
    const [sentJoinRequest, setSentJoinRequest] = useState(false);

    useEffect(() => {
        communitiesAPI.getCommunityDetails(communityId).then(
            data => {
                if (data.Member.length !== 0) {
                    if (data.Member[0].CommunityMember.joinStatus === "PENDING") {
                        setSentJoinRequest(true);
                    } else {
                        loadFeed();
                    }
                } else {
                    setJoinQuestion(data.joinQuestion);
                }
            }
        ).catch(err => {
            console.log(err);
        });
    }, []);

    const joinCommunity = () => {
        console.log(joinAnswer);
        communitiesAPI.joinCommunity(communityId, joinAnswer).then(
            data => {
                if (communityPrivacy) {
                    setSentJoinRequest(true);
                } else {
                    loadFeed();
                }
            }
        ).catch(err => {
            console.log(err);
        });
    };

    const loadFeed = () => {
        setIsJoined(true);
        communitiesAPI.communitiesFeed(communityId).then(
            data => {
                setFeed(data);
            }
        ).catch(err => {
            console.log(err);
        }
        );
    }

    return (
        <ScreenWrapper screenName={"Search"} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                {isJoined && (
                    <>
                        <View style={[styles.flexRow, styles.justifyCenter, styles.alignCenter]}>
                            <Image width={44} height={44} style={{ borderRadius: 44 / 2 }} source={{ uri: 'data:image/png;base64,' + communityPicture }} />
                            <View style={[styles.ml10]}>
                                <Text style={[styles.font14, styles.dark, styles.bold]}>{communityName}</Text>
                                <View style={[styles.flexRow, styles.alignCenter, styles.justifyCenter]}>
                                    {communityPrivacy === true ? <MaterialIcons name="lock" /> : <MaterialIcons name="lock-open" />}
                                    <Text style={[styles.font12, styles.dark, styles.ml5]}>
                                        {communityPrivacy === true ? "Private Community" : "Public Community"}
                                    </Text>

                                </View>
                            </View>
                        </View>

                        {feed && feed.map((data, index) => {
                            const nextRideDate = new Date(data.datetime);
                            return (
                                <View style={[styles.flexOne, styles.w100]} key={"feed" + index}>
                                    <AvailableRide rid={data.ride_id} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} pricePerSeat={data.pricePerSeat} seatsOccupied={data.seatsOccupied} driverName={data.Driver.firstName + " " + data.Driver.lastName} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={styles.mt10} />
                                </View>
                            );
                        })}
                    </>
                )}




                {!isJoined && !sentJoinRequest && (
                    <>
                        <View style={[styles.justifyCenter, styles.alignCenter, styles.w100, styles.flexOne]}>
                            <Image width={80} height={80} style={{ borderRadius: 80 / 2 }} source={{ uri: 'data:image/png;base64,' + communityPicture }} />
                            <Text style={[styles.font18, styles.bold, styles.mt10]}>{communityName}</Text>
                            <View style={[styles.flexRow, styles.alignCenter, styles.justifyCenter]}>
                                <Text style={[styles.font12, styles.dark, styles.mr5]}>
                                    {communityPrivacy === true ? "Private Community" : "Public Community"}
                                </Text>
                                {communityPrivacy === true ? <MaterialIcons name="lock" /> : <MaterialIcons name="lock-open" />}
                            </View>
                            <Text style={[styles.font14, styles.mt10]}>{communityDescription}</Text>

                            {communityPrivacy && joinQuestion && (
                                <View style={[styles.w100, styles.mt10]}>
                                    <Text style={[styles.font14, styles.mt10, styles.textCenter, styles.w100]}>{joinQuestion}</Text>
                                    <CustomTextInput placeholder="Answer" style={[styles.mt10]} value={joinAnswer} onChangeText={(data) => setJoinAnswer(data)} />
                                </View>
                            )}

                            <Button text={communityPrivacy ? "Request to Join" : "Join Community"} bgColor={palette.primary} textColor={palette.white} style={[styles.mt10]} onPress={joinCommunity} />
                        </View>
                    </>
                )}

                {sentJoinRequest && (
                    <View style={[styles.justifyCenter, styles.alignCenter, styles.w100, styles.flexOne]}>
                        <CoffeeIcon width={200} height={200} />
                        <Text style={[styles.font28, styles.primary, styles.bold, styles.mt10]}>Hang tight!</Text>
                        <Text
                            style={[styles.font14, styles.mt10, styles.textCenter, styles.ph8]}>
                            Your request to join this community has been sent, and you'll be getting a reply soon!
                        </Text>
                        <Button text="Go Back" bgColor={palette.primary} textColor={palette.white} style={[styles.mt10]} onPress={() => navigation.goBack()} />
                    </View>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
};

export default ViewCommunity;
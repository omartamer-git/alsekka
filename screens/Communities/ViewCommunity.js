import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    I18nManager,
    Image,
    Platform,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import * as communitiesAPI from '../../api/communitiesAPI';
import AvailableRide from '../../components/AvailableRide';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import { containerStyle, palette, rem, styles } from '../../helper';
import CoffeeIcon from '../../svgs/coffee';
import ScreenWrapper from '../ScreenWrapper';
import FastImage from 'react-native-fast-image';


function ViewCommunity({ navigation, route }) {
    const { communityId, communityName, communityPicture, communityDescription, communityPrivacy } = route.params;

    const [name, setName] = useState(communityName);
    const [picture, setPicture] = useState(communityPicture);
    const [description, setDescription] = useState(communityDescription);
    const [privacy, setPrivacy] = useState(communityPrivacy);
    const [feed, setFeed] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [joinQuestion, setJoinQuestion] = useState(null);
    const [joinAnswer, setJoinAnswer] = useState(null);
    const [sentJoinRequest, setSentJoinRequest] = useState(false);
    const [owner, setOwner] = useState(false);
    const [loading, setLoading] = useState(true);

    const { id } = useUserStore();

    useEffect(function () {
        communitiesAPI.getCommunityDetails(communityId).then(
            data => {
                if (!name) {
                    setName(data.name);
                }
                if (!picture) {
                    setPicture(data.picture);
                }
                if (!description) {
                    setDescription(data.description);
                }
                if (!privacy) {
                    setPrivacy(data.private);
                }
                if (data.Member.length !== 0) {
                    if (data.Member[0].CommunityMember.joinStatus === "PENDING") {
                        setSentJoinRequest(true);
                        setLoading(false);
                    } else {
                        loadFeed();
                        if (data.OwnerId === id) {
                            setOwner(true);
                        }
                    }
                } else {
                    setLoading(false);
                }
                setJoinQuestion(data.joinQuestion);
            }
        ).catch(err => {
            console.log(err);
        });
    }, []);

    const joinCommunity = function () {
        communitiesAPI.joinCommunity(communityId, joinAnswer).then(
            data => {
                if (privacy) {
                    setSentJoinRequest(true);
                } else {
                    loadFeed();
                }
            }
        ).catch(err => {
            console.log(err);
        });
    };

    const [page, setPage] = useState(1);

    function loadFeed(page = 1) {
        setIsJoined(true);
        communitiesAPI.communitiesFeed(communityId, page).then(
            data => {
                if (page === 1) {
                    setFeed(data);
                } else {
                    setFeed(f => f.concat(data));
                }
                setLoading(false);
            }
        ).catch(err => {
            console.log(err);
        }
        );
    }

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events    

    const loadMore = function () {
        loadFeed(page + 1);
        setPage(p => p + 1);
    }

    const { t } = useTranslation();
    const shareMsg = `Hey 👋! Join our Seaats carpooling community, ${name}, save money, and make commutes fun! Click to join: https://seaats.app/share/community/${communityId} Let's ride together! 🚗💨`;
    const shareMsgAr = `انضم إلى مجتمعنا في مشاركة الرحلات على سيتس، ${name}! https://seaats.app/share/community/${communityId}`;
    const onShare = async function () {
        try {
            const result = await Share.share({
                message: I18nManager.isRTL ? shareMsgAr : shareMsg
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ScreenWrapper screenName={t('view_community')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                {!loading &&
                    <>
                        {isJoined && (
                            <>
                                <View style={[styles.flexRow, styles.justifyCenter, styles.alignCenter]}>
                                    <FastImage style={{ borderRadius: 44 / 2, width: 44, height: 44 }} source={{ uri: picture }} />
                                    <View style={[styles.ml10]}>
                                        <Text style={[styles.text, styles.font14, styles.dark, styles.bold]}>{name}</Text>
                                        <View style={[styles.flexRow, styles.alignCenter]}>
                                            {privacy === true ? <MaterialIcons name="lock" /> : <MaterialIcons name="lock-open" />}
                                            <Text style={[styles.text, styles.font12, styles.dark, styles.ml5]}>
                                                {privacy === true ? t('private') : t('public')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.flexOne} />
                                    <TouchableOpacity style={[styles.mh5]} activeOpacity={0.75} onPress={() => navigation.navigate('Community Settings', { communityId: communityId, communityName: communityName || name, communityPicture: communityPicture || picture, communityDescription: communityDescription || description, communityPrivacy: communityPrivacy || privacy, owner: owner, joinQuestion: joinQuestion })}>
                                        <MaterialIcons name="settings" size={25} color={palette.dark} />
                                    </TouchableOpacity>
                                    {owner && (
                                        <TouchableOpacity style={[styles.mh5]} activeOpacity={0.75} onPress={() => navigation.navigate('Community Members', { communityId })}>
                                            <MaterialIcons name="people" size={25} color={palette.dark} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity style={[styles.mh5]} activeOpacity={0.75} onPress={onShare}>
                                        <MaterialIcons name="share" size={25} color={palette.dark} />
                                    </TouchableOpacity>
                                </View>

                                {feed && feed.map((data, index) => {
                                    const nextRideDate = new Date(data.datetime);
                                    return (
                                        <View style={[styles.w100]} key={"feed" + index}>
                                            <AvailableRide
                                                rid={data.ride_id}
                                                fromAddress={data.mainTextFrom}
                                                toAddress={data.mainTextTo}
                                                pricePerSeat={data.pricePerSeat}
                                                seatsOccupied={data.seatsOccupied}
                                                duration={data.duration}
                                                DriverId={data.DriverId}
                                                seatsAvailable={data.seatsAvailable}
                                                driverName={data.Driver.firstName + " " + data.Driver.lastName}
                                                date={nextRideDate}
                                                style={styles.mt10}
                                                pickupEnabled={data.pickupEnabled}
                                                gender={data.gender}
                                                onPress={function () {
                                                    if (data.DriverId === id) {
                                                        navigation.navigate('Find Rides', { screen: 'View Trip', params: { tripId: data.ride_id } })
                                                    } else {
                                                        navigation.navigate('Find Rides', { screen: 'Book Ride', params: { rideId: data.ride_id } })
                                                    }
                                                }
                                                }
                                            />
                                        </View>
                                    );
                                })}
                                {feed.length > 0 &&
                                    <TouchableOpacity activeOpacity={0.7} style={[styles.w100, styles.alignCenter, styles.mt10]} onPress={loadMore}>
                                        <Text style={[styles.text, styles.primary, styles.bold, styles.font14]}>{t('see_more')}</Text>
                                    </TouchableOpacity>
                                }
                                {feed.length === 0 && (
                                    <View style={[styles.flexOne, styles.fullCenter, styles.w100]}>
                                        <MaterialIcons name="sentiment-very-dissatisfied" color={palette.dark} size={100} />
                                        <Text style={[styles.text, styles.font18, styles.dark, styles.mt10]}>{t('no_rides')}</Text>
                                    </View>
                                )
                                }
                            </>
                        )}

                        {!isJoined && !sentJoinRequest && (
                            <>
                                <View style={[styles.justifyCenter, styles.alignCenter, styles.w100, styles.flexOne]}>
                                    <FastImage style={{ borderRadius: 100 / 2, width: 100, height: 100 }} source={{ uri: picture }} />
                                    <Text style={[styles.text, styles.font18, styles.bold, styles.mt10]}>{name}</Text>
                                    <View style={[styles.flexRow, styles.alignCenter, styles.justifyCenter]}>
                                        <Text style={[styles.text, styles.font12, styles.dark, styles.mr5]}>
                                            {privacy === true ? t('private') : t('public')}
                                        </Text>
                                        {privacy === true ? <MaterialIcons name="lock" /> : <MaterialIcons name="lock-open" />}
                                    </View>
                                    <Text style={[styles.text, styles.font14, styles.mt10]}>{description}</Text>

                                    {privacy && joinQuestion && (
                                        <View style={[styles.w100, styles.mt10]}>
                                            <Text style={[styles.text, styles.font14, styles.mt10, styles.textCenter, styles.w100]}>{joinQuestion}</Text>
                                            <CustomTextInput placeholder={t('answer')} style={[styles.mt10]} value={joinAnswer} onChangeText={(data) => setJoinAnswer(data)} />
                                        </View>
                                    )}

                                    <Button text={privacy ? t('request_join') : t('join_community')} bgColor={palette.primary} textColor={palette.white} style={[styles.mt10]} onPress={joinCommunity} />
                                </View>
                            </>
                        )}

                        {sentJoinRequest && (
                            <View style={[styles.justifyCenter, styles.alignCenter, styles.w100, styles.flexOne]}>
                                <CoffeeIcon width={200} height={200} />
                                <Text style={[styles.text, styles.font28, styles.primary, styles.bold, styles.mt10]}>{t('wait_processing')}</Text>
                                <Text
                                    style={[styles.text, styles.font14, styles.mt10, styles.textCenter, styles.ph8]}>
                                    {t('community_request_sent')}
                                </Text>
                                <Button text={t('back')} bgColor={palette.primary} textColor={palette.white} style={[styles.mt10]} onPress={() => navigation.goBack()} />
                            </View>
                        )}
                    </>
                }

                {
                    loading &&
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={44 * rem} marginVertical={5 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={140 * rem} marginVertical={5 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={140 * rem} marginVertical={5 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={140 * rem} marginVertical={5 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={140 * rem} marginVertical={5 * rem} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }

            </ScrollView>
        </ScreenWrapper>
    );
};

export default ViewCommunity;
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as communitiesAPI from '../../api/communitiesAPI';
import AvailableRide from '../../components/AvailableRide';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import { containerStyle, getDateShort, getTime, palette, rem, styles } from '../../helper';
import CoffeeIcon from '../../svgs/coffee';
import ScreenWrapper from '../ScreenWrapper';
import useUserStore from '../../api/accountAPI';
import { useTranslation } from 'react-i18next';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


const ViewCommunity = ({ navigation, route }) => {
    const { communityId, communityName, communityPicture, communityDescription, communityPrivacy } = route.params;

    const [feed, setFeed] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const [joinQuestion, setJoinQuestion] = useState(null);
    const [joinAnswer, setJoinAnswer] = useState(null);
    const [sentJoinRequest, setSentJoinRequest] = useState(false);
    const [owner, setOwner] = useState(false);
    const [loading, setLoading] = useState(true);

    const { id } = useUserStore();

    useEffect(() => {
        communitiesAPI.getCommunityDetails(communityId).then(
            data => {
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
                }
                setJoinQuestion(data.joinQuestion);
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
                setLoading(false);
            }
        ).catch(err => {
            console.log(err);
        }
        );
    }

    if (Platform.OS === 'ios') {
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
    }

    const { t } = useTranslation();


    return (
        <ScreenWrapper screenName={t('search')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                {!loading &&
                    <>
                        {isJoined && (
                            <>
                                <View style={[styles.flexRow, styles.justifyCenter, styles.alignCenter]}>
                                    <Image width={44} height={44} style={{ borderRadius: 44 / 2 }} source={{ uri: communityPicture }} />
                                    <View style={[styles.ml10]}>
                                        <Text style={[styles.font14, styles.dark, styles.bold]}>{communityName}</Text>
                                        <View style={[styles.flexRow, styles.alignCenter]}>
                                            {communityPrivacy === true ? <MaterialIcons name="lock" /> : <MaterialIcons name="lock-open" />}
                                            <Text style={[styles.font12, styles.dark, styles.ml5]}>
                                                {communityPrivacy === true ? t('private') : t('public')}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.flexOne} />
                                    <TouchableOpacity activeOpacity={0.75} onPress={() => navigation.navigate('Community Settings', { ...route.params, owner: owner, joinQuestion: joinQuestion })}>
                                        <MaterialIcons name="settings" size={25} color={palette.dark} />
                                    </TouchableOpacity>
                                    {owner && (
                                        <TouchableOpacity activeOpacity={0.75} style={[styles.ml5]} onPress={() => navigation.navigate('Community Members', { communityId })}>
                                            <MaterialIcons name="people" size={25} color={palette.dark} />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {feed && feed.map((data, index) => {
                                    const nextRideDate = new Date(data.datetime);
                                    return (
                                        <View style={[styles.flexOne, styles.w100]} key={"feed" + index}>
                                            <AvailableRide rid={data.ride_id} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} pricePerSeat={data.pricePerSeat} seatsOccupied={data.seatsOccupied} DriverId={data.DriverId} seatsAvailable={data.seatsAvailable} driverName={data.Driver.firstName + " " + data.Driver.lastName} date={getDateShort(nextRideDate)} time={getTime(nextRideDate)} style={styles.mt10} />
                                        </View>
                                    );
                                })}
                                {feed.length === 0 && (
                                    <View style={[styles.flexOne, styles.fullCenter, styles.w100]}>
                                        <MaterialIcons name="sentiment-very-dissatisfied" color={palette.dark} size={100} />
                                        <Text style={[styles.font18, styles.dark, styles.mt10]}>{t('no_rides')}</Text>
                                    </View>
                                )
                                }
                            </>
                        )}

                        {!isJoined && !sentJoinRequest && (
                            <>
                                <View style={[styles.justifyCenter, styles.alignCenter, styles.w100, styles.flexOne]}>
                                    <Image width={100} height={100} style={{ borderRadius: 100 / 2 }} source={{ uri: communityPicture }} />
                                    <Text style={[styles.font18, styles.bold, styles.mt10]}>{communityName}</Text>
                                    <View style={[styles.flexRow, styles.alignCenter, styles.justifyCenter]}>
                                        <Text style={[styles.font12, styles.dark, styles.mr5]}>
                                            {communityPrivacy === true ? t('private') : t('public')}
                                        </Text>
                                        {communityPrivacy === true ? <MaterialIcons name="lock" /> : <MaterialIcons name="lock-open" />}
                                    </View>
                                    <Text style={[styles.font14, styles.mt10]}>{communityDescription}</Text>

                                    {communityPrivacy && joinQuestion && (
                                        <View style={[styles.w100, styles.mt10]}>
                                            <Text style={[styles.font14, styles.mt10, styles.textCenter, styles.w100]}>{joinQuestion}</Text>
                                            <CustomTextInput placeholder={t('answer')} style={[styles.mt10]} value={joinAnswer} onChangeText={(data) => setJoinAnswer(data)} />
                                        </View>
                                    )}

                                    <Button text={communityPrivacy ? t('request_join') : t('join_community')} bgColor={palette.primary} textColor={palette.white} style={[styles.mt10]} onPress={joinCommunity} />
                                </View>
                            </>
                        )}

                        {sentJoinRequest && (
                            <View style={[styles.justifyCenter, styles.alignCenter, styles.w100, styles.flexOne]}>
                                <CoffeeIcon width={200} height={200} />
                                <Text style={[styles.font28, styles.primary, styles.bold, styles.mt10]}>{t('wait_processing')}</Text>
                                <Text
                                    style={[styles.font14, styles.mt10, styles.textCenter, styles.ph8]}>
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
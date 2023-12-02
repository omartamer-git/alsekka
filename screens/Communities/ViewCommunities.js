import React, { useCallback, useEffect, useState } from 'react';
import {
    Image,
    Platform,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { containerStyle, rem, styles } from '../../helper';

import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import * as communitiesAPI from '../../api/communitiesAPI';
import AvailableRide from '../../components/AvailableRide';
import CommunityCard from '../../components/CommunityCard';
import ScreenWrapper from '../ScreenWrapper';
import useUserStore from '../../api/accountAPI';



const ViewCommunities = ({ navigation, route }) => {
    const [communities, setCommunities] = useState(null);
    const [feed, setFeed] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const { id } = useUserStore();

    const onRefresh = async  function () {
        setRefreshing(true);
        await loadFeed();
        setRefreshing(false);
    };

    useEffect( function () {
        loadFeed();
    }, []);

    const loadFeed = async  function () {
        setLoading(true);
        const communitiesData = await communitiesAPI.getCommunities();
        if (communitiesData.length !== 0) {
            setCommunities(communitiesData);
        }

        const feedData = await communitiesAPI.myCommunities();
        if (feedData.length !== 0) {
            setFeed(feedData);
        }
        setLoading(false);
    };

    if (Platform.OS === 'ios') {
        const onFocusEffect = useCallback( function () {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return  function () {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }, []);

        useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('communities')}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}  >
                {
                    !loading &&
                    <>
                        <View style={[styles.w100, styles.flexRow, styles.alignCenter, styles.mt20]}>
                            <Text style={[styles.text, styles.headerText2]}>{t('communities')}</Text>
                            <View style={[styles.flexOne]} />
                            <TouchableOpacity style={[styles.mr5]} onPress={() => navigation.navigate('Search Communities')}><MaterialIcons name="search" size={24} /></TouchableOpacity>
                            <TouchableOpacity style={[styles.ml5]} onPress={() => navigation.navigate('New Community')}><MaterialIcons name="add" size={24} /></TouchableOpacity>
                        </View>

                        {feed && feed.length > 0 &&
                            <View style={[styles.w100, styles.mt10, styles.borderLight, styles.pb8, { borderTopWidth: 1 }]}>
                                <Text style={[styles.text, styles.headerText3, styles.mt10]}>{t('your_feed')}</Text>
                                <View style={[styles.w100, styles.mt5, styles.flexRow, { paddingHorizontal: '5%', justifyContent: 'space-between', flexWrap: 'wrap' }]}>
                                    {
                                        feed.map((data, index) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => navigation.navigate('View Community', {communityId: data.id, communityName: data.name, communityPicture: data.picture, communityDescription: data.description, communityPrivacy: data.private})}
                                                    activeOpacity={0.8} key={`communityFeed${index}`}
                                                    style={[{ width: '47.5%', minHeight: 150 }, styles.p16, styles.mv5, styles.br8, styles.bgLight, styles.justifyCenter, styles.alignCenter]}>

                                                    <Image width={60} height={60} style={{ borderRadius: 60 / 2 }} source={{ uri: data.picture }} />
                                                    <Text numberOfLines={2} style={[styles.text, styles.font12, styles.textCenter, styles.mt5, styles.dark]}>{data.name}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>

                            </View>}

                        <View style={[styles.flexOne, styles.mt10, styles.w100, styles.borderLight, { borderTopWidth: 1 }]}>
                            <Text style={[styles.text, styles.headerText3, styles.mt10]}>{t('rec_communities')}</Text>
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
                                                    communityPrivacy: data.private,
                                                })
                                            }
                                        />);
                                })
                            }
                        </View>
                    </>
                }
                {
                    loading &&
                    <>
                        <View style={[styles.w100, styles.flexOne]}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginTop={20} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={100 * rem} marginTop={20} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={100 * rem} marginTop={20} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={100 * rem} marginTop={20} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={100 * rem} marginTop={20} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }

            </ScrollView>
        </ScreenWrapper>
    );
};

export default ViewCommunities;
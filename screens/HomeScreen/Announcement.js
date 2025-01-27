import React, { useEffect, useState } from 'react';
import {
    I18nManager,
    ScrollView,
    Text,
    View
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import * as announcementsAPI from '../../api/announcementsAPI';
import { containerStyle, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';


function Announcement({ navigation, route }) {
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = route.params;

    useEffect(function () {
        setLoading(true);
        announcementsAPI.getAnnouncement(id).then(
            data => {
                setAnnouncement(data);
                setLoading(false);
            }
        );
    }, []);


    return (
        <ScreenWrapper screenName={t('announcement')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    !loading &&
                    <>
                        {announcement && <Text style={[styles.text, styles.headerText2, styles.mt20]}>
                            {I18nManager.isRTL ? announcement.title_ar : announcement.title_en}
                        </Text>}

                        {announcement && <Text style={[styles.text, styles.mt20]}>
                            {I18nManager.isRTL ? announcement.text_ar : announcement.text_en}
                        </Text>}
                    </>
                }

                {
                    loading &&
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={40 * rem} marginVertical={5 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item width={'100%'} height={280 * rem} marginVertical={5 * rem} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }
            </ScrollView>
        </ScreenWrapper>

    );
};

export default Announcement;
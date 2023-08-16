import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    Text,
    useColorScheme
} from 'react-native';
import { containerStyle, styles } from '../../helper';
import * as announcementsAPI from '../../api/announcementsAPI';
import ScreenWrapper from '../ScreenWrapper';


const Announcement = ({ navigation, route }) => {
    const [announcement, setAnnouncement] = useState(null);
    const { id } = route.params;
    useEffect(() => {
        announcementsAPI.getAnnouncement(id).then(
            data => {
                setAnnouncement(data);
            }
        );
    }, []);

    const isDarkMode = useColorScheme === 'dark';

    return (
        <ScreenWrapper screenName={t('announcement')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                {announcement && <Text style={[styles.headerText2, styles.mt20]}>
                    {announcement.title}
                </Text>}

                {announcement && <Text style={styles.mt20}>
                    {announcement.text}
                </Text>}
            </ScrollView>
        </ScreenWrapper>

    );
};

export default Announcement;
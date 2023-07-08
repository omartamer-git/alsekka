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
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as announcementsAPI from '../../api/announcementsAPI';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
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
        <ScreenWrapper screenName={"Announcement"} navType="back" navAction={() => navigation.goBack()}>
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
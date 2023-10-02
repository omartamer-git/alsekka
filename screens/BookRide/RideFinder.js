import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import AutoComplete from '../../components/AutoComplete';
import AvailableRide from '../../components/AvailableRide';
import { containerStyle, getDateShort, getTime, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';


const RideFinder = ({ route, navigation }) => {
    // const { fromLat, fromLng, toLat, toLng, date, textFrom, textTo, genderChoice } = route.params;
    const [availableRides, setAvailableRides] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [fromLat, setFromLat] = useState(route.params.fromLat);
    const [fromLng, setFromLng] = useState(route.params.fromLng);
    const [toLng, setToLng] = useState(route.params.toLng);
    const [toLat, setToLat] = useState(route.params.toLat);
    const [textFrom, setTextFrom] = useState(route.params.textFrom);
    const [textTo, setTextTo] = useState(route.params.textTo);
    const { date, genderChoice } = route.params;

    const fromRef = useRef(null);
    const toRef = useRef(null);

    const loc = route.params?.loc;

    const [location, setLocation] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fromRef.current.setCompletionText(textFrom);
        toRef.current.setCompletionText(textTo);

        setLoading(true);
        ridesAPI.nearbyRides(fromLng, fromLat, toLng, toLat, date, genderChoice).then
            (
                data => {
                    setAvailableRides(data);
                    setLoading(false);
                }
            );
    }, [fromLng, fromLat, toLng, toLat, date, genderChoice]);

    const onClickRide = (rid, driver) => {
        if (driver) {
            navigation.navigate('View Trip', { tripId: rid });
        } else {
            navigation.navigate('Book Ride', { rideId: rid });
        }
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

        // useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    const swapDestinations = () => {
        const oldFromLng = fromLng;
        const oldFromLat = fromLat;
        const oldTextFrom = textFrom;

        setFromLng(toLng);
        setFromLat(toLat);

        setToLng(oldFromLng);
        setToLat(oldFromLat);

        setTextFrom(textTo);
        setTextTo(oldTextFrom);
    }

    const setLocationFrom = (loc, text) => {
        setTextFrom(text);
        setFromLng(loc.lng);
        setFromLat(loc.lat);
    }

    const setLocationTo = (loc, text) => {
        setTextTo(text);
        setToLng(loc.lng);
        setToLat(loc.lat);
    }

    const { t } = useTranslation();

    return (
        <ScreenWrapper navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <View style={rideFinderStyles.autoCompletePair}>
                    {/* <CustomTextInput key="fromText" iconLeft="my-location" value={textFrom} style={[rideFinderStyles.autoCompleteStyles, rideFinderStyles.autoCompleteTop]} />
                    <CustomTextInput key="toText" iconLeft="place" value={textTo} style={[rideFinderStyles.autoCompleteStyles, rideFinderStyles.autoCompleteBottom]} /> */}
                    <AutoComplete ref={fromRef} key="autoCompleteFrom" type="my-location" placeholder={t('from')} handleLocationSelect={setLocationFrom} inputStyles={[{ marginTop: 0, marginBottom: 0, borderBottomWidth: 0.5, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, styles.borderLight, styles.bgWhite]} />
                    <AutoComplete ref={toRef} key="autoCompleteTo" type="place" placeholder={t('to')} handleLocationSelect={setLocationTo} inputStyles={[{ marginTop: 0, marginBottom: 0, borderTopWidth: 0.5, borderTopRightRadius: 0, borderTopLeftRadius: 0 }, styles.borderLight, styles.bgWhite]} />

                    <TouchableOpacity activeOpacity={0.8} onPress={swapDestinations} style={[styles.positionAbsolute, styles.alignCenter, styles.justifyCenter, styles.bgWhite, styles.borderSecondary, { top: 24 * rem, right: 5 * rem, height: 48 * rem, width: 48 * rem, borderRadius: 24 * rem, shadowColor: palette.black, shadowRadius: 12 * rem, shadowOpacity: 0.2 }]}>
                        <MaterialIcons name="swap-vert" size={22} color={palette.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.headerText3, styles.black, styles.mt20]}>{t('available_rides')}</Text>
                { !loading &&
                    availableRides.map((data, index) => {
                        const objDate = new Date(data.datetime);
                        return (<AvailableRide key={"ar" + index} rid={data.id} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} seatsOccupied={data.seatsOccupied} seatsAvailable={data.seatsAvailable} DriverId={data.DriverId} pricePerSeat={data.pricePerSeat} date={getDateShort(objDate)} time={getTime(objDate)} onPress={onClickRide} style={rideFinderStyles.availableRide} />);
                    }
                    )
                }
                {
                    loading && 
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginTop={10 * rem} height={140 * rem} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginTop={10 * rem} height={140 * rem} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginTop={10 * rem} height={140 * rem} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginTop={10 * rem} height={140 * rem} />
                            </SkeletonPlaceholder>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item marginTop={10 * rem} height={140 * rem} />
                            </SkeletonPlaceholder>
                        </View>
                    </>
                }
            </ScrollView>

        </ScreenWrapper>

    );
}

const rideFinderStyles = StyleSheet.create({
    autoCompletePair: {
        ...styles.w100,
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: 1 * rem },
        shadowOpacity: 0.2, shadowRadius: 4,
    },

    autoCompleteStyles: {
        marginTop: 0,
        marginBottom: 0,
        borderColor: palette.light,
        backgroundColor: palette.white
    },

    autoCompleteTop: {
        borderBottomWidth: 0.5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },

    autoCompleteBottom: {
        borderTopWidth: 0.5,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
    },

    availableRide: {
        ...styles.mt10,
        height: 140 * rem,
    }
});

export default RideFinder;
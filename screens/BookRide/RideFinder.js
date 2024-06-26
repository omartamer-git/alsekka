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
import { containerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import Button from '../../components/Button';
import useAppManager from '../../context/appManager';


function RideFinder({ route, navigation }) {
    const [availableRides, setAvailableRides] = useState([]);
    const [alternateRides, setAlternateRides] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [fromLat, setFromLat] = useState(route.params.fromLat);
    const [fromLng, setFromLng] = useState(route.params.fromLng);
    const [toLng, setToLng] = useState(route.params.toLng);
    const [toLat, setToLat] = useState(route.params.toLat);
    const [textFrom, setTextFrom] = useState(route.params.textFrom);
    const [textTo, setTextTo] = useState(route.params.textTo);
    const [date, setDate] = useState(route.params.date);
    const { genderChoice } = route.params;

    const fromRef = useRef(null);
    const toRef = useRef(null);
    const scrollViewRef = useRef(null);

    const loc = route.params?.loc;

    const [location, setLocation] = useState(null);

    const [loading, setLoading] = useState(true);

    const { cities } = useAppManager();
    const listCities = Object.keys(cities);
    const [citiesFrom, setCitiesFrom] = useState(listCities);
    const [citiesTo, setCitiesTo] = useState(listCities);


    useEffect(function () {
        fromRef.current.setCompletionText(textFrom);
        toRef.current.setCompletionText(textTo);

        setLoading(true);
        ridesAPI.nearbyRides(fromLng, fromLat, toLng, toLat, date, genderChoice).then
            (
                data => {
                    console.log(data);
                    setAvailableRides(data.filter(r => (r.distanceStart <= 25000 && r.distanceEnd <= 25000)));
                    setAlternateRides(data.filter(r => !(r.distanceStart <= 25000 && r.distanceEnd <= 25000)));
                    setLoading(false);
                }
            );
    }, [fromLng, fromLat, toLng, toLat, date, genderChoice]);

    const scrollToHour = function () {
        if (scrollViewRef.current && availableRides && availableRides.length > 0) {
            const hour = new Date(availableRides[0].datetime).getHours();

            scrollViewRef.current.scrollTo({ x: hour * 90 * rem, y: 50, animated: true });
        }
    }

    function onClickRide(rid, driver) {
        if (driver) {
            navigation.navigate('View Trip', { tripId: rid });
        } else {
            navigation.navigate('Book Ride', { rideId: rid });
        }
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

    const swapDestinations = function () {
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

    function setLocationFrom(loc, text, _, city) {
        setTextFrom(text);
        setFromLng(loc.lng);
        setFromLat(loc.lat);
        setCitiesTo(listCities.filter(c => c != city));
    }

    function setLocationTo(loc, text, _, city) {
        setTextTo(text);
        setToLng(loc.lng);
        setToLat(loc.lat);
        setCitiesFrom(listCities.filter(c => c != city));
    }

    function cancelLocationFrom(city) {
        const oldCitiesTo = citiesTo;

        if (city && !oldCitiesTo.includes(city)) {
            setCitiesTo([...oldCitiesTo, city])
        }
    }

    function cancelLocationTo(city) {
        const oldCitiesFrom = citiesFrom;

        if (city && !oldCitiesFrom.includes(city)) {
            setCitiesFrom([...oldCitiesFrom, city])
        }
    }


    const { t } = useTranslation();

    return (
        <ScreenWrapper navType="back" screenName={t('find_rides')} navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                <View style={rideFinderStyles.autoCompletePair}>
                    <AutoComplete
                        ref={fromRef}
                        key="autoCompleteFrom"
                        type="my-location"
                        placeholder={t('from')}
                        handleLocationSelect={setLocationFrom}
                        inputStyles={[{ marginTop: 0, marginBottom: 0, borderBottomWidth: 0.5, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, styles.borderLight, styles.bgWhite]}
                        cities={citiesFrom}
                        handleCancelLocationSelect={cancelLocationFrom}
                    />
                    <AutoComplete
                        ref={toRef}
                        key="autoCompleteTo"
                        type="place"
                        placeholder={t('to')}
                        handleLocationSelect={setLocationTo}
                        inputStyles={[{ marginTop: 0, marginBottom: 0, borderTopWidth: 0.5, borderTopRightRadius: 0, borderTopLeftRadius: 0 }, styles.borderLight, styles.bgWhite]}
                        cities={citiesTo}
                        handleCancelLocationSelect={cancelLocationTo}
                    />

                    <TouchableOpacity activeOpacity={0.8} onPress={swapDestinations} style={[styles.positionAbsolute, styles.alignCenter, styles.justifyCenter, styles.bgWhite, styles.borderSecondary, { top: 24 * rem, right: 5 * rem, height: 48 * rem, width: 48 * rem, borderRadius: 24 * rem, shadowColor: palette.black, shadowRadius: 12 * rem, shadowOpacity: 0.2, elevation: 10 }]}>
                        <MaterialIcons name="swap-vert" size={22} color={palette.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.text, styles.headerText3, styles.black, styles.mt20]}>{t('available_rides')}</Text>
                {!loading && availableRides.length > 0 &&
                    <ScrollView keyboardShouldPersistTaps={'handled'} horizontal={true} style={[{ flexGrow: 0 }, styles.mt5]} showsHorizontalScrollIndicator={false} ref={scrollViewRef} onLayout={scrollToHour}>
                        {
                            Array.from({ length: 24 }).map((a, i) => {
                                const hourNumber = (new Date(availableRides[0].datetime)).getHours();

                                const getTimeFromIndex = function () {
                                    let ampm = "AM";
                                    let time = i;

                                    if (i >= 12) {
                                        ampm = "PM";
                                        time -= 12;
                                    }

                                    if (time === 0) {
                                        time = 12;
                                    }

                                    return `${time} ${t(ampm)}`;
                                }

                                return (
                                    <TouchableOpacity
                                        onPress={
                                            () => setDate(d => {
                                                let dateObj = new Date(d);
                                                dateObj.setHours(i);
                                                dateObj.setMinutes(0);
                                                dateObj.setSeconds(0);
                                                dateObj.setMilliseconds(0);
                                                return dateObj;
                                            })
                                        }
                                        key={`time${i}`}
                                        activeOpacity={0.8}
                                        style={[styles.bgWhite, styles.border1, styles.fullCenter, { width: 85 * rem, height: 30 * rem, borderRadius: 15 * rem, marginHorizontal: 2.5 * rem, borderColor: hourNumber === i ? palette.primary : palette.light }]}>
                                        <Text style={[styles.text, styles.textCenter]}>{getTimeFromIndex()}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                }
                {!loading &&
                    availableRides.map((data, index) => {
                        const objDate = new Date(data.datetime);
                        return (
                            <AvailableRide
                                key={"ar" + index}
                                rid={data.id}
                                model={data.model}
                                brand={data.brand}
                                fromAddress={data.mainTextFrom}
                                toAddress={data.mainTextTo}
                                seatsOccupied={data.seatsOccupied}
                                seatsAvailable={data.seatsAvailable}
                                DriverId={data.DriverId}
                                pricePerSeat={data.pricePerSeat}
                                duration={data.duration}
                                date={objDate}
                                onPress={onClickRide}
                                pickupEnabled={data.pickupEnabled}
                                gender={data.gender}
                                style={rideFinderStyles.availableRide} />
                        );
                    }
                    )
                }

                {!loading && alternateRides.length > 0 &&
                    <>
                        <Text style={[styles.text, styles.mt15, styles.semiBold, styles.dark]}>{t('alternate_rides')}</Text>
                        {
                            alternateRides.map((data, index) => {
                                const objDate = new Date(data.datetime);
                                return (
                                    <AvailableRide
                                        key={"alr" + index}
                                        rid={data.id}
                                        model={data.model}
                                        brand={data.brand}
                                        fromAddress={data.mainTextFrom}
                                        toAddress={data.mainTextTo}
                                        seatsOccupied={data.seatsOccupied}
                                        seatsAvailable={data.seatsAvailable}
                                        DriverId={data.DriverId}
                                        pricePerSeat={data.pricePerSeat}
                                        duration={data.duration}
                                        date={objDate}
                                        onPress={onClickRide}
                                        pickupEnabled={data.pickupEnabled}
                                        gender={data.gender}
                                        style={rideFinderStyles.availableRide} />
                                );
                            }
                            )
                        }
                    </>
                }

                {
                    !loading && availableRides && availableRides.length === 0 && alternateRides.length === 0 &&
                    <View style={[styles.fullCenter, styles.w100, styles.flexOne]}>
                        <MaterialIcons name="sentiment-very-dissatisfied" size={125 * rem} color={palette.dark} />
                        <Text style={[styles.boldText, styles.dark, styles.font14, styles.textCenter]}>{t('no_rides_posted')}</Text>
                        <Button text={t('post_ride')} bgColor={palette.primary} textColor={palette.white} onPress={() => navigation.navigate('Post Ride')} />
                    </View>
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
        elevation: 10
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
        minHeight: 140 * rem,
    }
});

export default RideFinder;
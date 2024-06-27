import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../api/accountAPI';
import { addSecondsToDate, getDurationValues, getTime, palette, rem, styles } from '../helper';
import useAxiosManager from '../context/axiosManager';
import useLocale from '../locale/localeContext';
import FastImage from 'react-native-fast-image';
import { useEffect } from 'react';
import * as ridesAPI from '../api/ridesAPI';
import { useState } from 'react';

function Ride({ rid, fromAddress, toAddress, pricePerSeat, seatsOccupied, seatsAvailable, date, duration, model, brand, pickupEnabled, gender, DriverId, page, onPress = function () { }, style = {} }) {
    const { authAxios } = useAxiosManager();
    const items = [];
    const rideFull = (seatsAvailable - seatsOccupied) <= 0;
    const [driverProfilePicture, setDriverProfilePicture] = useState(null);
    const [ratings, setRatings] = useState(null);
    const [driverName, setDriverName] = useState('');
    const [preferences, setPreferences] = useState(null);
    const id = useUserStore((state) => state.id);
    const { t } = useTranslation();
    const { language } = useLocale();
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    if (!rideFull) {
        for (let i = 0; i < seatsOccupied; i++) {
            items.push(<MaterialIcons key={"seat" + i} name="account-circle" size={16} color={palette.primary} />);
        }

        for (let j = 0; j < seatsAvailable - seatsOccupied; j++) {
            items.push(<MaterialIcons key={"emptyseat" + j} name="account-circle" size={16} color={palette.light} />);
        }
    } else {
        items.push(<Text style={[styles.text, styles.dark]} key={"full" + rid}>{t('ride_full')}</Text>)
    }


    useEffect(function () {
        if (!rid) return;
        ridesAPI.tripDetails(rid).then(
            data => {
                setDriverProfilePicture(data.Driver.profilePicture);
                setDriverName(data.Driver.firstName);

                const fullStars = Math.floor(data.Driver.rating);
                const halfStars = Math.ceil(data.Driver.rating) - Math.abs(data.Driver.rating);

                let ratingsItems = [];
                for (let i = 0; i < fullStars; i++) {
                    ratingsItems.push(<MaterialIcons key={"fullStar" + i} name="star" color={palette.accent} />);
                }

                for (let j = 0; j < halfStars; j++) {
                    ratingsItems.push(<MaterialIcons key={"halfStar" + j} name="star-half" color={palette.accent} />);
                }

                setRatings(ratingsItems);
            }
        );

    }, []);



    useEffect(() => {
        (async () => {
          try {
            const response = await authAxios.get(`/v1/preferences/${DriverId}`);
            const {chattiness, rest_stop, music, smoking} = response.data;
            setPreferences({
              chattiness,
              rest_stop,
              music,
              smoking
            });
          } catch (error) {
            console.log('Error fetching preferences:', error);
          }
        })()
    }, []);



    return (
        <TouchableOpacity onPress={function () { onPress(rid, DriverId === id) }} activeOpacity={0.65} style={[styles.w100, styles.br16, styles.bgWhite, styles.shadow, style, { overflow: 'hidden' }]}>
            <View style={[styles.flexRow, styles.w100, styles.flexOne]}>
                <View style={[styles.flexRow, { width: '62%', padding: 10, }]}>
                    <View  >
                        <Text style={[styles.text, styles.dark, { fontSize: 13 }]}>
                            {`${getTime(date)[0].split(':').map(part => part.padStart(2, '0')).join(':')}`}
                            <Text style={[styles.font12]}>&nbsp;{t(getTime(date)[1])}</Text>
                        </Text>

                        <Text style={[styles.text, styles.secondary, { fontSize: 12, marginTop: 1, marginBottom: 11 }]}>
                            {`${Math.floor(duration / 3600)}h${Math.floor((duration % 3600) / 60).toString().padStart(2, '0')}`}
                        </Text>

                        <Text style={[styles.text, styles.dark, styles.mt15, { fontSize: 13 }]}>
                            {`${getTime(addSecondsToDate(date, duration))[0].split(':').map(part => part.padStart(2, '0')).join(':')}`}
                            <Text style={styles.font12}>&nbsp;{t(getTime(addSecondsToDate(date, duration))[1])}</Text>
                        </Text>

                        {getTime(date)[1] === 'PM' && getTime(addSecondsToDate(date, duration))[1] === 'AM' &&
                            <Text style={[styles.text, styles.secondary, { fontSize: 12, paddingTop: 2 }]}>
                                +1
                            </Text>}
                    </View>
                    <View style={{ alignItems: 'center', paddingTop: 6 }}>
                        {/* Top Circle */}
                        <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            borderWidth: 3,
                            borderColor: palette.primary,
                            backgroundColor: 'transparent',
                        }} />
                        {/* Upper Vertical Line */}
                        <View style={{
                            width: 2,
                            height: 22,
                            backgroundColor: palette.primary,
                        }} />
                        {/* Arrow */}
                        <MaterialIcons name="arrow-downward" size={20} color={palette.primary} style={[{ marginTop: -10 }]} />
                        {/* Lower Vertical Line */}
                        <View style={{
                            width: 2,
                            height: 22,
                            backgroundColor: palette.primary,
                            marginTop: -5
                        }} />
                        {/* Bottom Circle */}
                        <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            borderWidth: 3,
                            borderColor: palette.primary,
                            backgroundColor: 'transparent',
                        }} />
                    </View>
                    <View style={[styles.flexOne]}>
                        <Text style={[styles.dark, { fontSize: 13, marginBottom: 43 }]}>{fromAddress.split(',')[0].split('،')[0]}</Text>
                        <Text style={[styles.dark, { fontSize: 13 }]}>{toAddress.split(',')[0].split('،')[0]}</Text>
                    </View>

                </View>

                <View style={[{ width: '38%', padding: 10, paddingLeft: 0 }]}>
                    {pricePerSeat && <Text style={[styles.text, styles.dark, { fontSize: 13, marginLeft: 'auto' }]}>{Math.ceil(pricePerSeat / 100)}<Text style={styles.font12}>&nbsp;{t('EGP')}</Text></Text>}

                    {(page == 'view_trip' || page == 'ride_finder') && <View style={[styles.flexRow, styles.fullCenter, styles.mt5, styles.justifyEnd]}>
                        <MaterialIcons name="person" size={16} color={palette.dark} />
                        <Text style={[styles.dark, styles.text, { fontSize: 13 }]}>
                            {seatsAvailable && seatsOccupied ? Math.min((seatsOccupied), (seatsAvailable)) + '/' + seatsAvailable : seatsAvailable}
                            &nbsp;•&nbsp;
                            {t(days[date.getDay()])} {date.getDate()} {t(months[date.getMonth()])}
                        </Text>
                    </View>}


                    <View style={[styles.flexRow,{marginTop: 'auto', marginLeft: 'auto', marginRight: -1 }]}>
                        {gender !== "ANY" &&
                            <View style={[styles.fullCenter, { width: 32, height: 24, borderRadius: 12, margin: 1 * rem, backgroundColor: gender === "MALE" ? "#1d74c6" : "pink" }]}>
                                <Text style={[styles.bold, styles.text, styles.font12, { color: gender === "MALE" ? "white" : "black" }]}>{gender.substring(0, 1).toUpperCase()}</Text>
                            </View>
                        }
                        {model && brand && page!='view_trip' &&
                            <View style={[styles.ph16, styles.bgDark, styles.fullCenter, styles.ml5, { borderRadius: 12 * rem, height: 24 * rem, alignSelf: 'flex-end'}]}>
                                <Text style={[styles.text, { color: palette.white, fontSize: 10, fontWeight: '600', fontStyle: 'italic' }]}>{brand} {model}</Text>
                            </View>
                        }
                    </View>
                </View>

            </View>

            <View style={[styles.flexRow, styles.flexGrow, styles.w100, styles.p8, (page == 'view_trip') && styles.justifyCenter, { borderTopWidth: 0.75, borderTopColor: palette.light, paddingTop: 14, paddingBottom: 10 }]}>
                {!(page == 'view_trip') &&
                    <>
                        <FastImage source={{ uri: driverProfilePicture }}
                            style={{ width: 45, height: 45, borderRadius: 25, resizeMode: 'center', borderWidth: 0.7, borderColor: palette.primary }} />

                        <View style={{ marginTop: 3 }}>
                            <Text style={[styles.text, styles.dark, { fontSize: 13, marginLeft: 9 }]}>{driverName}</Text>

                            <View style={[styles.flexRow, { marginLeft: 8, marginTop: 2 }]}>
                                {ratings}
                            </View>
                        </View>
                    </>
                }


                <View style={[styles.flexRow, (page != 'view_trip') && styles.p8, styles.alignCenter, { marginLeft: (page != 'view_trip') ? 'auto' : '', padding: (page == 'view_trip') && 4 }]}>
                    {preferences?.chattiness == 1 && <MaterialIcons name="chat" size={22} color={palette.primary} style={{ marginRight: (page != 'view_trip') ? 11 : 30 }} />}
                    {preferences?.chattiness == -1 && <MaterialIcons name="chat-bubble" size={22} color={palette.primary} style={{ marginRight: (page != 'view_trip') ? 11 : 30 }} />}


                    {preferences?.rest_stop == 1 && <MaterialIcons name="multiple-stop" size={22} color={palette.primary} style={{ marginRight: (page != 'view_trip') ? 11 : 30 }} />}
                    {preferences?.rest_stop == -1 && <MaterialIcons name="airline-stops" size={22} color={palette.primary} style={{ marginRight: (page != 'view_trip') ? 11 : 30 }} />}


                    {preferences?.music == 1 && <MaterialIcons name="music-note" size={22} color={palette.primary} style={{ marginRight: (page != 'view_trip') ? 11 : 30 }} />}
                    {preferences?.music == -1 && <MaterialIcons name="music-off" size={22} color={palette.primary} style={{ marginRight: (page != 'view_trip') ? 11 : 30 }} />}


                    {preferences?.smoking == 1 && <MaterialIcons name="smoking-rooms" size={20} color={palette.primary} />}
                    {preferences?.smoking == -1 && <MaterialIcons name="smoke-free" size={20} color={palette.primary} />}

                </View>
            </View>

        </TouchableOpacity>

    );
}

export default memo(Ride);
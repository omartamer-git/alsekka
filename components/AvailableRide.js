import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { addSecondsToDate, getDateShort, getDurationValues, getTime, palette, rem, styles, translateEnglishNumbers } from '../helper';
import FromToIndicator from './FromToIndicator';
import useUserStore from '../api/accountAPI';
import { useTranslation } from 'react-i18next';
import useLocale from '../locale/localeContext';
import Separator from './Separator';

const AvailableRide = ({ rid, fromAddress, toAddress, pricePerSeat, seatsOccupied, seatsAvailable, date, driverName, duration, model, brand, DriverId, onPress = () => { }, style = {} }) => {
    const items = [];
    const rideFull = (seatsAvailable - seatsOccupied) <= 0;
    const { id } = useUserStore();
    const { t } = useTranslation();
    const { language } = useLocale();

    if (!rideFull) {
        for (let i = 0; i < seatsOccupied; i++) {
            items.push(<MaterialIcons key={"seat" + i} name="account-circle" size={16} color={palette.primary} />);
        }

        for (let j = 0; j < seatsAvailable - seatsOccupied; j++) {
            items.push(<MaterialIcons key={"emptyseat" + j} name="account-circle" size={16} color={palette.light} />);
        }
    } else {
        items.push(<Text key={"full" + rid}>{t('ride_full')}</Text>)
    }


    return (
        // <TouchableOpacity activeOpacity={0.65} style={[styles2.rideView, style]} onPress={() => { !rideFull ? onPress(rid, DriverId === id) : () => {return;} }}>
        //     <View style={{ ...styles.flexRow, flex: 7, padding: 16 }}>
        //         <View style={{ height: '100%' }}>
        //             <FromToIndicator circleRadius={5} />
        //         </View>
        //         <View style={{ height: '100%', flex: 1, marginStart: 10, justifyContent: 'space-between' }}>
        //             <Text style={{ alignSelf: 'flex-start', fontWeight: '600' }}>{fromAddress}</Text>
        //             <View style={styles.flexOne} />
        //             <Text style={{ alignSelf: 'flex-start', fontWeight: '600' }}>{toAddress}</Text>
        //         </View>
        //     </View>
        //     <View style={{ ...styles.flexRow, flex: 3, width: '100%', paddingStart: 5, paddingEnd: 5, borderTopWidth: 1, borderColor: palette.light }}>
        //         <View style={[styles2.subViews, { flex: 1, borderRightWidth: 1 }]}>
        //             <MaterialIcons name="monetization-on" size={16} color={palette.primary} />
        //             <Text style={styles2.textIcon}>{language === 'ar' ? translateEnglishNumbers(pricePerSeat) : pricePerSeat} {t('EGP')}</Text>
        //         </View>

        //         <View style={[styles2.subViews, { flex: 1, borderRightWidth: 1 }]}>
        //             {
        //                 items
        //             }
        //         </View>

        //         <View style={[styles2.subViews, { flex: 1, borderRightWidth: 1 }]}>
        //             <MaterialIcons name="date-range" size={16} color={palette.primary} />
        //             <Text style={styles2.textIcon}>{getDateShort(date)}</Text>
        //         </View>

        //         <View style={[styles2.subViews, styles2.flexOne]}>
        //             <MaterialIcons name="schedule" size={16} color={palette.primary} />
        //             <Text style={styles2.textIcon}>{getTime(date)}</Text>
        //         </View>
        //     </View>
        // </TouchableOpacity>

        <TouchableOpacity onPress={() => { onPress(rid, DriverId === id) }} activeOpacity={0.65} style={{ width: '100%', paddingVertical: 24, paddingHorizontal: 24, borderRadius: 16, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.light, ...style }}>
            <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ maxWidth: '60%' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View>
                            <Text style={{ fontWeight: '700', fontSize: 16 }}>{getTime(date)[0]}<Text style={{ fontSize: 12 }}> {t(getTime(date)[1])}</Text></Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 4, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ height: 0.5, backgroundColor: 'darkgray', marginHorizontal: 4, width: 25 }} />
                            <Text style={{ color: palette.dark, fontWeight: '600', marginHorizontal: 2, fontSize: 10 }}>{getDurationValues(duration)[0]}{t('h')}{getDurationValues(duration)[1]}{t('m')}</Text>
                            <View style={{ height: 0.5, backgroundColor: 'darkgray', marginHorizontal: 4, width: 25 }} />
                        </View>
                    </View>
                    <Text numberOfLines={2} ellipsizeMode='tail'>{fromAddress.split(',')[0]}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }}>{getTime(addSecondsToDate(date, duration))[0]}<Text style={{ fontSize: 12 }}> {t(getTime(addSecondsToDate(date, duration))[1])}</Text></Text>
                    <Text numberOfLines={2} ellipsizeMode='tail'>{toAddress.split(',')[0]}</Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', width: '100%', marginTop: 24 }}>
                {model && brand && <View style={{ paddingHorizontal: 16, borderRadius: 12, backgroundColor: palette.dark, height: 24, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' }}>
                    <Text style={{ color: palette.white, fontSize: 10, fontWeight: '600', fontStyle: 'italic' }}>{brand} {model}</Text>
                </View>}
                <View style={{ flex: 1 }} />
                <View>
                    <Text style={{ fontWeight: '700', fontSize: 16, alignSelf: 'flex-end' }}>{pricePerSeat}<Text style={{ fontSize: 12 }}> {t('EGP')}</Text></Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="person" size={16} color={palette.dark} />
                        <Text style={{ color: palette.dark }}> {seatsAvailable && seatsOccupied ? seatsOccupied + '/' + seatsAvailable : seatsAvailable} • {(() => { const dateParts = date.toDateString().split(' '); return `${dateParts[0]} ${dateParts[1]} ${dateParts[2]}`; })()}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    );
}

const styles2 = StyleSheet.create(
    {
        rideView: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            borderColor: '#d9d9d9',
            borderWidth: 1,
            backgroundColor: '#F6F5F5',
            height: 165 * rem
        },

        subViews: {
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: palette.light,
            ...styles.flexRow,
        },

        textIcon: {
            fontSize: 12 * rem,
            fontWeight: '500',
            marginStart: 2
        }
    }
);

export default AvailableRide;
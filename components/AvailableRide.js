import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem, styles, translateEnglishNumbers } from '../helper';
import FromToIndicator from './FromToIndicator';
import useUserStore from '../api/accountAPI';
import { useTranslation } from 'react-i18next';
import useLocale from '../locale/localeContext';

const AvailableRide = ({ rid, fromAddress, toAddress, pricePerSeat, seatsOccupied, seatsAvailable, date, time, driverName, DriverId, onPress=() => {}, style = {} }) => {
    const items = [];
    const rideFull = (seatsAvailable - seatsOccupied) <= 0;
    const {id} = useUserStore();
    const {t} = useTranslation();
    const {language} = useLocale();

    console.log(language);

    if(!rideFull) {
        for (let i = 0; i < seatsOccupied; i++) {
            items.push(<MaterialIcons key={ "seat" + i } name="account-circle" size={16} color={palette.primary} />);
        }
    
        for (let j = 0; j < seatsAvailable - seatsOccupied; j++) {
            items.push(<MaterialIcons key={ "emptyseat" + j } name="account-circle" size={16} color={palette.light} />);
        }    
    } else {
        items.push(<Text key={"full" + rid}>{t('ride_full')}</Text>)
    }

    return (
        <TouchableOpacity activeOpacity={0.65} style={[styles2.rideView, style]} onPress={() => { !rideFull ? onPress(rid, DriverId === id) : () => {return;} }}>
            <View style={{ ...styles.flexRow, flex: 7, padding: 16 }}>
                <View style={{ height: '100%' }}>
                    <FromToIndicator circleRadius={5} />
                </View>
                <View style={{ height: '100%', flex: 1, marginStart: 10, justifyContent: 'space-between' }}>
                    <Text style={{ alignSelf: 'flex-start', fontWeight: '600' }}>{fromAddress}</Text>
                    <View style={styles.flexOne} />
                    <Text style={{ alignSelf: 'flex-start', fontWeight: '600' }}>{toAddress}</Text>
                </View>
            </View>
            <View style={{ ...styles.flexRow, flex: 3, width: '100%', paddingStart: 5, paddingEnd: 5, borderTopWidth: 1, borderColor: palette.light }}>
                <View style={[styles2.subViews, { flex: 1, borderRightWidth: 1 }]}>
                    <MaterialIcons name="monetization-on" size={16} color={palette.primary} />
                    <Text style={styles2.textIcon}>{language === 'ar' ? translateEnglishNumbers(pricePerSeat) : pricePerSeat} {t('EGP')}</Text>
                </View>

                <View style={[styles2.subViews, { flex: 1, borderRightWidth: 1 }]}>
                    {
                        items
                    }
                </View>

                <View style={[styles2.subViews, { flex: 1, borderRightWidth: 1 }]}>
                    <MaterialIcons name="date-range" size={16} color={palette.primary} />
                    <Text style={styles2.textIcon}>{date}</Text>
                </View>

                <View style={[styles2.subViews, styles2.flexOne]}>
                    <MaterialIcons name="schedule" size={16} color={palette.primary} />
                    <Text style={styles2.textIcon}>{time}</Text>
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
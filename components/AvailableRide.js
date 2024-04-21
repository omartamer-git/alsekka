import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../api/accountAPI';
import { addSecondsToDate, getDurationValues, getTime, palette, rem, styles } from '../helper';
import useLocale from '../locale/localeContext';

function AvailableRide({ rid, fromAddress, toAddress, pricePerSeat, seatsOccupied, seatsAvailable, date, driverName, duration, model, brand, pickupEnabled, gender, DriverId, onPress = function () { }, style = {} }) {
    const items = [];
    const rideFull = (seatsAvailable - seatsOccupied) <= 0;
    const { id } = useUserStore();
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
        items.push(<Text style={[styles.text]} key={"full" + rid}>{t('ride_full')}</Text>)
    }


    return (
        <TouchableOpacity onPress={function () { onPress(rid, DriverId === id) }} activeOpacity={0.65} style={[styles.w100, styles.p24, styles.br16, styles.bgWhite, styles.border1, styles.borderLight, style]}>
            <View style={[styles.flexRow, styles.w100]}>
                <View style={{ maxWidth: '60%', alignItems: 'flex-start' }}>
                    <View style={styles.flexRow}>
                        <View>
                            <Text style={[styles.text, { fontWeight: '700', fontSize: 16 }]}>{getTime(date)[0]}
                                <Text style={styles.font12}>&nbsp;{t(getTime(date)[1])}</Text>
                            </Text>
                        </View>
                        <View style={[styles.flexRow, styles.fullCenter, styles.mt5]}>
                            <View style={{ height: 0.5, backgroundColor: 'darkgray', marginHorizontal: 4, width: 25 }} />
                            <Text style={[styles.text, { color: palette.dark, fontWeight: '600', marginHorizontal: 2, fontSize: 10 }]}>{getDurationValues(duration)[0]}{t('h')}{getDurationValues(duration)[1]}{t('m')}</Text>
                            <View style={{ height: 0.5, backgroundColor: 'darkgray', marginHorizontal: 4, width: 25 }} />
                        </View>
                    </View>
                    <Text style={[styles.text]} numberOfLines={2} ellipsizeMode='tail'>{fromAddress.split(',')[0]}</Text>
                </View>

                <View style={[styles.flexOne, styles.alignStart]}>
                    <Text style={[styles.text, { fontWeight: '700', fontSize: 16 }]}>{getTime(addSecondsToDate(date, duration))[0]}<Text style={styles.font12}>&nbsp;{t(getTime(addSecondsToDate(date, duration))[1])}</Text></Text>
                    <Text style={[styles.text]} numberOfLines={2} ellipsizeMode='tail'>{toAddress.split(',')[0]}</Text>
                </View>
            </View>

            <View style={[styles.flexRow, styles.w100, { marginTop: 24 }]}>
                <View style={[{ flexWrap: 'wrap' }, styles.flexOne, styles.flexRow, styles.alignEnd]}>
                    {gender !== "ANY" &&
                        <View style={[styles.fullCenter, { width: 32, height: 24, borderRadius: 12, margin: 1 * rem, backgroundColor: gender === "MALE" ? "#1d74c6" : "pink" }]}>
                            <Text style={[styles.bold, styles.text, styles.font12, { color: gender === "MALE" ? "white" : "black" }]}>{gender.substring(0, 1).toUpperCase()}</Text>
                        </View>
                    }

                    {pickupEnabled &&
                        <View style={[styles.ph16, styles.bgRed, styles.fullCenter, { borderRadius: 12 * rem, height: 24 * rem, alignSelf: 'flex-end', margin: 1 * rem }]}>
                            <Text style={[styles.text, { color: palette.white, fontSize: 10, fontWeight: '600', fontStyle: 'italic' }]}>
                                {t('pick_up')}
                            </Text>
                        </View>
                    }
                    {model && brand &&
                        <View style={[styles.ph16, styles.bgDark, styles.fullCenter, { borderRadius: 12 * rem, height: 24 * rem, alignSelf: 'flex-end', margin: 1 * rem }]}>
                            <Text style={[styles.text, { color: palette.white, fontSize: 10, fontWeight: '600', fontStyle: 'italic' }]}>{brand} {model}</Text>
                        </View>
                    }
                </View>
                <View style={[styles.flexCol, styles.alignEnd, styles.justifyEnd]}>
                    {pricePerSeat && <Text style={[styles.text, { fontWeight: '700', fontSize: 16, alignSelf: 'flex-end' }]}>{Math.ceil(pricePerSeat/100)}<Text style={styles.font12}>&nbsp;{t('EGP')}</Text></Text>}
                    <View style={[styles.flexRow, styles.fullCenter]}>
                        <MaterialIcons name="person" size={16} color={palette.dark} />
                        <Text style={[styles.dark, styles.text]}>
                            {seatsAvailable && seatsOccupied ? seatsOccupied + '/' + seatsAvailable : seatsAvailable}
                            &nbsp;•&nbsp;
                            {t(days[date.getDay()])} {date.getDate()} {t(months[date.getMonth()])}
                        </Text>
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
            minHeight: 165 * rem
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

export default memo(AvailableRide);
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem } from '../helper';
import FromToIndicator from './FromToIndicator';
import useUserStore from '../api/accountAPI';

const AvailableRide = ({ rid, fromAddress, toAddress, pricePerSeat, seatsOccupied, seatsAvailable, date, time, driverName, DriverId, onPress=() => {}, style = {} }) => {
    const items = [];
    const rideFull = (seatsAvailable - seatsOccupied) <= 0;
    const {id} = useUserStore();
    if(!rideFull) {
        for (let i = 0; i < seatsOccupied; i++) {
            items.push(<MaterialIcons key={ "seat" + i } name="account-circle" size={16} color={palette.primary} />);
        }
    
        for (let j = 0; j < seatsAvailable - seatsOccupied; j++) {
            items.push(<MaterialIcons key={ "emptyseat" + j } name="account-circle" size={16} color={palette.light} />);
        }    
    } else {
        items.push(<Text key={"full" + rid}>Ride Full!</Text>)
    }

    return (
        <TouchableOpacity activeOpacity={0.65} style={[styles.rideView, style]} onPress={() => { !rideFull ? onPress(rid, DriverId === id) : () => {return;} }}>
            <View style={{ flexDirection: 'row', flex: 7, padding: 16 }}>
                <View style={{ height: '100%' }}>
                    <FromToIndicator circleRadius={5} />
                </View>
                <View style={{ height: '100%', flex: 1, marginLeft: 10, justifyContent: 'space-between' }}>
                    <Text style={{ alignSelf: 'flex-start', fontWeight: '600' }}>{fromAddress}</Text>
                    <View style={styles.flexOne} />
                    <Text style={{ alignSelf: 'flex-start', fontWeight: '600' }}>{toAddress}</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', flex: 3, width: '100%', paddingLeft: 5, paddingRight: 5, borderTopWidth: 1, borderColor: palette.light }}>
                <View style={[styles.subViews, { flex: 1, borderRightWidth: 1 }]}>
                    <MaterialIcons name="monetization-on" size={16} color={palette.primary} />
                    <Text style={styles.textIcon}>{pricePerSeat}EGP</Text>
                </View>

                <View style={[styles.subViews, { flex: 1, borderRightWidth: 1 }]}>
                    {
                        items
                    }
                </View>

                <View style={[styles.subViews, { flex: 1, borderRightWidth: 1 }]}>
                    <MaterialIcons name="date-range" size={16} color={palette.primary} />
                    <Text style={styles.textIcon}>{date}</Text>
                </View>

                <View style={[styles.subViews, styles.flexOne]}>
                    <MaterialIcons name="schedule" size={16} color={palette.primary} />
                    <Text style={styles.textIcon}>{time}</Text>
                </View>
            </View>


        </TouchableOpacity>
    );
}

const styles = StyleSheet.create(
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
            flexDirection: 'row'
        },

        textIcon: {
            fontSize: 12 * rem,
            fontWeight: '500',
            marginLeft: 2
        }
    }
);

export default AvailableRide;
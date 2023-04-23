import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette } from '../helper';
import FromToIndicator from './FromToIndicator';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AvailableRide = ({ rid, fromAddress, toAddress, pricePerSeat, seatsOccupied, date, time, driverName, onPress=() => {}, style = {} }) => {
    const items = [];
    for (let i = 0; i < seatsOccupied; i++) {
        items.push(<MaterialIcons key={ "seat" + i } name="account-circle" size={16} color={palette.primary} />);
    }

    for (let j = 0; j < 4 - seatsOccupied; j++) {
        items.push(<MaterialIcons key={ "emptyseat" + j } name="account-circle" size={16} color={palette.light} />);
    }
    return (
        <TouchableOpacity style={[styles.rideView, style]} onPress={() => { onPress(rid) }}>
            <View style={{ flexDirection: 'row', flex: 7, padding: 16 }}>
                <View style={{ height: '100%', flex: 0.1 }}>
                    <FromToIndicator circleRadius={5} />
                </View>
                <View style={{ height: '100%', flex: 0.9 }}>
                    <Text style={{ alignSelf: 'flex-start', fontWeight: '600' }}>{fromAddress}</Text>
                    <View style={{ flex: 1 }} />
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

                <View style={[styles.subViews, { flex: 1 }]}>
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
            height: 165
        },

        subViews: {
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: palette.light,
            flexDirection: 'row'
        },

        textIcon: {
            fontSize: 12,
            fontWeight: '500',
            marginLeft: 2
        }
    }
);

export default AvailableRide;
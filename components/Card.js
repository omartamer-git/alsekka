import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette, rem } from '../helper';
import FromToIndicator from './FromToIndicator';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Separator from './Separator';

const Card = ({ type, number }) => {
    return (
        <TouchableOpacity activeOpacity={0.75} style={{ flexDirection: 'row', width: '100%', height: 48 * rem, alignItems: 'center', borderBottomWidth: 1, borderColor: palette.light }}>
            {
                (type == 'mastercard') ?
                    <FontsAwesome5 name="cc-mastercard" size={24} color={palette.accent}/>
                    :
                    <FontsAwesome5 name="cc-visa" size={24} color={palette.accent}/>
            }
            <Text style={{marginLeft: 16, fontWeight: '500'}}>•••• {number}</Text>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
                <FontsAwesome5 name="chevron-right" size={18} color={palette.dark}/>
            </View>
        </TouchableOpacity>
    );
};

export default Card;
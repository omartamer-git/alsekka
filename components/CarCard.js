import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem, styles, translateEnglishNumbers } from '../helper';

const CarCard = ({approved, brand, model, year, color, licensePlateLetters, licensePlateNumbers, onPress=()=>{} }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={{ width: '100%', padding: 16, borderBottomWidth: 1, borderColor: palette.light, ...styles.flexRow, justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={[styles.flexRow, { width: '60%' }]}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    {approved === 'APPROVED' && <FontsAwesome5 name="car-alt" size={28} />}
                    {approved === 'PENDING' && <MaterialIcons name="schedule" size={28} color={palette.dark} />}
                </View>
                <View style={{ justifyContent: 'center', marginStart: 10 }}>
                    <Text style={[styles.font14, styles.bold, { flexWrap: 'wrap', color: (approved === 'APPROVED' ? palette.black : palette.dark) }]}>{brand} {model} ({year})</Text>
                    <Text style={[styles.font14, styles.bold,  { flexWrap: 'wrap', color: palette.dark }]}>{color}</Text>
                </View>
            </View>
            <View style={[styles.mt10, styles.br8, styles.borderDark, styles.border2, { height: 60 * rem, alignSelf: 'flex-end', width: '30%' }]}>
                <View style={[styles.flexRow, styles.spaceBetween, styles.borderDark, styles.w100, { borderBottomWidth: 2, flexShrink: 1, paddingStart: 2, paddingEnd: 2, backgroundColor: approved === 'APPROVED' ? '#0377b4' : palette.light }]}>
                    <Text style={[styles.semiBold, styles.font12]}>EGYPT</Text>
                    <Text style={[styles.semiBold, styles.font12]}>مصر</Text>
                </View>
                <View style={{ ...styles.flexRow, justifyContent: 'space-between', width: '100%', flex: 1 }}  >
                    <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '600', fontSize: 13, flexWrap: 'nowrap' }}>{translateEnglishNumbers(licensePlateNumbers)}</Text>
                    </View>
                    <View style={{ flex: 1, backgroundColor: '#999999' }}></View>
                    <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '600', fontSize: 13, flexWrap: 'nowrap' }}>{licensePlateLetters.split('').join('​')}</Text></View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default CarCard;
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, translateEnglishNumbers } from '../helper';

const CommunityCard = ({name, picture, description, privacy, style={}, onPress=()=>{} }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={[{ width: '100%', padding: 16, borderWidth: 1, borderRadius: 8, borderColor: palette.light, flexDirection: 'row', }, style]}>
            <View style={{ flexShrink: 0.7, flexDirection: 'row' }}>
                <Image width={75} height={75} style={{borderRadius: 75/2}} source={{ uri: 'data:image/png;base64,' + picture}} />
                <View style={{ justifyContent: 'center', marginLeft: 10, flexShrink: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', flexWrap: 'wrap', color: palette.black }}>{name}</Text>
                    <Text style={{flexWrap: 'wrap', width: '100%'}}>{description.substring(0, 50)}</Text>
                </View>
            </View>
            <View style={{flexShrink: 0.3, justifyContent: 'center', alignItems: 'center'}}>
                <MaterialIcons name="arrow-forward-ios" size={18} color={palette.black} />
            </View>
        </TouchableOpacity>
    );
};

export default CommunityCard;
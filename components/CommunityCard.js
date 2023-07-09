import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, styles } from '../helper';

const CommunityCard = ({name, picture, description, privacy={}, style={}, onPress=()=>{} }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[{ width: '100%', padding: 16, borderWidth: 1, borderRadius: 8, borderColor: palette.light, flexDirection: 'row', }, style]}>
            <View style={[styles.flexRow, styles.flexOne]}>
                <Image width={75} height={75} style={{borderRadius: 75/2}} source={{ uri: 'data:image/png;base64,' + picture}} />
                <View style={{ justifyContent: 'center', marginLeft: 10, flexShrink: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', flexWrap: 'wrap', color: palette.black }}>{name}</Text>
                    <Text style={{flexWrap: 'wrap', width: '100%'}}>{description.substring(0, 50)}</Text>
                </View>
            </View>
            <View style={[styles.justifyCenter]}>
                <MaterialIcons name="arrow-forward-ios" size={18} color={palette.black} />
            </View>
        </TouchableOpacity>
    );
};

export default CommunityCard;
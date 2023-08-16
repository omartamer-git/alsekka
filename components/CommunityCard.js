import React from 'react';
import { I18nManager, Image, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, styles } from '../helper';

const CommunityCard = ({name, picture, description, minified=false, privacy={}, style={}, onPress=()=>{} }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[{ width: '100%', padding: 16, borderWidth: 1, borderRadius: 8, borderColor: palette.light, ...styles.flexRow, }, style]}>
            <View style={[styles.flexRow, styles.flexOne]}>
                <Image width={minified ? 50: 75} height={minified ? 50 : 75} style={{borderRadius: 75/2}} source={{ uri: picture}} />
                <View style={{ justifyContent: 'center', marginStart: 10, flexShrink: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', flexWrap: 'wrap', color: palette.black }}>{name}</Text>
                    {!minified && <Text style={{flexWrap: 'wrap', width: '100%'}}>{description.substring(0, 50)}</Text> }
                </View>
            </View>
            <View style={[styles.justifyCenter]}>
                <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} color={palette.black} />
            </View>
        </TouchableOpacity>
    );
};

export default CommunityCard;
import React, { memo } from 'react';
import { I18nManager, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, styles } from '../helper';

function CommunityCard({ name, picture, description, minified = false, privacy = {}, style = {}, onPress = function () { } }) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.w100, styles.p16, styles.border1, styles.br8, styles.borderLight, styles.flexRow, styles.bgWhite, style]}>
            <View style={[styles.flexRow, styles.flexOne]}>
                <FastImage style={{ width: minified ? 50 : 75, height: minified ? 50 : 75, borderRadius: 75 / 2 }} source={{ uri: picture }} />
                <View style={[styles.justifyCenter, styles.ml10, { flexShrink: 1 }]}>
                    <Text style={[styles.text, { fontSize: 18, fontWeight: '600', flexWrap: 'wrap', color: palette.dark }]}>{name}</Text>
                    {!minified && <Text style={[styles.text, styles.dark, styles.textStart, { flexWrap: 'wrap', width: '90%' }]} ellipsizeMode='tail' numberOfLines={2}>{description}</Text>}
                </View>
            </View>
            <View style={[styles.justifyCenter]}>
                <MaterialIcons name={I18nManager.isRTL ? "arrow-back-ios" : "arrow-forward-ios"} size={18} color={palette.black} />
            </View>
        </TouchableOpacity>
    );
};

export default memo(CommunityCard);
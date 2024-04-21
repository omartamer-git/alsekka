import { StyleSheet, View } from 'react-native';
import { palette, rem } from '../helper';
import { memo } from 'react';
function FromToIndicator({ circleRadius, style }) {
    const circleStyle = StyleSheet.create({
        circle: {
            borderRadius: circleRadius, width: circleRadius * 2 * rem, height: circleRadius * 2 * rem, borderWidth: circleRadius * rem / 2, borderColor: palette.primary, position: 'relative', marginBottom: -1 * rem * circleRadius / 10
        },

        line: {
            flex: 1, width: circleRadius / 2, backgroundColor: palette.primary
        }
    })

    return (
        <View style={[style, { alignItems: 'center', justifyContent: 'center', height: '100%' }]}>
            <View style={circleStyle.circle}>

            </View>
            <View style={circleStyle.line}>

            </View>
            <View style={circleStyle.circle}>

            </View>
        </View>
    );
};

export default memo(FromToIndicator);
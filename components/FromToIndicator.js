import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { palette } from '../helper';
const FromToIndicator = ({circleRadius, style}) => {
    return (
        <View style={[style, {alignItems: 'center', justifyContent: 'center', height: '100%'}]}>
            <View style={{borderRadius: circleRadius, width: circleRadius*2, height: circleRadius*2, borderWidth: circleRadius/2, borderColor: palette.primary, position: 'relative', marginBottom: -1 * circleRadius/10 }}>

            </View>
            <View style={{flex: 1, width: circleRadius/2, backgroundColor: palette.primary }}>

            </View>
            <View style={{borderRadius: circleRadius, width: circleRadius*2, height: circleRadius*2, borderWidth: circleRadius/2, borderColor: palette.primary, position: 'relative', marginTop: -1 * circleRadius/10 }}>

            </View>
        </View>
    );
};

export default FromToIndicator;
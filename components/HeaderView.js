import {
    I18nManager,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem, styles } from '../helper';

const HeaderView = ({ screenName, navType, action, children, colorMode="light", borderVisible=true, style={} }) => {
    const colorModeColor = colorMode === "light" ? palette.white : palette.dark;
    let modifierStyles = {};
    if(borderVisible) {
        modifierStyles = { borderBottomWidth: 1 };
    } else {
        modifierStyles = { borderBottomWidth: 0 };
    }
    return (
        <View style={[styles2.viewStyle, modifierStyles, style]}>
            <View style={{ alignItems: 'flex-start' }}>
                {
                    navType &&
                    (
                        <TouchableOpacity style={{width: 44 * rem, height: '100%', justifyContent: 'center' }} onPress={action}>
                            {
                                (navType == "close" && <MaterialIcons name="close" size={22} color={colorModeColor} />) ||
                                (navType == "back" && <MaterialIcons name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"} size={22} color={colorModeColor} />) ||
                                (navType == "menu" && <MaterialIcons name="menu" size={22} color={colorModeColor} />)
                            }
                        </TouchableOpacity>
                    )
                }
            </View>
            
            <View style={{ flex: 1, alignItems: 'center', paddingEnd: navType ? 44 * rem : 0 }}>
                {screenName && <View style={styles2.screenName}><Text style={{ textAlign: 'center', color: colorModeColor, fontWeight: '600', fontSize: 16 }}>{screenName}</Text></View>}
            </View>
        </View>
    );
}

const styles2 = StyleSheet.create({
    viewStyle: {
        width: '100%',
        height: 40 * rem,
        borderBottomColor: palette.light,
        ...styles.flexRow,
        alignItems: 'center',
        paddingStart: 20 * rem,
        paddingEnd: 20 * rem,
    },
    screenName: {
        alignItems: 'center',
    },
    children: {
        alignItems: 'flex-end',
        flex:1,
    }
});

export default HeaderView;
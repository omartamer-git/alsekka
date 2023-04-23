import {
    Modal,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette } from '../helper';

const HeaderView = ({ screenName, navType, action, children, colorMode="light", borderVisible=true, style={} }) => {
    const colorModeColor = colorMode === "light" ? palette.white : palette.dark;
    let modifierStyles = {};
    if(borderVisible) {
        modifierStyles = { borderBottomWidth: 1 };
    } else {
        modifierStyles = { borderBottomWidth: 0 };
    }
    return (
        <View style={[styles.viewStyle, modifierStyles, style]}>
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
                {
                    navType &&
                    (
                        <TouchableOpacity style={{width: 44 }} onPress={action}>
                            {
                                (navType == "close" && <MaterialIcons name="close" size={22} color={colorModeColor} />) ||
                                (navType == "back" && <MaterialIcons name="arrow-back" size={22} color={colorModeColor} />) ||
                                (navType == "menu" && <MaterialIcons name="menu" size={22} color={colorModeColor} />)
                            }
                        </TouchableOpacity>
                    )
                }
            </View>
            
            <View style={{ flex: 1, alignItems: 'center' }}>
                {screenName && <View style={styles.screenName}><Text style={{ textAlign: 'center', color: colorModeColor, fontWeight: '600', fontSize: 16 }}>{screenName}</Text></View>}
            </View>


            <View style={styles.children}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewStyle: {
        width: '100%',
        height: 40,
        borderBottomColor: palette.light,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
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
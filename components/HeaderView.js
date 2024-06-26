import {
    I18nManager,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem, styles } from '../helper';
import { memo } from 'react';

function HeaderView({ screenName, navType, action, children, borderVisible = true, style = {} }) {
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
            flex: 1,
        }
    });


    let modifierStyles = {};
    if (borderVisible) {
        modifierStyles = { borderBottomWidth: 1 };
    } else {
        modifierStyles = { borderBottomWidth: 0 };
    }
    return (
        <View style={[styles2.viewStyle, modifierStyles, style]}>
            <View style={[styles.alignStart, {zIndex: 50}]}>
                {
                    navType &&
                    (
                        <TouchableOpacity style={[styles.justifyCenter, styles.h100, { width: 44 * rem }]} onPress={action}>
                            {
                                (navType == "close" && <MaterialIcons name="close" size={22} color={palette.white} />) ||
                                (navType == "back" && <MaterialIcons name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"} size={22} color={palette.white} />) ||
                                (navType == "menu" && <MaterialIcons name="menu" size={22} color={palette.white} />)
                            }
                        </TouchableOpacity>
                    )
                }
            </View>

            <View style={[styles.flexOne, styles.alignCenter, { paddingEnd: navType ? 44 * rem : 0 }]}>
                {screenName && <View style={styles2.screenName}><Text style={[styles.text, styles.alignCenter, styles.headerText, styles.font16, { color: palette.white }]}>{screenName}</Text></View>}
            </View>
        </View>
    );
}


export default memo(HeaderView);
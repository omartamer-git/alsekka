import React, { memo } from 'react';
import {
    Keyboard,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import HeaderView from '../components/HeaderView';

import { palette, rem, styles } from '../helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ScreenWrapper({ screenName, children, navType, navAction, lip = true }) {
    const insets = useSafeAreaInsets();
    const wrapperStyles = StyleSheet.create({
        lipStyle: {
            width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20 * rem, borderBottomLeftRadius: 20, borderBottomRightRadius: 20
        },

        paddingInsets: {
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : insets.top
        }
    });

    return (
        <View style={[styles.backgroundStyle]} activeOpacity={1}>
            <>
                <View style={[wrapperStyles.paddingInsets]}>
                    <HeaderView navType={navType} screenName={screenName} borderVisible={false} action={navAction} />
                </View>

                <View style={[styles.wrapper]}>
                    <View style={[styles.bgLighter, styles.w100, styles.flexOne]}>
                        {lip &&
                            <View style={wrapperStyles.lipStyle}>

                            </View>
                        }

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <>
                                {children}
                            </>
                        </TouchableWithoutFeedback>
                    </View>
                </View >

            </>
        </View>
    );
};

export default memo(ScreenWrapper);
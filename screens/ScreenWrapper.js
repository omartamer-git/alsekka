import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    useColorScheme
} from 'react-native';
import HeaderView from '../components/HeaderView';

import { palette, rem, styles } from '../helper';

const ScreenWrapper = ({ screenName, children, navType, navAction, lip=true }) => {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType={navType} screenName={screenName} borderVisible={false} action={navAction} />
            </SafeAreaView>

            <View style={styles.wrapper}>
                <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexOne]}>
                    { lip && <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20 * rem, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                    </View> }


                    {children}
                </SafeAreaView>
            </View >
        </View >
    );
};

export default ScreenWrapper;
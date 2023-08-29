import React from 'react';
import {
    Keyboard,
    SafeAreaView,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import HeaderView from '../components/HeaderView';

import { palette, rem, styles } from '../helper';

const ScreenWrapper = ({ screenName, children, navType, navAction, lip = true }) => {

    return (
        <View style={styles.backgroundStyle} activeOpacity={1}>
            <>
                <SafeAreaView>
                    <HeaderView navType={navType} screenName={screenName} borderVisible={false} action={navAction} />
                </SafeAreaView>

                <View style={styles.wrapper}>
                    <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexOne]}>
                        {lip && <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20 * rem, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                        </View>}

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <>
                                {children}
                            </>
                        </TouchableWithoutFeedback>
                    </SafeAreaView>
                </View >

            </>
        </View>
    );
};

export default ScreenWrapper;
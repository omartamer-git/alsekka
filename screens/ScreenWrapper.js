import React from 'react';
import {
    Keyboard,
    SafeAreaView,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import HeaderView from '../components/HeaderView';

import { palette, rem, styles } from '../helper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenWrapper = ({ screenName, children, navType, navAction, lip = true }) => {
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.backgroundStyle} activeOpacity={1}>
            <>
                <View style={{paddingTop: insets.top}}>
                    <HeaderView navType={navType} screenName={screenName} borderVisible={false} action={navAction} />
                </View>

                <View style={styles.wrapper}>
                    <View style={[styles.bgLightGray, styles.w100, styles.flexOne]}>
                        {lip && 
                        <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20 * rem, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                        </View>}

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

export default ScreenWrapper;
import { useTranslation } from "react-i18next";
import ScreenWrapper from "../ScreenWrapper";
import { containerStyle, palette, rem, styles } from "../../helper";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from "../../api/accountAPI";
import FastImage from "react-native-fast-image";
import { useEffect, useState } from "react";

export default function Profile({ route, navigation }) {
    const { t } = useTranslation();
    const userProfilePicture = useUserStore(state => state.profilePicture);
    const userFirstName = useUserStore(state => state.firstName);
    const userLastName = useUserStore(state => state.lastName);
    const userRating = useUserStore((state) => state.rating);
    const [ratings, setRatings] = useState([]);

    useEffect(function () {
        const fullStars = Math.floor(userRating);
        const halfStars = Math.ceil(userRating) - Math.abs(userRating);

        let ratingsItems = [];
        for (let i = 0; i < fullStars; i++) {
            ratingsItems.push(<MaterialIcons key={"fullStar" + i} size={20} name="star" color={palette.white} />);
        }

        for (let j = 0; j < halfStars; j++) {
            ratingsItems.push(<MaterialIcons key={"halfStar" + j} size={20} name="star-half" color={palette.white} />);
        }

        setRatings(ratingsItems);
    }, []);

    return (
        <>
            <ScreenWrapper screenName={t('account')}>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                    <View style={[styles.w100, styles.br24, styles.bgWhite, styles.p16, styles.shadow]}>
                        <View style={[styles.w100, styles.alignEnd]}>
                            <View style={[styles.p16, styles.brFull, styles.bgLighter, styles.fullCenter]}>
                                <MaterialIcons name="settings" size={24} color={palette.dark} />
                            </View>
                        </View>

                        <View style={[styles.w100, styles.fullCenter, styles.gap5]}>
                            <TouchableOpacity activeOpacity={0.8} style={profileStyles.profilePictureView}>
                                <FastImage source={{ uri: userProfilePicture }} style={profileStyles.profilePicture} />
                            </TouchableOpacity>

                            <Text style={[styles.text, styles.textCenter, styles.font24, styles.bold]}>{userFirstName} {userLastName}</Text>

                            {/* <View style={[styles.fullCenter, styles.flexRow]}>
                                {ratings}
                            </View> */}
                        </View>
                    </View>

                    <View style={[styles.w100, styles.flexRow, styles.gap5]}>
                        <View style={[styles.flexOne, styles.flexRow, styles.fullCenter, styles.brFull, styles.mt5, styles.p16, styles.bgAccent, styles.shadow]}>
                            {ratings}
                        </View>
                        <View style={[styles.flexOne, styles.flexRow, styles.fullCenter, styles.brFull, styles.mt5, styles.p16, styles.bgWhite, styles.shadow, styles.gap5]}>
                            <View style={{height: 28 * rem, width: 28 * rem, alignItems: 'center', justifyContent: 'center'}}>
                                <MaterialIcons name="forum" size={24} color={palette.dark} />
                            </View>
                            <Text style={[styles.text, styles.font16, styles.semiBold, styles.textCenter, {lineHeight: null}]}>
                                {t('message')}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.flexRow, styles.w100]}>
                        <View>
                            
                        </View>
                    </View>
                </ScrollView>
            </ScreenWrapper>
        </>
    )
}

const profileStyles = StyleSheet.create({
    profilePictureView: {
        width: 100 * rem,
        height: 100 * rem,
        marginTop: -32 * rem,
        ...styles.brFull,
        ...styles.borderPrimary,
        ...styles.fullCenter,
        borderWidth: 3 * rem,
    },

    profilePicture: {
        borderWidth: 2 * rem,
        width: 95 * rem,
        height: 95 * rem,
        ...styles.brFull,
        ...styles.borderWhite,
    },
});
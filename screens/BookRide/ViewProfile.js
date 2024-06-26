import LottieView from "lottie-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from "../../api/accountAPI";
import BottomModalSheet from "../../components/ModalSheet";
import RoundedButton from "../../components/RoundedButton";
import { containerStyle, palette, rem, styles } from "../../helper";
import ScreenWrapper from "../ScreenWrapper";
import CustomTextInput from "../../components/CustomTextInput";
import Button from "../../components/Button";
import { Defs, RadialGradient, Rect, Stop, Svg } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { launchImageLibrary } from "react-native-image-picker";
import { getProfile } from "../../api/profileAPI";

export default function ViewProfile({ route, navigation }) {
    const { t } = useTranslation();
    const { userId, profilePicture: userProfilePicture, firstName: userFirstName, lastName: userLastName, rating: userRating } = route.params;

    // const userProfilePicture = useUserStore(state => state.profilePicture);
    // const userFirstName = useUserStore(state => state.firstName);
    // const userLastName = useUserStore(state => state.lastName);
    // const userRating = useUserStore((state) => state.rating);
    // const userPreferences = useUserStore(statex => state.preferences);
    // const userStats = useUserStore(state => state.stats);
    const [userPreferences, setUserPreferences] = useState({});
    const [userStats, setUserStats] = useState({});

    // const userUpdateProfilePicture = useUserStore((state) => state.uploadProfilePicture);

    const spotifyRegex = useMemo(() => /^https?:\/\/open\.spotify\.com\/user\/.+$/, []);
    const anghamiRegex = useMemo(() => /^https?:\/\/open\.anghami\.com\/[a-zA-Z0-9_]+\/?$/, []);
    const appleMusicRegex = useMemo(() => /^https?:\/\/music\.apple\.com(?:$|\/)/, []);


    const [ratings, setRatings] = useState([]);
    const [musicModalVisible, setMusicModalVisible] = useState(false);
    const [facebookModalVisible, setFacebookModalVisible] = useState(false);
    const [instagramModalVisible, setInstagramModalVisible] = useState(false);
    const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);

    // const socials = useUserStore(state => state.socials);
    const [socials, setSocials] = useState({});
    const linkFacebook = useUserStore(state => state.updateFacebookLink);
    const linkInstagram = useUserStore(state => state.updateInstagramLink);
    const linkMusic = useUserStore(state => state.updateMusicLink);
    const updatePreferences = useUserStore(state => state.updatePreferences);

    const linkedProvider = useMemo(() => {
        if (socials?.musicLink) {
            if (spotifyRegex.test(socials.musicLink)) {
                return 'SPOTIFY';
            } else if (anghamiRegex.test(socials.musicLink)) {
                return 'ANGHAMI';
            } else if (appleMusicRegex.test(socials.musicLink)) {
                return 'APPLE_MUSIC';
            }
        }
    }, [socials]);

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

    useEffect(() => {
        getProfile(userId).then(profile => {
            setSocials(profile.socials);
            setUserPreferences(profile.preferences);
            setUserStats(profile.stats);
        });
    }, [])

    function handlePressMusic() {
        Linking.openURL(socials.musicLink);
    }

    function handlePressFacebook() {
        Linking.openURL(socials.facebookLink);
    }

    function handlePressInstagram() {
        Linking.openURL(socials.instagramLink);
    }

    const insets = useSafeAreaInsets();



    return (
        <>
            <ScreenWrapper navType={'back'} navAction={() => navigation.goBack()} screenName={t('account')}>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                    <View style={[styles.w100, styles.br24, styles.bgWhite, styles.p16, styles.shadow]}>
                        <View style={[styles.w100, styles.fullCenter, styles.gap5]}>
                            <View activeOpacity={0.8} style={[profileStyles.profilePictureView]}>
                                <FastImage source={{ uri: userProfilePicture }} style={profileStyles.profilePicture} />
                            </View>
                            <Text style={[styles.text, styles.textCenter, styles.font24, styles.bold]}>{userFirstName} {userLastName}</Text>
                        </View>
                    </View>

                    <View style={[styles.w100, styles.flexRow, styles.gap5]}>
                        <View style={[styles.flexOne, styles.flexRow, styles.fullCenter, styles.brFull, styles.mt5, styles.p16, styles.bgAccent, styles.shadow]}>
                            {ratings}
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Chat', { receiver: userId })} activeOpacity={0.9} style={[styles.flexOne, styles.flexRow, styles.fullCenter, styles.brFull, styles.mt5, styles.p16, styles.bgWhite, styles.shadow, styles.gap5]}>
                            <View style={{ height: 28 * rem, width: 28 * rem, alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialIcons name="chat-bubble" size={24} color={palette.dark} />
                            </View>
                            <Text style={[styles.text, styles.font16, styles.semiBold, styles.textCenter, { lineHeight: null }]}>
                                {t('message')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.flexRow, styles.w100, styles.spaceBetween, styles.mt10]}>
                        <View style={[{ width: '32%' }, styles.br24, styles.bgWhite, styles.pv16, styles.ph24, styles.shadow, styles.fullCenter, styles.gap5]}>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.font28, styles.textCenter]} numberOfLines={1} adjustsFontSizeToFit>
                                {userStats.ridesTaken < 1000 ? userStats.ridesTaken : (userStats.ridesTaken / 1000).toFixed(1) + 'K'}
                            </Text>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, styles.dark, { opacity: 0.3 }, styles.font16, styles.textCenter]}>Trips</Text>
                        </View>

                        <View style={[{ width: '32%' }, styles.br24, styles.bgWhite, styles.pv16, styles.ph24, styles.shadow, styles.fullCenter, styles.gap5]}>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.font28, styles.textCenter]} numberOfLines={1} adjustsFontSizeToFit>
                                {userStats.ridesDriven < 1000 ? userStats.ridesDriven : (userStats.ridesDriven / 1000).toFixed(1) + 'K'}
                            </Text>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, styles.dark, { opacity: 0.3 }, styles.font16, styles.textCenter]}>Drives</Text>
                        </View>

                        <View style={[{ width: '32%' }, styles.br24, styles.bgWhite, styles.pv16, styles.ph24, styles.shadow, styles.fullCenter, styles.gap5]}>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.font28, styles.textCenter]} numberOfLines={1} adjustsFontSizeToFit>
                                {new Date(userStats.createdAt).getFullYear()}
                            </Text>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, styles.dark, { opacity: 0.3 }, styles.font16, styles.textCenter]}>Created</Text>
                        </View>
                    </View>

                    <View style={[styles.flexRow, styles.gap10]}>
                        {
                            (socials?.facebookLink || socials?.instagramLink) &&
                            <View style={[styles.flexCol, styles.flexOne]}>
                                {
                                    socials?.facebookLink &&
                                    <TouchableOpacity activeOpacity={0.9} onPress={handlePressFacebook} style={[styles.flexCol, styles.flexOne, styles.br24, styles.pv16, styles.ph16, styles.shadow, styles.mt10, styles.fullCenter, styles.gap15, { backgroundColor: '#0866ff' }]}>
                                        {/* <LottieView source={require('../../assets/facebook_animation.json')} loop={false} autoPlay style={{ width: '75%', aspectRatio: 1 }} /> */}
                                        <Image source={require('../../assets/facebook_logo_white.png')} style={{ width: 70, height: 70 }} />
                                        <Text style={[styles.text, styles.textCenter, styles.white, styles.font12, styles.semiBold]}>Tap to View</Text>
                                    </TouchableOpacity>

                                }

                                {
                                    socials?.instagramLink &&
                                    <TouchableOpacity onPress={handlePressInstagram} activeOpacity={0.9} style={[styles.flexCol, styles.flexOne, styles.br24, styles.pv16, styles.ph8, styles.shadow, styles.mt10, styles.fullCenter, styles.gap15, styles.overflowHidden, { backgroundColor: palette.dark }]}>
                                        <Image source={require('../../assets/instagram_logo_white.png')} style={{ zIndex: 20, width: 70, height: 70 }} />
                                        {/* <IGBackground style={[{zIndex: -1}]} /> */}
                                        <Text style={[styles.text, styles.textCenter, styles.white, styles.font12, styles.semiBold]}>Tap to View</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        }
                        {((userPreferences && Object.values(userPreferences).filter(p => p !== 0).length !== 4) || socials?.musicLink) &&
                            <View style={[styles.flexCol, styles.flexOne]}>
                                <>
                                    {(userPreferences && Object.values(userPreferences).filter(p => p !== 0).length !== 4) &&
                                        <TouchableOpacity activeOpacity={0.9} onPress={() => setPreferencesModalVisible(true)} style={[styles.flexCol, styles.br24, styles.p24, styles.bgAccent, styles.shadow, styles.mt10, styles.fullCenter, { flex: socials?.musicLink ? 0 : 1 }]}>
                                            {
                                                userPreferences &&
                                                <View style={[styles.flexRow, styles.gap5, styles.w100, styles.fullCenter]}>
                                                    {
                                                        userPreferences.music === 1 &&
                                                        <MaterialIcons name="music-note" size={24} color={palette.white} />
                                                    }

                                                    {
                                                        userPreferences.music === -1 &&
                                                        <MaterialIcons name="music-off" size={24} color={palette.white} />
                                                    }

                                                    {
                                                        userPreferences.smoking === 1 &&
                                                        <MaterialIcons name="smoking-rooms" size={24} color={palette.white} />
                                                    }
                                                    {
                                                        userPreferences.smoking === -1 &&
                                                        <MaterialIcons name="smoke-free" size={24} color={palette.white} />
                                                    }

                                                    {
                                                        userPreferences.chattiness === 1 &&
                                                        <MaterialIcons name="question-answer" size={24} color={palette.white} />
                                                    }
                                                    {
                                                        userPreferences.chattiness === -1 &&
                                                        <MaterialIcons name="volume-off" size={24} color={palette.white} />
                                                    }

                                                    {
                                                        userPreferences.rest_stop === 1 &&
                                                        <MaterialIcons name="airline-stops" size={24} color={palette.white} />
                                                    }
                                                    {
                                                        userPreferences.rest_stop === -1 &&
                                                        <MaterialIcons name="bolt" size={24} color={palette.white} />
                                                    }
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    }

                                    {
                                        socials?.musicLink &&
                                        <TouchableOpacity activeOpacity={0.9} onPress={handlePressMusic} style={[styles.flexCol, styles.flexOne, styles.br24, styles.p16, styles.shadow, styles.mt10, styles.gap15, styles.fullCenter, { backgroundColor: linkedProvider === 'ANGHAMI' ? palette.black : linkedProvider === 'SPOTIFY' ? '#1ed760' : palette.dark }]}>
                                            {linkedProvider === 'SPOTIFY' &&
                                                <>
                                                    <Image source={require('../../assets/spotify_logo_alt.png')} style={{ width: 120, height: 120 }} />
                                                    <Text style={[styles.text, styles.textCenter, styles.white, styles.font12, styles.semiBold]}>Tap to View</Text>
                                                </>

                                            }
                                            {
                                                linkedProvider === 'ANGHAMI' &&
                                                <>
                                                    <Image source={require('../../assets/anghami_logo_alt.png')} style={{ width: 120, height: 120 }} />
                                                    <Text style={[styles.text, styles.textCenter, styles.white, styles.font12, styles.semiBold]}>Tap to View</Text>
                                                </>
                                            }
                                            {
                                                linkedProvider === 'APPLE_MUSIC' &&
                                                <>
                                                    <Image source={require('../../assets/applemusic_logo.png')} style={{ width: 120, height: 120 }} />
                                                    <Text style={[styles.text, styles.textCenter, styles.white, styles.font12, styles.semiBold]}>Tap to View</Text>
                                                </>
                                            }
                                        </TouchableOpacity>
                                    }
                                </>
                            </View>
                        }
                    </View>

                </ScrollView>
            </ScreenWrapper>

            <BottomModalSheet snapPoints={['55%', '70%']} setModalVisible={setPreferencesModalVisible} modalVisible={preferencesModalVisible} title={t('preferences')} style={{ paddingBottom: insets.bottom }}>
                <View style={[styles.flexCol, styles.w100, styles.ph24, styles.fullCenter, styles.gap10]}>
                    <Text style={[styles.text, styles.font18, styles.textCenter, styles.mt10]}>{t('preferences')}</Text>

                    {
                        userPreferences.music === 1 &&
                        <View style={[styles.flexRow, styles.fullCenter]}>
                            <View style={[styles.p24]}>
                                <MaterialIcons name="music-note" size={32} color={palette.dark} />
                            </View>

                            <Text style={[styles.text, styles.textStart, styles.font18, styles.flexOne]}>
                                {userFirstName} prefers listening to music during rides
                            </Text>
                        </View>
                    }

                    {
                        userPreferences.music === -1 &&
                        <View style={[styles.flexRow, styles.fullCenter]}>
                            <View style={[styles.p24]}>
                                <MaterialIcons name="music-note" size={32} color={palette.dark} />
                            </View>

                            <Text style={[styles.text, styles.textStart, styles.font18, styles.flexOne]}>
                                {userFirstName} prefer not to listen to music during rides
                            </Text>
                        </View>
                    }

                    {
                        userPreferences.smoking === 1 &&
                        <View style={[styles.flexRow, styles.fullCenter]}>
                            <View style={[styles.p24]}>
                                <MaterialIcons name="smoking-rooms" size={32} color={palette.dark} />
                            </View>

                            <Text style={[styles.text, styles.textStart, styles.font18, styles.flexOne]}>
                                {userFirstName} prefers to smoke during rides
                            </Text>
                        </View>
                    }

                    {
                        userPreferences.smoking === -1 &&
                        <View style={[styles.flexRow, styles.fullCenter]}>
                            <View style={[styles.p24]}>
                                <MaterialIcons name="smoking-rooms" size={32} color={palette.dark} />
                            </View>

                            <Text style={[styles.text, styles.textStart, styles.font18, styles.flexOne]}>
                                {userFirstName} prefers smoke-free rides
                            </Text>
                        </View>
                    }

                    {
                        userPreferences.chattiness === 1 &&
                        <View style={[styles.flexRow, styles.fullCenter]}>
                            <View style={[styles.p24]}>
                                <MaterialIcons name="question-answer" size={32} color={palette.dark} />
                            </View>

                            <Text style={[styles.text, styles.textStart, styles.font18, styles.flexOne]}>
                                {userFirstName} likes to chat during rides
                            </Text>
                        </View>
                    }

                    {
                        userPreferences.chattiness === -1 &&
                        <View style={[styles.flexRow, styles.fullCenter]}>
                            <View style={[styles.p24]}>
                                <MaterialIcons name="volume-off" size={32} color={palette.dark} />
                            </View>

                            <Text style={[styles.text, styles.textStart, styles.font18, styles.flexOne]}>
                                {userFirstName} prefers silent rides
                            </Text>
                        </View>
                    }

                    {
                        userPreferences.rest_stop === 1 &&
                        <View style={[styles.flexRow, styles.fullCenter]}>
                            <View style={[styles.p24]}>
                                <MaterialIcons name="airline-stops" size={32} color={palette.dark} />
                            </View>

                            <Text style={[styles.text, styles.textStart, styles.font18, styles.flexOne]}>
                                {userFirstName} likes to stop for breaks
                            </Text>
                        </View>
                    }

                    {
                        userPreferences.rest_stop === -1 &&
                        <View style={[styles.flexRow, styles.fullCenter]}>
                            <View style={[styles.p24]}>
                                <MaterialIcons name="bolt" size={32} color={palette.dark} />
                            </View>

                            <Text style={[styles.text, styles.textStart, styles.font18, styles.flexOne]}>
                                {userFirstName} doesn't prefer stopping for breaks
                            </Text>
                        </View>
                    }
                </View>
            </BottomModalSheet >
        </>
    )
}

const profileStyles = StyleSheet.create({
    profilePictureView: {
        width: 100 * rem,
        height: 100 * rem,
        ...styles.brFull,
        ...styles.borderPrimary,
        ...styles.fullCenter,
        borderWidth: 3 * rem,
        position: 'relative'
    },

    profilePicture: {
        borderWidth: 2 * rem,
        width: 95 * rem,
        height: 95 * rem,
        ...styles.brFull,
        ...styles.borderWhite,
    },
});
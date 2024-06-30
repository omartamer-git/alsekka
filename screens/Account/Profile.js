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

export default function Profile({ route, navigation }) {
    const { t } = useTranslation();
    const userProfilePicture = useUserStore(state => state.profilePicture);
    const userFirstName = useUserStore(state => state.firstName);
    const userLastName = useUserStore(state => state.lastName);
    const userRating = useUserStore((state) => state.rating);
    const userPreferences = useUserStore(state => state.preferences);
    const userStats = useUserStore(state => state.stats);
    const userUpdateProfilePicture = useUserStore((state) => state.uploadProfilePicture);

    const spotifyRegex = useMemo(() => /^https?:\/\/open\.spotify\.com\/user\/.+$/, []);
    const anghamiRegex = useMemo(() => /^https?:\/\/open\.anghami\.com\/[a-zA-Z0-9_]+\/?$/, []);
    const appleMusicRegex = useMemo(() => /^https?:\/\/music\.apple\.com(?:$|\/)/, []);


    const [ratings, setRatings] = useState([]);
    const [musicModalVisible, setMusicModalVisible] = useState(false);
    const [facebookModalVisible, setFacebookModalVisible] = useState(false);
    const [instagramModalVisible, setInstagramModalVisible] = useState(false);
    const [preferencesModalVisible, setPreferencesModalVisible] = useState(false);

    const socials = useUserStore(state => state.socials);
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

    function handlePressMusic() {
        setMusicModalVisible(true);
    }

    function handlePressFacebook() {
        setFacebookModalVisible(true);
    }

    function handlePressInstagram() {
        setInstagramModalVisible(true);
    }

    function MusicModal() {
        const [activeProvider, setActiveProvider] = useState('');
        const [step, setStep] = useState(1);
        const [providerLink, setProviderLink] = useState(socials?.musicLink || '');

        const currentProviderIcon = useMemo(() => (
            activeProvider === 'SPOTIFY' ? <Image source={require('../../assets/spotify_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} /> :
                activeProvider === 'ANGHAMI' ? <Image source={require('../../assets/anghami_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} /> :
                    activeProvider === 'APPLE_MUSIC' ? <Image source={require('../../assets/applemusic_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} /> : null
        ), [activeProvider]);

        const currentProviderDescription = useMemo(() => (
            activeProvider === 'SPOTIFY' ? t('spotify_instr') :
                activeProvider === 'ANGHAMI' ? t('anghami_instr') :
                    activeProvider === 'APPLE_MUSIC' ? t('apple_music_instr') : null
        ), [activeProvider]);

        function openSpotify() {
            Linking.openURL('https://open.spotify.com/');
        }

        function openAppleMusic() {
            Linking.openURL('https://music.apple.com/');
        }

        function openAnghami() {
            Linking.openURL('anghami://profile');
        }

        function openProvider() {
            if (activeProvider === 'SPOTIFY') {
                openSpotify();
            } else if (activeProvider === 'APPLE_MUSIC') {
                openAppleMusic();
            } else if (activeProvider === 'ANGHAMI') {
                openAnghami();
            }
        }

        function linkAccount() {
            linkMusic(providerLink);
            setMusicModalVisible(false);
        }

        function incrementStep() {
            setStep(s => s + 1);
        }

        function handleChangeActiveProvider(provider) {
            setActiveProvider(provider);
            setTimeout(() => {
                incrementStep();
            }, 300);
        }

        return (
            <BottomModalSheet snapPoints={['50%']} modalVisible={musicModalVisible} setModalVisible={setMusicModalVisible}>
                {
                    step === 1 &&
                    <Animated.View exiting={FadeOutLeft} style={[styles.fullCenter, styles.flexOne, styles.fullCenter, styles.p16]}>
                        <Text style={[styles.text, styles.font24, styles.bold, styles.dark, styles.textCenter]}>{t('choose_provider')}</Text>

                        <View style={[styles.flexCol, styles.gap10, styles.w100, styles.fullCenter, styles.mt20]}>
                            <RoundedButton activeColor={palette.dark} onPress={() => handleChangeActiveProvider('ANGHAMI')} active={activeProvider === 'ANGHAMI'} style={[styles.bgLighter, { minWidth: '66%' }]} icon={<Image source={require('../../assets/anghami_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} />}>
                                {t('anghami')}
                            </RoundedButton>

                            <RoundedButton activeColor={'#1fd961'} onPress={() => handleChangeActiveProvider('SPOTIFY')} active={activeProvider === 'SPOTIFY'} style={[styles.bgLighter, { minWidth: '66%' }]} icon={<Image source={require('../../assets/spotify_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} />}>
                                {t('spotify')}
                            </RoundedButton>

                            <RoundedButton activeColor={'#fa3951'} onPress={() => handleChangeActiveProvider('APPLE_MUSIC')} active={activeProvider === 'APPLE_MUSIC'} style={[styles.bgLighter, { minWidth: '66%' }]} icon={<Image source={require('../../assets/applemusic_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} />}>
                                {t('apple_music')}
                            </RoundedButton>
                        </View>
                    </Animated.View>
                }
                {
                    step === 2 &&
                    <Animated.View entering={FadeInRight.delay(300)} exiting={FadeOutLeft} style={[styles.fullCenter, styles.flexOne, styles.fullCenter, styles.p16]}>
                        <Text style={[styles.text, styles.font24, styles.bold, styles.dark, styles.textCenter]}>{t('connect_your')} {t(activeProvider.toLowerCase())}</Text>
                        <Text style={[styles.text, styles.textCenter]}>
                            {currentProviderDescription}
                        </Text>

                        <RoundedButton activeColor={'#1fd961'} onPress={openProvider} style={[styles.bgLighter, styles.mt10, { minWidth: '66%' }]} icon={currentProviderIcon}>
                            {t('open')} {t(activeProvider.toLowerCase())}
                        </RoundedButton>


                        <RoundedButton style={[styles.mt20]} activeColor={'#1fd961'} dark onPress={incrementStep} style={[styles.bgAccent, styles.mt20, { minWidth: '80%' }]}>
                            {t('next')}
                        </RoundedButton>
                    </Animated.View>
                }

                {
                    step === 3 &&
                    <Animated.View entering={FadeInRight.delay(300)} style={[styles.fullCenter, styles.flexOne, styles.fullCenter, styles.p16]}>
                        <Text style={[styles.text, styles.font24, styles.bold, styles.dark, styles.textCenter]}>{t(activeProvider.toLowerCase())} Profile Link</Text>

                        <CustomTextInput autoCapitalize={'none'} value={providerLink} onChangeText={setProviderLink} placeholder={"https://open.spotify.com/user/..."} />

                        <RoundedButton style={[styles.mt20]} activeColor={'#1fd961'} dark onPress={linkAccount} style={[styles.bgAccent, styles.mt20, { minWidth: '80%' }]}>
                            {t('link')}
                        </RoundedButton>
                    </Animated.View>
                }
            </BottomModalSheet>
        )
    }

    function FacebookModal() {
        const [providerLink, setProviderLink] = useState(socials?.facebookLink || '');

        function linkAccount() {
            linkFacebook(providerLink);
            setFacebookModalVisible(false);
        }

        return (
            <BottomModalSheet snapPoints={['50%']} modalVisible={facebookModalVisible} setModalVisible={setFacebookModalVisible}>
                <View style={[styles.fullCenter, styles.flexOne, styles.fullCenter, styles.p16]}>
                    <Text style={[styles.text, styles.font24, styles.bold, styles.dark, styles.textCenter]}>
                        {t('facebook_link')}
                    </Text>

                    <CustomTextInput autoCapitalize={'none'} value={providerLink} onChangeText={setProviderLink} placeholder={"https://facebook.com/..."} />

                    <RoundedButton style={[styles.mt20]} activeColor={'#1fd961'} dark onPress={linkAccount} style={[styles.bgAccent, styles.mt20, { minWidth: '80%' }]}>
                        {t('link')}
                    </RoundedButton>
                </View>
            </BottomModalSheet>
        )
    }

    function InstagramModal() {
        const [username, setUsername] = useState(socials?.instagramLink?.split('/')[3] || '');

        function linkAccount() {
            linkInstagram(`https://instagram.com/${username}`);
            setInstagramModalVisible(false);
        }

        return (
            <BottomModalSheet snapPoints={['50%']} modalVisible={instagramModalVisible} setModalVisible={setInstagramModalVisible}>
                <View style={[styles.fullCenter, styles.flexOne, styles.fullCenter, styles.p16]}>
                    <Text style={[styles.text, styles.font24, styles.bold, styles.dark, styles.textCenter]}>
                        {t('instagram_username')}
                    </Text>

                    <CustomTextInput prefix={'@'} autoCapitalize={'none'} value={username} onChangeText={setUsername} placeholder={"example"} />

                    <RoundedButton style={[styles.mt20]} activeColor={'#1fd961'} dark onPress={linkAccount} style={[styles.bgAccent, styles.mt20, { minWidth: '80%' }]}>
                        {t('link')}
                    </RoundedButton>
                </View>
            </BottomModalSheet>
        )
    }
    const insets = useSafeAreaInsets();

    function PreferencesModal() {
        const [musicPreference, setMusicPreference] = useState(userPreferences?.music || 0);
        const [smokingPreference, setSmokingPreference] = useState(userPreferences?.smoking || 0);
        const [chattinessPreference, setChattinessPreference] = useState(userPreferences?.chattiness || 0);
        const [restStopsPreference, setRestStopsPreference] = useState(userPreferences?.rest_stop || 0);

        async function handleUpdatePreferences() {
            await updatePreferences({
                music: musicPreference,
                smoking: smokingPreference,
                chattiness: chattinessPreference,
                rest_stop: restStopsPreference
            })
            setPreferencesModalVisible(false);
        }

        useEffect(() => {
            setMusicPreference(userPreferences?.music || 0);
            setSmokingPreference(userPreferences?.smoking || 0);
            setChattinessPreference(userPreferences?.chattiness || 0);
            setRestStopsPreference(userPreferences?.rest_stop || 0);
        }, [userPreferences]);

        return (
            <BottomModalSheet snapPoints={['70%', '90%']} modalVisible={preferencesModalVisible} setModalVisible={setPreferencesModalVisible}>
                <ScrollView style={[styles.flexOne]} contentContainerStyle={[styles.flexGrow, styles.ph16, { paddingBottom: insets.bottom }]}>
                    <Text style={[styles.text, styles.font24, styles.bold, styles.dark, styles.textCenter]}>{t('preferences')}</Text>

                    <View style={[styles.mt20, styles.w100, styles.gap20]}>
                        <View style={[styles.w100]}>
                            <Text style={[styles.text, styles.font18, styles.bold, styles.dark, styles.textCenter]}>{t('music')}</Text>
                            <View style={[styles.flexRow, styles.gap5]}>
                                <RoundedButton onPress={() => setMusicPreference(-1)} active={musicPreference === -1} textStyle={[styles.font12]} activeBgColor={palette.accent} icon={<MaterialIcons name="music-off" size={16} />} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('no_music')}
                                </RoundedButton>

                                <RoundedButton onPress={() => setMusicPreference(0)} active={musicPreference === 0} textStyle={[styles.font12]} activeBgColor={palette.accent} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('neutral')}
                                </RoundedButton>

                                <RoundedButton onPress={() => setMusicPreference(1)} active={musicPreference === 1} textStyle={[styles.font12]} activeBgColor={palette.accent} icon={<MaterialIcons name="music-note" size={16} />} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('preferred')}
                                </RoundedButton>
                            </View>
                        </View>

                        <View style={[styles.w100]}>
                            <Text style={[styles.text, styles.font18, styles.bold, styles.dark, styles.textCenter]}>{t('smoking')}</Text>
                            <View style={[styles.flexRow, styles.gap5]}>
                                <RoundedButton onPress={() => setSmokingPreference(-1)} active={smokingPreference === -1} textStyle={[styles.font12]} activeBgColor={palette.accent} icon={<MaterialIcons name="smoke-free" size={16} />} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('no_smoking')}
                                </RoundedButton>

                                <RoundedButton onPress={() => setSmokingPreference(0)} active={smokingPreference === 0} textStyle={[styles.font12]} activeBgColor={palette.accent} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('neutral')}
                                </RoundedButton>

                                <RoundedButton onPress={() => setSmokingPreference(1)} active={smokingPreference === 1} textStyle={[styles.font12]} activeBgColor={palette.accent} icon={<MaterialIcons name="smoking-rooms" size={16} />} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('preferred')}
                                </RoundedButton>
                            </View>
                        </View>

                        <View style={[styles.w100]}>
                            <Text style={[styles.text, styles.font18, styles.bold, styles.dark, styles.textCenter]}>{t('chattiness')}</Text>
                            <View style={[styles.flexRow, styles.gap5]}>
                                <RoundedButton onPress={() => setChattinessPreference(-1)} active={chattinessPreference === -1} textStyle={[styles.font12]} activeBgColor={palette.accent} icon={<MaterialIcons name="volume-off" size={16} />} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('silent_ride')}
                                </RoundedButton>

                                <RoundedButton onPress={() => setChattinessPreference(0)} active={chattinessPreference === 0} textStyle={[styles.font12]} activeBgColor={palette.accent} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('neutral')}
                                </RoundedButton>

                                <RoundedButton onPress={() => setChattinessPreference(1)} active={chattinessPreference === 1} textStyle={[styles.font12]} activeBgColor={palette.accent} icon={<MaterialIcons name="question-answer" size={16} />} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('preferred')}
                                </RoundedButton>
                            </View>
                        </View>

                        <View style={[styles.w100]}>
                            <Text style={[styles.text, styles.font18, styles.bold, styles.dark, styles.textCenter]}>{t('rest_stops')}</Text>
                            <View style={[styles.flexRow, styles.gap5]}>
                                <RoundedButton onPress={() => setRestStopsPreference(-1)} active={restStopsPreference === -1} textStyle={[styles.font12]} activeBgColor={palette.accent} icon={<MaterialIcons name="bolt" size={16} />} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('no_stops')}
                                </RoundedButton>

                                <RoundedButton onPress={() => setRestStopsPreference(0)} active={restStopsPreference === 0} textStyle={[styles.font12]} activeBgColor={palette.accent} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('neutral')}
                                </RoundedButton>

                                <RoundedButton onPress={() => setRestStopsPreference(1)} active={restStopsPreference === 1} textStyle={[styles.font12]} activeBgColor={palette.accent} icon={<MaterialIcons name="airline-stops" size={16} />} dark={false} style={[styles.bgLighter, styles.mt10, styles.flexOne]}>
                                    {t('preferred')}
                                </RoundedButton>
                            </View>
                        </View>

                        <Button style={[styles.mt20]} bgColor={palette.accent} textColor={palette.dark} onPress={handleUpdatePreferences} style={[styles.mt20, { minWidth: '80%' }]} text={t('update')} />
                    </View>

                </ScrollView>
            </BottomModalSheet>
        )
    }

    const imagePickerOptions = useMemo(() => ({ title: 'New Profile Picture', multiple: false, mediaType: 'photo', quality: 0.75, maxWidth: 500 * rem, maxHeight: 500 * rem, storageOptions: { skipBackup: true, path: 'images' } }), []);


    async function onClickUpload(e) {
        const response = await launchImageLibrary(imagePickerOptions);
        if (!response.didCancel && !response.error) {
            userUpdateProfilePicture(response);
        }
    };

    return (
        <>
            <ScreenWrapper screenName={t('account')}>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                    <View style={[styles.w100, styles.br24, styles.bgWhite, styles.p16, styles.shadow]}>
                        <View style={[styles.w100, styles.alignEnd]}>
                            <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={[styles.p16, styles.brFull, styles.bgLighter, styles.fullCenter]}>
                                <MaterialIcons name="settings" size={24} color={palette.dark} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.w100, styles.fullCenter, styles.gap5]}>
                            <TouchableOpacity onPress={onClickUpload} activeOpacity={0.8} style={[profileStyles.profilePictureView]}>
                                <FastImage source={{ uri: userProfilePicture }} style={profileStyles.profilePicture} />
                                <View style={[{ right: 0, bottom: 0, padding: 6 }, styles.fullCenter, styles.positionAbsolute, styles.bgLight, styles.brFull]}>
                                    <MaterialIcons name="photo-camera" color={palette.dark} size={16} />
                                </View>
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
                        <TouchableOpacity onPress={() => navigation.navigate('Chats List')} activeOpacity={0.9} style={[styles.flexOne, styles.flexRow, styles.fullCenter, styles.brFull, styles.mt5, styles.p16, styles.bgWhite, styles.shadow, styles.gap5]}>
                            <View style={{ height: 28 * rem, width: 28 * rem, alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialIcons name="chat-bubble" size={24} color={palette.dark} />
                            </View>
                            <Text style={[styles.text, styles.font16, styles.semiBold, styles.textCenter, { lineHeight: null }]}>
                                {t('messages')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.flexRow, styles.w100, styles.spaceBetween, styles.mt10]}>
                        <View style={[{ width: '32%' }, styles.br24, styles.bgWhite, styles.pv16, styles.ph24, styles.shadow, styles.fullCenter, styles.gap5]}>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.font28, styles.textCenter]} numberOfLines={1} adjustsFontSizeToFit>
                                {userStats.ridesTaken < 1000 ? userStats.ridesTaken : (userStats.ridesTaken / 1000).toFixed(1) + 'K'}
                            </Text>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, styles.dark, { opacity: 0.3 }, styles.font16, styles.textCenter]}>{t('trips')}</Text>
                        </View>

                        <View style={[{ width: '32%' }, styles.br24, styles.bgWhite, styles.pv16, styles.ph24, styles.shadow, styles.fullCenter, styles.gap5]}>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.font28, styles.textCenter]} numberOfLines={1} adjustsFontSizeToFit>
                                {userStats.ridesDriven < 1000 ? userStats.ridesDriven : (userStats.ridesDriven / 1000).toFixed(1) + 'K'}
                            </Text>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, styles.dark, { opacity: 0.3 }, styles.font16, styles.textCenter]}>{t('drives')}</Text>
                        </View>

                        <View style={[{ width: '32%' }, styles.br24, styles.bgWhite, styles.pv16, styles.ph24, styles.shadow, styles.fullCenter, styles.gap5]}>
                            <Text style={[styles.text, styles.bold, styles.dark, styles.font28, styles.textCenter]} numberOfLines={1} adjustsFontSizeToFit>
                                {new Date(userStats.createdAt).getFullYear()}
                            </Text>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, styles.dark, { opacity: 0.3 }, styles.font16, styles.textCenter]}>{t('created')}</Text>
                        </View>
                    </View>

                    <View style={[styles.flexRow, styles.gap10]}>
                        <View style={[styles.flexCol, styles.flexOne]}>
                            {
                                !socials?.facebookLink &&
                                <TouchableOpacity activeOpacity={0.9} onPress={handlePressFacebook} style={[styles.flexCol, styles.flexOne, styles.br24, styles.pv16, styles.ph16, styles.bgWhite, styles.shadow, styles.mt10, styles.fullCenter]}>
                                    <LottieView source={require('../../assets/facebook_animation.json')} loop={false} autoPlay style={{ width: '75%', aspectRatio: 1 }} />
                                    <Text style={[styles.text, styles.semiBold, styles.dark, styles.font16, styles.textCenter]}>{t('link_facebook')}</Text>
                                </TouchableOpacity>
                            }
                            {
                                socials?.facebookLink &&
                                <TouchableOpacity activeOpacity={0.9} onPress={handlePressFacebook} style={[styles.flexCol, styles.flexOne, styles.br24, styles.pv16, styles.ph16, styles.shadow, styles.mt10, styles.fullCenter, styles.gap15, { backgroundColor: '#0866ff' }]}>
                                    {/* <LottieView source={require('../../assets/facebook_animation.json')} loop={false} autoPlay style={{ width: '75%', aspectRatio: 1 }} /> */}
                                    <Image source={require('../../assets/facebook_logo_white.png')} style={{ width: 70, height: 70 }} />
                                    <Text style={[styles.text, styles.textCenter, styles.white, styles.bold]}>{t('fb_linked')}</Text>
                                </TouchableOpacity>

                            }


                            {
                                !socials?.instagramLink &&
                                <TouchableOpacity onPress={handlePressInstagram} activeOpacity={0.9} style={[styles.flexCol, styles.flexOne, styles.br24, styles.pv16, styles.ph8, styles.bgWhite, styles.shadow, styles.mt10, styles.fullCenter]}>
                                    <LottieView source={require('../../assets/instagram_animation.json')} loop autoPlay style={{ width: '75%', aspectRatio: 1 }} />
                                    <Text style={[styles.text, styles.semiBold, styles.dark, styles.font16, styles.textCenter]}>{t('link_instagram')}</Text>
                                </TouchableOpacity>
                            }

                            {
                                socials?.instagramLink &&
                                <TouchableOpacity onPress={handlePressInstagram} activeOpacity={0.9} style={[styles.flexCol, styles.flexOne, styles.br24, styles.pv16, styles.ph8, styles.shadow, styles.mt10, styles.fullCenter, styles.gap15, styles.overflowHidden, { backgroundColor: palette.dark }]}>
                                    <Image source={require('../../assets/instagram_logo_white.png')} style={{ zIndex: 20, width: 70, height: 70 }} />
                                    {/* <IGBackground style={[{zIndex: -1}]} /> */}
                                    <Text style={[styles.text, styles.textCenter, styles.white, styles.bold]}>{t('ig_linked')}</Text>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={[styles.flexCol, styles.flexOne]}>
                            <TouchableOpacity activeOpacity={0.9} onPress={() => setPreferencesModalVisible(true)} style={[styles.flexCol, styles.br24, styles.p24, styles.bgAccent, styles.shadow, styles.mt10]}>
                                {(!userPreferences || Object.values(userPreferences).filter((x) => x === 0).length === 4) &&
                                    <>
                                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.text, styles.bold, styles.white, styles.textStart, styles.font18]}>{t('set_your')}</Text>
                                        <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.text, styles.bold, styles.white, styles.textStart, styles.font18]}>{t('preferences')}</Text>
                                    </>
                                }
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

                            {
                                !socials?.musicLink &&
                                <TouchableOpacity activeOpacity={0.9} onPress={handlePressMusic} style={[styles.flexCol, styles.flexOne, styles.br24, styles.p16, styles.shadow, styles.mt10, styles.fullCenter, styles.bgWhite]}>
                                    <LottieView source={require('../../assets/casette.json')} loop autoPlay style={{ width: '75%', aspectRatio: 1 }} />
                                    <Text style={[styles.text, styles.semiBold, styles.dark, styles.font16, styles.textCenter]}>{t('connect_your')} {t('music_library')}</Text>

                                    <View style={[styles.flexRow, styles.gap5, styles.w100, styles.fullCenter, styles.mt10]}>
                                        <Image source={require('../../assets/anghami_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} />
                                        <Image source={require('../../assets/spotify_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} />
                                        <Image source={require('../../assets/applemusic_logo.png')} style={{ width: 30 * rem, height: 30 * rem }} />
                                    </View>
                                </TouchableOpacity>
                            }
                            {
                                socials?.musicLink &&
                                <TouchableOpacity activeOpacity={0.9} onPress={handlePressMusic} style={[styles.flexCol, styles.flexOne, styles.br24, styles.p16, styles.shadow, styles.mt10, styles.gap15, styles.fullCenter, { backgroundColor: linkedProvider === 'ANGHAMI' ? palette.black : linkedProvider === 'SPOTIFY' ? '#1ed760' : palette.dark }]}>
                                    {linkedProvider === 'SPOTIFY' &&
                                        <>
                                            <Image source={require('../../assets/spotify_logo_alt.png')} style={{ width: 120, height: 120 }} />
                                            <Text style={[styles.text, styles.textCenter, styles.white, styles.bold]}>{t('spotify_linked')}</Text>
                                        </>

                                    }
                                    {
                                        linkedProvider === 'ANGHAMI' &&
                                        <>
                                            <Image source={require('../../assets/anghami_logo_alt.png')} style={{ width: 120, height: 120 }} />
                                            <Text style={[styles.text, styles.textCenter, styles.white, styles.bold]}>{t('anghami_linked')}</Text>
                                        </>
                                    }
                                    {
                                        linkedProvider === 'APPLE_MUSIC' &&
                                        <>
                                            <Image source={require('../../assets/applemusic_logo.png')} style={{ width: 120, height: 120 }} />
                                            <Text style={[styles.text, styles.textCenter, styles.white, styles.bold]}>{t('apple_music_linked')}</Text>
                                        </>
                                    }
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    {/* 
                    <View style={[styles.flexRow, styles.gap10]}>


                        <View style={[styles.flexCol, styles.flexOne, styles.br24, styles.p16, styles.bgWhite, styles.shadow, styles.mt10, styles.fullCenter]}>
                            <LottieView source={require('../../assets/facebook_animation.json')} loop={true} autoPlay style={{ width: '75%', aspectRatio: 1 }} />
                            <Text style={[styles.text, styles.semiBold, styles.dark, styles.textCenter, styles.mt5]}>Link Your Facebook Account</Text>
                        </View>
                    </View> */}

                    <MusicModal />
                    <FacebookModal />
                    <InstagramModal />
                    <PreferencesModal />

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
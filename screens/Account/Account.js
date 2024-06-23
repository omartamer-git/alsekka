import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    I18nManager,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import AccountSectionItems from '../../components/AccountSectionItems';
import AccountSections from '../../components/AccountSections';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import ErrorMessage from '../../components/ErrorMessage';
import useAppManager from '../../context/appManager';
import useAuthManager from '../../context/authManager';
import useAxiosManager from '../../context/axiosManager';
import { containerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import BottomModalSheet from '../../components/ModalSheet';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

function Account({ route, navigation }) {
    const { t } = useTranslation();
    const [ratings, setRatings] = useState(null);
    const [editNameModalVisible, setEditNameModalVisible] = useState(false);
    const [editPhoneModalVisible, setEditPhoneModalVisible] = useState(false);
    const [editEmailModalVisible, setEditEmailModalVisible] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
    const [editProfile, setEditProfile] = useState(false);

    // const userStore = useUserStore();
    const userId = useUserStore((state) => state.id);
    const userPhone = useUserStore((state) => state.phone);
    const userReset = useUserStore((state) => state.reset);
    const userRating = useUserStore((state) => state.rating);
    const userEditName = useUserStore((state) => state.editName);
    const userEditEmail = useUserStore((state) => state.editEmail);
    const userEditPhone = useUserStore((state) => state.editPhone);
    const userDeleteAccount = useUserStore((state) => state.deleteAccount);
    const userUpdateProfilePicture = useUserStore((state) => state.uploadProfilePicture);
    const userProfilePicture = useUserStore((state) => state.profilePicture);
    const userFirstName = useUserStore((state) => state.firstName);
    const userLastName = useUserStore((state) => state.lastName);
    const userUnreadMessages = useUserStore((state) => state.unreadMessages);
    const userDriver = useUserStore((state) => state.driver)
    const userEmail = useUserStore((state) => state.email);
    const { dismiss, dismissAll } = useBottomSheetModal();


    const [editPhoneText, setEditPhoneText] = useState(userPhone);
    const [emailError, setEmailError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);
    const authManager = useAuthManager();
    const { referralsDisabled } = useAppManager();
    const { authAxios } = useAxiosManager();
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const logout = function () {
        authManager.logout();
        userReset();
    };

    useEffect(function () {
        const fullStars = Math.floor(userRating);
        const halfStars = Math.ceil(userRating) - Math.abs(userRating);

        let ratingsItems = [];
        for (let i = 0; i < fullStars; i++) {
            ratingsItems.push(<MaterialIcons key={"fullStar" + i} size={17} name="star" color={palette.accent} />);
        }

        for (let j = 0; j < halfStars; j++) {
            ratingsItems.push(<MaterialIcons key={"halfStar" + j} size={17} name="star-half" color={palette.accent} />);
        }

        setRatings(ratingsItems);
    }, []);

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events    

    const editNameSchema = Yup.object().shape({
        firstNameInput: Yup.string().min(2, t('error_name_short')).max(20, t('error_name_long')).required(t('error_required')),
        lastNameInput: Yup.string().min(2, t('error_name_short')).max(20, t('error_name_long')).required(t('error_required'))
    });

    const editEmailSchema = Yup.object().shape({
        emailInput: Yup.string().email(t('error_invalid_email')).required(t('error_required')),
    });

    const editPhoneSchema = Yup.object().shape({
        phoneInput: Yup.string().matches(
            /^1[0-2,5]{1}[0-9]{8}$/,
            t('error_invalid_phone')
        ).required(t('error_required'))
    });

    function saveEditName(firstNameInput, lastNameInput) {
        userEditName(firstNameInput, lastNameInput).then(function () {
            setEditNameModalVisible(false);
        }).catch(err => {
            console.log(err);
        })
    };

    function saveEditEmail(emailInput) {
        userEditEmail(emailInput).then(data => {
            setEditEmailModalVisible(false);
        }).catch(err => {
            setEmailError(err.response.data.error.message);
        });
    };

    function saveEditPhone(phoneInput) {
        userEditPhone(phoneInput).then(function () {
            setEditPhoneModalVisible(false);
        }).catch(err => {
            setPhoneError(err.response.data.error.message);
        });
    };

    function confirmDelete() {
        userDeleteAccount(deletePassword).then(function () {
            setDeleteAccountModalVisible(false);
            setDeleteConfirmationVisible(true);
        }).catch(err => {
            console.log(err);
            setDeleteError(t('error_incorrect_password'))
        })
    }

    function hideDeleteConfirmation() {
        dismissAll();
        setDeleteConfirmationVisible(false);
        logout();
    }


    const imagePickerOptions = { title: 'New Profile Picture', multiple: false, mediaType: 'photo', quality: 0.75, maxWidth: 500 * rem, maxHeight: 500 * rem, storageOptions: { skipBackup: true, path: 'images' } };


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
                    <View style={[accountStyles.topSection, styles.w100]}>
                        <TouchableOpacity activeOpacity={0.8} onPress={onClickUpload} style={accountStyles.profilePictureView}>
                            {userProfilePicture && <FastImage source={{ uri: userProfilePicture }} style={accountStyles.profilePicture} />}

                            <View style={[accountStyles.profilePictureOverlay]}>
                                <MaterialIcons name="photo-camera" size={50} style={accountStyles.cameraOverlay} color={palette.light} />
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.flexOne, styles.fullCenter]}>
                            <Text style={[styles.text, styles.headerText2, styles.capitalize]}>{userFirstName} {userLastName}</Text>
                            <View style={[styles.flexRow, styles.mt5]}>
                                {ratings}
                            </View>
                        </View>
                    </View>

                    <View style={styles.breakline} />

                    <View style={[styles.w100]}>
                        <AccountSections title='account'>
                            <AccountSectionItems icon='settings' text='profile_settings' onPress={() => setEditProfile(true)} />
                            <AccountSectionItems icon='groups' text='ride_preferences' onPress={() => navigation.navigate('User Preferences', { userId })} />
                            <AccountSectionItems icon='directions-car' text='manage_cars' onPress={() => navigation.navigate('Manage Cars')} />
                            <AccountSectionItems icon='route' text='my_trips' onPress={() => navigation.navigate('All Trips')} />
                            <AccountSectionItems icon='lock' text='terms_&_privacy_policy' onPress={() => setTermsModalVisible(true)} />
                        </AccountSections>

                        <AccountSections title='communication'>
                            <AccountSectionItems icon='chat-bubble' text='messages' onPress={() => navigation.navigate('Chats List')} />
                            {!referralsDisabled && <AccountSectionItems icon={I18nManager.isRTL ? 'person-add' : 'person-add-alt-1'} text='refer_friend' onPress={() => navigation.navigate('Referral')} />}
                            <AccountSectionItems icon='help' text='need_help' onPress={() => Linking.openURL("https://wa.me/201028182577")} />
                        </AccountSections>

                        <AccountSections title='financial'>
                            <AccountSectionItems icon='wallet' text='wallet' onPress={() => navigation.navigate('Wallet')} />
                            {!referralsDisabled && <AccountSectionItems icon='redeem' text="add_referral" onPress={() => navigation.navigate('Add Referral')} />}
                        </AccountSections>
                    </View>

                    <Button bgColor={palette.accent} textColor={palette.white} text={t('log_out')} onPress={logout} />
                    <Button bgColor={palette.red} textColor={palette.white} text={`${t('delete_account')}`} onPress={function () { setDeleteAccountModalVisible(true) }} />
                </ScrollView>
            </ScreenWrapper>


            <BottomModal onHide={() => setEditProfile(false)} modalVisible={editProfile}>
                <CustomTextInput
                    value={userFirstName + " " + userLastName}
                    iconLeft="badge"
                    iconRight="edit"
                    editable={false}
                    style={accountStyles.editInput}
                    onPressIn={() => !userDriver ? setEditNameModalVisible(true) : ""}
                    role="button"
                    disabled={userDriver}
                />
                <CustomTextInput
                    value={userEmail}
                    iconLeft="mail"
                    iconRight="edit"
                    editable={false}
                    style={accountStyles.editInput}
                    onPressIn={() => setEditEmailModalVisible(true)}
                    role="button"
                />
            </BottomModal>
            <BottomModalSheet snapPoints={['50%']} bgColor={palette.lightGray} setModalVisible={setEditNameModalVisible} modalVisible={editNameModalVisible}>
                <View style={[styles.w100, styles.p24]}>
                    <Formik
                        initialValues={{ firstNameInput: userFirstName, lastNameInput: userLastName }}
                        validationSchema={editNameSchema}
                        onSubmit={(values) => { saveEditName(values.firstNameInput, values.lastNameInput) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                            <View style={[styles.w100, styles.alignStart]}>
                                <Text style={[styles.text, styles.inputText]}>{t('first_name')}</Text>
                                <CustomTextInput
                                    value={values.firstNameInput}
                                    iconLeft="badge"
                                    style={accountStyles.editInput}
                                    onChangeText={handleChange('firstNameInput')}
                                    onBlur={handleBlur('firstNameInput')}
                                    error={touched.firstNameInput && errors.firstNameInput}
                                />

                                <Text style={[styles.text, styles.inputText]}>{t('last_name')}</Text>
                                <CustomTextInput
                                    value={values.lastNameInput}
                                    iconLeft="badge"
                                    style={accountStyles.editInput}
                                    onChangeText={handleChange('lastNameInput')}
                                    onBlur={handleBlur('lastNameInput')}
                                    error={touched.lastNameInput && errors.lastNameInput}
                                />

                                <Button text={t("save")} textColor={palette.white} bgColor={palette.primary} onPress={handleSubmit} disabled={!isValid} />
                            </View>
                        )}
                    </Formik>
                </View>
            </BottomModalSheet>

            <BottomModalSheet snapPoints={['50%']} setModalVisible={setEditEmailModalVisible} modalVisible={editEmailModalVisible}>
                <View style={[styles.w100, styles.ph24]}>
                    <ErrorMessage message={emailError} condition={emailError} />
                    <Formik
                        initialValues={{ emailInput: userEmail }}
                        validationSchema={editEmailSchema}
                        onSubmit={(values) => { saveEditEmail(values.emailInput) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                            <View style={[styles.w100, styles.alignStart]}>
                                <Text style={[styles.text, styles.inputText]}>{t('email')}</Text>
                                <CustomTextInput
                                    value={values.emailInput}
                                    iconLeft="badge"
                                    style={accountStyles.editInput}
                                    onChangeText={handleChange('emailInput')}
                                    onBlur={handleBlur('emailInput')}
                                    error={touched.emailInput && errors.emailInput}
                                />

                                <Button text={t('save')} textColor={palette.white} bgColor={palette.primary} onPress={handleSubmit} disabled={!isValid} />
                            </View>
                        )}
                    </Formik>
                </View>
            </BottomModalSheet>

            <BottomModalSheet snapPoints={['25%']} setModalVisible={setTermsModalVisible} modalVisible={termsModalVisible}>
                <View style={[styles.w100, styles.mt10, styles.ph24]}>
                    <Button bgColor={palette.accent} textColor={palette.white} text={t('terms')} onPress={function () { Linking.openURL('https://seaats.app/terms.html') }} />
                    <Button bgColor={palette.accent} textColor={palette.white} text={t('privacy_policy')} onPress={function () { Linking.openURL('https://seaats.app/privacy.html') }} />
                </View>
            </BottomModalSheet>

            <BottomModalSheet bgColor={palette.lightGray} snapPoints={['40%']} setModalVisible={setDeleteAccountModalVisible} modalVisible={deleteAccountModalVisible}>
                <View style={[styles.w100, styles.mt10, styles.justifyCenter, styles.alignCenter, styles.ph24]}>
                    <Text style={[styles.text, styles.font18, styles.bold, styles.textCenter, styles.dark]}>{t('sure_delete')}</Text>
                    <Text style={[styles.text, styles.inputText, styles.dark]}>{t('enter_password')}</Text>
                    <CustomTextInput
                        value={deletePassword}
                        onChangeText={setDeletePassword}
                        placeholder={t('enter_password')}
                        secureTextEntry={true}
                        error={deleteError}
                    />

                    <Button text={t('confirm')} bgColor={palette.light} textColor={palette.dark} onPress={confirmDelete} />
                    <Button text={t('cancel')} bgColor={palette.accent} textColor={palette.white} onPress={() => setDeleteAccountModalVisible(false)} />
                </View>
            </BottomModalSheet>

            <BottomModalSheet snapPoints={['30%']} setModalVisible={setDeleteConfirmationVisible} modalVisible={deleteConfirmationVisible}>
                <View style={[styles.w100, styles.mt10, styles.justifyCenter, styles.alignCenter, styles.ph24]}>

                    <Text style={[styles.text, styles.font14, styles.textCenter, styles.mt5, styles.dark]}>
                        {t('deletion_confirmation')}
                    </Text>
                    <Text style={[styles.text, styles.font14, styles.textCenter, styles.mt5, styles.dark]}>
                        {t('deletion_confirmation_thanks')}
                    </Text>

                    <Button text={t('ok')} onPress={hideDeleteConfirmation} bgColor={palette.primary} textColor={palette.white} />
                </View>
            </BottomModalSheet>
        </>
    );
}

const profilePictureSizing = {
    height: 90 * rem,
    width: 90 * rem,
    borderRadius: (90 * rem) / 2,
};

const accountStyles = StyleSheet.create({
    acctButtonsView: {
        ...styles.flexRow,
        ...styles.w100,
        height: 100 * rem,
        ...styles.pv24,
        ...styles.fullCenter,
    },
    topSection: {
        ...styles.mt10,
        ...styles.flexOne,
        ...styles.flexCol,
        ...styles.fullCenter
    },
    mainButton: {
        ...styles.flexOne,
        ...styles.mh5,
        paddingStart: 15 * rem,
        paddingEnd: 0,
    },
    acctButtons: {
        ...styles.bgPrimary,
        height: 80 * rem,
        ...styles.flexOne,
        ...styles.mh5,
        borderRadius: 8 * rem,
        ...styles.fullCenter,
        position: 'relative'
    },

    acctButtonsText: {
        ...styles.white,
        ...styles.bold,
        ...styles.mt5,
    },

    profilePictureView: {
        width: 100 * rem,
        height: 100 * rem,
        borderRadius: 100 * rem / 2,
        ...styles.borderPrimary,
        ...styles.fullCenter,
        borderWidth: 3 * rem,
    },

    profilePicture: {
        borderWidth: 2 * rem,
        ...profilePictureSizing,
        ...styles.borderWhite,
    },

    profilePictureOverlay: {
        ...styles.positionAbsolute,
        ...profilePictureSizing,
        ...styles.fullCenter,
        backgroundColor: 'rgba(125,125,125,0.5)'
    },

    cameraOverlay: {
        borderRadius: 50 * rem,
        ...styles.positionAbsolute,
    },
});

export default memo(Account);
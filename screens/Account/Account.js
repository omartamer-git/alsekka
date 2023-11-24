import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import ErrorMessage from '../../components/ErrorMessage';
import { containerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import useAuthManager from '../../context/authManager';
import { launchImageLibrary } from 'react-native-image-picker';
import useAxiosManager from '../../context/axiosManager';
import { useTranslation } from 'react-i18next';
import useAppManager from '../../context/appManager';

const Account = ({ route, navigation }) => {
    const { t } = useTranslation();
    const [ratings, setRatings] = useState(null);
    const [editNameModalVisible, setEditNameModalVisible] = useState(false);
    const [editPhoneModalVisible, setEditPhoneModalVisible] = useState(false);
    const [editEmailModalVisible, setEditEmailModalVisible] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

    const userStore = useUserStore();

    const [editPhoneText, setEditPhoneText] = useState(userStore.phone);
    const [emailError, setEmailError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);
    const authManager = useAuthManager();
    const { referralsDisabled } = useAppManager();
    const { authAxios } = useAxiosManager();
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
    const logout = () => {
        authManager.logout();
        userStore.reset();
    };

    useEffect(() => {
        const fullStars = Math.floor(userStore.rating);
        const halfStars = Math.ceil(userStore.rating) - Math.abs(userStore.rating);

        let ratingsItems = [];
        for (let i = 0; i < fullStars; i++) {
            ratingsItems.push(<MaterialIcons key={"fullStar" + i} name="star" color={palette.secondary} />);
        }

        for (let j = 0; j < halfStars; j++) {
            ratingsItems.push(<MaterialIcons key={"halfStar" + j} name="star-half" color={palette.secondary} />);
        }

        setRatings(ratingsItems);
        console.log(userStore);
    }, []);

    if (Platform.OS === 'ios') {
        const onFocusEffect = useCallback(() => {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return () => {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }, []);

        useFocusEffect(onFocusEffect); // register callback to focus events    
    }

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

    const saveEditName = (firstNameInput, lastNameInput) => {
        userStore.editName(firstNameInput, lastNameInput).then(() => {
            setEditNameModalVisible(false);
        }).catch(err => {
            console.log(err);
            // name error??
        })
    };

    const saveEditEmail = (emailInput) => {
        userStore.editEmail(emailInput).then(data => {
            setEditEmailModalVisible(false);
        }).catch(err => {
            setEmailError(err.response.data.error.message);
        });
    };
    const saveEditPhone = (phoneInput) => {
        userStore.editPhone(phoneInput).then(() => {
            setEditPhoneModalVisible(false);
        }).catch(err => {
            setPhoneError(err.response.data.error.message);
        });
    };

    const confirmDelete = () => {
        userStore.deleteAccount(deletePassword).then(() => {
            setDeleteAccountModalVisible(false);
            setDeleteConfirmationVisible(true);
        }).catch(err => {
            console.log(err);
            setDeleteError("Incorrect password, please try again")
        })
    }

    const hideDeleteConfirmation = () => {
        setDeleteConfirmationVisible(false);
        logout();
    }


    const imagePickerOptions = { title: 'New Profile Picture', multiple: false, mediaType: 'photo', quality: 0.75, maxWidth: 500 * rem, maxHeight: 500 * rem, storageOptions: { skipBackup: true, path: 'images' } };


    const onClickUpload = async (e) => {
        const response = await launchImageLibrary(imagePickerOptions);
        if (!response.didCancel && !response.error) {
            userStore.uploadProfilePicture(response);
        }
    };


    return (
        <>
            <ScreenWrapper screenName={t('account')}>
                <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle, styles.alignCenter]}>
                    <View style={[styles.mt10, styles.fullCenter]}>
                        <TouchableOpacity activeOpacity={0.8} onPress={onClickUpload} style={accountStyles.profilePictureView}>
                            {userStore.profilePicture && <Image source={{ uri: userStore.profilePicture }} style={accountStyles.profilePicture} />}

                            <View style={accountStyles.profilePictureOverlay}>
                                <MaterialIcons name="photo-camera" size={50} style={accountStyles.cameraOverlay} color={palette.light} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.mt10, styles.fullCenter, styles.w100]}>
                        <Text style={styles.headerText2}>{userStore.firstName} {userStore.lastName}</Text>
                        <View style={[styles.flexRow, styles.w100, styles.fullCenter]}>
                            {ratings}
                        </View>
                        <View style={accountStyles.acctButtonsView}>
                            <TouchableOpacity activeOpacity={0.9} style={accountStyles.acctButtons} onPress={() => { navigation.navigate('Chats List') }}>
                                <MaterialIcons name="message" size={40} color={palette.white} />
                                <Text style={accountStyles.acctButtonsText}>{t('messages')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.9} style={accountStyles.acctButtons} onPress={() => { navigation.navigate('Wallet') }}>
                                <MaterialIcons name="account-balance-wallet" size={40} color={palette.white} />
                                <Text style={accountStyles.acctButtonsText}>{t('wallet')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.9} style={accountStyles.acctButtons} onPress={() => { navigation.navigate('All Trips') }}>
                                <MaterialIcons name="history" size={40} color={palette.white} />
                                <Text style={accountStyles.acctButtonsText}>{t('trips')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '100%' }}>
                            <Button text={t('manage_cars')} textColor={palette.white} bgColor={palette.primary} onPress={() => { navigation.navigate('Manage Cars') }} />
                            <CustomTextInput
                                value={userStore.firstName + " " + userStore.lastName}
                                iconLeft="badge"
                                iconRight="edit"
                                editable={false}
                                style={accountStyles.editInput}
                                onPressIn={() => setEditNameModalVisible(true)}
                                role="button"
                            />
                            <CustomTextInput
                                value={userStore.email}
                                iconLeft="mail"
                                iconRight="edit"
                                editable={false}
                                style={accountStyles.editInput}
                                onPressIn={() => setEditEmailModalVisible(true)}
                                role="button"
                            />
                        </View>
                    </View>

                    <View style={[styles.w100]}>

                        {!referralsDisabled &&
                            <>
                                <Button bgColor={palette.accent} textColor={palette.white} text={t('refer_friend')} onPress={() => { navigation.navigate('Referral') }} />
                                <Button bgColor={palette.primary} textColor={palette.white} text={t('add_referral')} onPress={() => { navigation.navigate('Add Referral') }} />
                            </>
                        }
                        <Button bgColor={palette.primary} textColor={palette.white} text={t('log_out')} onPress={logout} />
                        <Button bgColor={palette.accent} textColor={palette.white} text={`${t('terms')} & ${t('privacy_policy')}`} onPress={() => { setTermsModalVisible(true) }} />
                        <Button bgColor={palette.accent} textColor={palette.white} text={`${t('delete_account')}`} onPress={() => { setDeleteAccountModalVisible(true) }} />
                    </View>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setEditNameModalVisible(false)} modalVisible={editNameModalVisible}>
                <View style={[styles.w100]}>
                    <Formik
                        initialValues={{ firstNameInput: userStore.firstName, lastNameInput: userStore.lastName }}
                        validationSchema={editNameSchema}
                        onSubmit={(values) => { saveEditName(values.firstNameInput, values.lastNameInput) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                            <View style={[styles.w100, styles.alignStart]}>
                                <Text style={styles.inputText}>{t('first_name')}</Text>
                                <CustomTextInput
                                    value={values.firstNameInput}
                                    iconLeft="badge"
                                    style={accountStyles.editInput}
                                    onChangeText={handleChange('firstNameInput')}
                                    onBlur={handleBlur('firstNameInput')}
                                    error={touched.firstNameInput && errors.firstNameInput}
                                />

                                <Text style={styles.inputText}>{t('last_name')}</Text>
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
            </BottomModal>

            <BottomModal onHide={() => setEditEmailModalVisible(false)} modalVisible={editEmailModalVisible}>
                <View style={[styles.w100]}>
                    <ErrorMessage message={emailError} condition={emailError} />
                    <Formik
                        initialValues={{ emailInput: userStore.email }}
                        validationSchema={editEmailSchema}
                        onSubmit={(values) => { saveEditEmail(values.emailInput) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                            <View style={[styles.w100, styles.alignStart]}>
                                <Text style={styles.inputText}>{t('email')}</Text>
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
            </BottomModal>

            <BottomModal onHide={() => setTermsModalVisible(false)} modalVisible={termsModalVisible}>
                <View style={[styles.w100, styles.mt10]}>
                    <Button bgColor={palette.accent} textColor={palette.white} text={t('terms')} onPress={() => { Linking.openURL('https://seaats.app/terms.pdf') }} />
                    <Button bgColor={palette.accent} textColor={palette.white} text={t('privacy_policy')} onPress={() => { Linking.openURL('https://seaats.app/policy.pdf') }} />
                </View>
            </BottomModal>

            <BottomModal onHide={() => setDeleteAccountModalVisible(false)} modalVisible={deleteAccountModalVisible}>
                <View style={[styles.w100, styles.mt10, styles.justifyCenter, styles.alignCenter]}>
                    <Text style={[styles.font18, styles.bold, styles.textCenter]}>Are you sure you want to delete your account?</Text>
                    {/* <Text style={[styles.font12, styles.textCenter, styles.mt5]}>
                        Your account will now be marked for deletion. This means that your data will be completely wiped off the system in 14 days. If you change your mind during this time, simply log back in and we will cancel the deletion process.
                        Thank you for using Seaats.
                    </Text> */}
                    <Text style={styles.inputText}>Please Enter Your Password</Text>
                    <CustomTextInput
                        value={deletePassword}
                        onChangeText={setDeletePassword}
                        placeholder={t('enter_password')}
                        secureTextEntry={true}
                        error={deleteError}
                    />

                    <Button text="Confirm" bgColor={palette.accent} textColor={palette.white} onPress={confirmDelete} />
                    <Button text={t('cancel')} bgColor={palette.red} textColor={palette.white} onPress={() => setDeleteAccountModalVisible(false)} />
                </View>
            </BottomModal>

            <BottomModal onHide={hideDeleteConfirmation} modalVisible={deleteConfirmationVisible}>
                <View style={[styles.w100, styles.mt10, styles.justifyCenter, styles.alignCenter]}>

                    <Text style={[styles.font14, styles.textCenter, styles.mt5]}>
                        Your account will now be marked for deletion. This means that your data will be completely wiped off the system in 14 days. If you change your mind during this time, simply log back in and we will cancel the deletion process.
                    </Text>
                    <Text style={[styles.font14, styles.textCenter, styles.mt5]}>
                        Thank you for using Seaats.
                    </Text>

                    <Button text="OK" onPress={hideDeleteConfirmation} bgColor={palette.primary} textColor={palette.white} />
                </View>
            </BottomModal>
        </>
    );
}

const profilePictureSizing = {
    height: 100 * rem,
    width: 100 * rem,
    borderRadius: (100 * rem) / 2,
};

const accountStyles = StyleSheet.create({
    acctButtonsView: {
        ...styles.flexRow,
        ...styles.w100,
        height: 100 * rem,
        ...styles.pv24,
        ...styles.fullCenter,
    },

    acctButtons: {
        ...styles.bgPrimary,
        height: 80 * rem,
        ...styles.flexOne,
        ...styles.mh5,
        borderRadius: 4 * rem,
        ...styles.fullCenter,
    },

    acctButtonsText: {
        ...styles.white,
        ...styles.bold,
        ...styles.mt5,
    },

    profilePictureView: {
        width: 110 * rem,
        height: 110 * rem,
        borderRadius: 110 * rem / 2,
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

    editInput: {
        ...styles.bgWhite,
    }
});

export default Account;
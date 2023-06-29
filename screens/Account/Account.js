import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle, rem } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import * as globalVars from '../../globalVars';
import DatePicker from 'react-native-date-picker';
import ScreenWrapper from '../ScreenWrapper';
import BottomModal from '../../components/BottomModal';
import { editEmail, editName, editPhone } from '../../api/accountAPI';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../../components/ErrorMessage';

const Account = ({ route, navigation }) => {
    const [ratings, setRatings] = useState(null);
    const [editNameModalVisible, setEditNameModalVisible] = useState(false);
    const [editPhoneModalVisible, setEditPhoneModalVisible] = useState(false);
    const [editEmailModalVisible, setEditEmailModalVisible] = useState(false);

    const [editPhoneText, setEditPhoneText] = useState(globalVars.getPhone());
    const [emailError, setEmailError] = useState(null);
    const [phoneError, setPhoneError] = useState(null);

    const logout = () => {
        globalVars.reset();
        navigation.replace("Guest");
    };

    useEffect(() => {
        const fullStars = Math.floor(globalVars.getRating());
        const halfStars = Math.ceil(globalVars.getRating()) - Math.abs(globalVars.getRating());

        let ratingsItems = [];
        for (let i = 0; i < fullStars; i++) {
            ratingsItems.push(<MaterialIcons key={"fullStar" + i} name="star" color={palette.secondary} />);
        }

        for (let j = 0; j < halfStars; j++) {
            ratingsItems.push(<MaterialIcons key={"halfStar" + j} name="star-half" color={palette.secondary} />);
        }

        setRatings(ratingsItems);
    }, []);

    const editNameSchema = Yup.object().shape({
        firstNameInput: Yup.string().min(2, 'First name is too short').max(20, 'First name is too long').required('This field is required'),
        lastNameInput: Yup.string().min(2, 'Last name is too short').max(20, 'Last name is too long').required('This field is required')
    });
    const editEmailSchema = Yup.object().shape({
        emailInput: Yup.string().email('Please enter a valid email address').required('This field is required'),
    });
    const editPhoneSchema = Yup.object().shape({
        phoneInput: Yup.string().matches(
            /^01[0-2,5]{1}[0-9]{8}$/,
            'Please enter a valid phone number in international format'
        ).required('This field is required')
    });

    const saveEditName = (firstNameInput, lastNameInput) => {
        editName(firstNameInput, lastNameInput).then(data => {
            if (data.success == "1") {
                globalVars.setFirstName(firstNameInput);
                globalVars.setLastName(lastNameInput);
            }
        });

        setEditNameModalVisible(false);
    };
    const saveEditEmail = (emailInput) => {
        editEmail(emailInput).then(data => {
            if (data.success == "1") {
                globalVars.setEmail(emailInput);
            }
            setEditEmailModalVisible(false);
        }).catch(err => {
            setEmailError(err.response.data.error.message);
        });
    };
    const saveEditPhone = (phoneInput) => {
        editPhone(phoneInput).then(data => {
            if (data.success == "1") {
                globalVars.setPhone(editPhoneText);
            }
            setEditPhoneModalVisible(false);
        }).catch(err => {
            setPhoneError(err.response.data.error.message);
        });
    };

    return (
        <>
            <ScreenWrapper screenName="Account" navigation={navigation}>
                <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle, styles.alignCenter]}>
                    <View style={[styles.mt10, styles.fullCenter]}>
                        <View style={accountStyles.profilePictureView}>
                            {globalVars.getProfilePicture() && <Image source={{ uri: globalVars.getProfilePicture() }} style={accountStyles.profilePicture} />}

                            <View style={accountStyles.profilePictureOverlay}>
                                <MaterialIcons name="photo-camera" size={50} style={accountStyles.cameraOverlay} color={palette.light} />
                            </View>
                        </View>
                    </View>

                    <View style={[styles.mt10, styles.fullCenter, styles.w100]}>
                        <Text style={styles.headerText2}>{globalVars.getFirstName()} {globalVars.getLastName()}</Text>
                        <View style={[styles.flexRow, styles.w100, styles.fullCenter]}>
                            {ratings}
                        </View>
                        <View style={accountStyles.acctButtonsView}>
                            <TouchableOpacity style={accountStyles.acctButtons} onPress={() => { navigation.navigate('Chats List') }}>
                                <MaterialIcons name="message" size={40} color={palette.white} />
                                <Text style={accountStyles.acctButtonsText}>Messages</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={accountStyles.acctButtons} onPress={() => { navigation.navigate('Wallet') }}>
                                <MaterialIcons name="account-balance-wallet" size={40} color={palette.white} />
                                <Text style={accountStyles.acctButtonsText}>Wallet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={accountStyles.acctButtons} onPress={() => { navigation.navigate('All Trips') }}>
                                <MaterialIcons name="history" size={40} color={palette.white} />
                                <Text style={accountStyles.acctButtonsText}>Trips</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '100%' }}>
                            <Button text="Manage My Cars" textColor={palette.white} bgColor={palette.primary} onPress={() => { navigation.navigate('Manage Cars') }} />
                            <CustomTextInput
                                value={globalVars.getFirstName() + " " + globalVars.getLastName()}
                                iconLeft="badge"
                                iconRight="edit"
                                editable={false}
                                style={accountStyles.editInput}
                                onPressIn={() => setEditNameModalVisible(true)}
                            />
                            <CustomTextInput
                                value={globalVars.getPhone()}
                                iconLeft="phone"
                                iconRight="edit"
                                editable={false}
                                style={accountStyles.editInput}
                                onPressIn={() => setEditPhoneModalVisible(true)}
                            />
                            <CustomTextInput
                                value={globalVars.getEmail()}
                                iconLeft="mail"
                                iconRight="edit"
                                editable={false}
                                style={accountStyles.editInput}
                                onPressIn={() => setEditEmailModalVisible(true)}
                            />
                        </View>
                    </View>

                    <View style={[styles.w100]}>
                        <Button bgColor={palette.primary} textColor={palette.white} text="Log Out" onPress={logout} />
                    </View>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setEditNameModalVisible(false)} modalVisible={editNameModalVisible}>
                <View style={[styles.w100]}>
                    <Formik
                        initialValues={{ firstNameInput: globalVars.getFirstName(), lastNameInput: globalVars.getLastName() }}
                        validationSchema={editNameSchema}
                        onSubmit={(values) => { saveEditName(values.firstNameInput, values.lastNameInput) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                            <>
                                <Text style={styles.inputText}>First Name</Text>
                                <CustomTextInput
                                    value={values.firstNameInput}
                                    iconLeft="badge"
                                    style={accountStyles.editInput}
                                    onChangeText={handleChange('firstNameInput')}
                                    onBlur={handleBlur('firstNameInput')}
                                    error={touched.firstNameInput && errors.firstNameInput}
                                />

                                <Text style={styles.inputText}>Last Name</Text>
                                <CustomTextInput
                                    value={values.lastNameInput}
                                    iconLeft="badge"
                                    style={accountStyles.editInput}
                                    onChangeText={handleChange('lastNameInput')}
                                    onBlur={handleBlur('lastNameInput')}
                                    error={touched.lastNameInput && errors.lastNameInput}
                                />

                                <Button text="Save" textColor={palette.white} bgColor={palette.primary} onPress={handleSubmit} disabled={!isValid} />
                            </>
                        )}
                    </Formik>
                </View>
            </BottomModal>

            <BottomModal onHide={() => setEditEmailModalVisible(false)} modalVisible={editEmailModalVisible}>
                <View style={[styles.w100]}>
                    <ErrorMessage message={emailError} condition={emailError} />
                    <Formik
                        initialValues={{ emailInput: globalVars.getEmail() }}
                        validationSchema={editEmailSchema}
                        onSubmit={(values) => { saveEditEmail(values.emailInput) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                            <>
                                <Text style={styles.inputText}>Email</Text>
                                <CustomTextInput
                                    value={values.emailInput}
                                    iconLeft="badge"
                                    style={accountStyles.editInput}
                                    onChangeText={handleChange('emailInput')}
                                    onBlur={handleBlur('emailInput')}
                                    error={touched.emailInput && errors.emailInput}
                                />

                                <Button text="Save" textColor={palette.white} bgColor={palette.primary} onPress={handleSubmit} disabled={!isValid} />
                            </>
                        )}
                    </Formik>
                </View>
            </BottomModal>

            <BottomModal onHide={() => setEditPhoneModalVisible(false)} modalVisible={editPhoneModalVisible}>
                <View style={[styles.w100]}>
                    <ErrorMessage message={phoneError} condition={phoneError} />
                    <Formik
                        initialValues={{ phoneInput: globalVars.getPhone() }}
                        validationSchema={editPhoneSchema}
                        onSubmit={(values) => { saveEditPhone(values.phoneInput) }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                            <>
                                <Text style={styles.inputText}>Phone Number</Text>
                                <CustomTextInput
                                    value={values.phoneInput}
                                    iconLeft="badge"
                                    style={accountStyles.editInput}
                                    onChangeText={handleChange('phoneInput')}
                                    onBlur={handleBlur('phoneInput')}
                                    error={touched.phoneInput && errors.phoneInput}
                                />

                                <Button text="Save" textColor={palette.white} bgColor={palette.primary} onPress={handleSubmit} disabled={!isValid} />
                            </>
                        )}
                    </Formik>
                </View>
            </BottomModal>
        </>
    );
}

const profilePictureSizing = {
    height: 100 * rem,
    width: 100 * rem,
    borderRadius: 100 * rem / 2,
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
        resizeMode: 'center',
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
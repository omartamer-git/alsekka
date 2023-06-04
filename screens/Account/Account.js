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

const Account = ({ route, navigation }) => {
    const [ratings, setRatings] = useState(null);
    const [editNameModalVisible, setEditNameModalVisible] = useState(false);
    const [editPhoneModalVisible, setEditPhoneModalVisible] = useState(false);
    const [editEmailModalVisible, setEditEmailModalVisible] = useState(false);


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

    const saveEditName = () => {

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
                            />
                            <CustomTextInput
                                value={globalVars.getEmail()}
                                iconLeft="mail"
                                iconRight="edit"
                                editable={false}
                                style={accountStyles.editInput}
                            />
                        </View>
                    </View>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setEditNameModalVisible(false)} modalVisible={editNameModalVisible}>
                <View style={[styles.w100]}>
                    <Text style={styles.inputText}>First Name</Text>
                    <CustomTextInput
                        value={globalVars.getFirstName()}
                        iconLeft="badge"
                        style={accountStyles.editInput}
                        onPressIn={() => setEditNameModalVisible(true)}
                    />

                    <Text style={styles.inputText}>Last Name</Text>
                    <CustomTextInput
                        value={globalVars.getLastName()}
                        iconLeft="badge"
                        style={accountStyles.editInput}
                        onPressIn={() => setEditNameModalVisible(true)}
                    />

                    <Button text="Save" textColor={palette.white} bgColor={palette.primary} onPress={saveEditName} />
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
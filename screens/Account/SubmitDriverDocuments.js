import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    ActionSheetIOS,
    TouchableOpacity,
    Modal
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import * as licensesAPI from '../../api/licenses';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import { Picker } from '@react-native-picker/picker';
import CarCard from '../../components/CarCard';
import PiggyBank from '../../svgs/piggybank';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Pending from '../../svgs/pending';

const carsAPI = require('../../api/carsAPI');

const SubmitDriverDocuments = ({ route, navigation }) => {
    useEffect(() => {
    }, []);

    const isDarkMode = useColorScheme === 'dark';
    const imagePickerOptions = { title: 'Drivers\' License Photo', multiple: true, mediaType: 'photo', includeBase64: true, quality: 0.5, maxWidth: 500, maxHeight: 500, storageOptions: { skipBackup: true, path: 'images' } };
    const [licenseFront, setLicenseFront] = useState("");
    const [licenseBack, setLicenseBack] = useState("");
    const [frontPhotoButtonText, setFrontPhotoButtonText] = useState("Upload Driver's License (Front)");
    const [backPhotoButtonText, setBackPhotoButtonText] = useState("Upload Driver's License (Back)");
    const [licenseStatus, setLicenseStatus] = useState(null);

    const setImageBack = (response) => {
        if (!response.didCancel && !response.error) {
            setLicenseBack(response.assets[0]['base64']);
            setBackPhotoButtonText("Back Side Chosen");
        }
    };

    const setImageFront = (response) => {
        if (!response.didCancel && !response.error) {
            setLicenseFront(response.assets[0]['base64']);
            setFrontPhotoButtonText("Front Side Chosen");
        }
    };

    const onClickUploadFront = async (e) => {
        const response = await launchImageLibrary(imagePickerOptions);
        setImageFront(response);
    };

    const onClickUploadBack = async (e) => {
        const response = await launchImageLibrary(imagePickerOptions);
        setImageBack(response);
    };

    const uploadLicense = async () => {
        const licenseBody = {
            uid: globalVars.getUserId(),
            frontSide: licenseFront,
            backSide: licenseBack,
        };

        await licensesAPI.uploadLicense(licenseBody);
        setLicenseStatus(0);
    };

    useEffect(() => {
        licensesAPI.getLicense().then((data) => {
            setLicenseStatus(data.status);
        });
    }, []);

    return (
        <ScreenWrapper screenName="Submit Documents" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={containerStyle}>
                <SafeAreaView style={{ backgroundColor: palette.inputbg, borderRadius: 10, width: '100%', flexGrow: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    </View>

                    {globalVars.getDriver() === 0 && licenseStatus === null &&
                        <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Front Side Driver's License Upload</Text>
                            <Button bgColor={palette.accent} textColor={palette.white} text={frontPhotoButtonText} onPress={onClickUploadFront} />

                            <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Back Side Driver's License Upload</Text>
                            <Button bgColor={palette.accent} textColor={palette.white} text={backPhotoButtonText} onPress={onClickUploadBack} />
                            <Button bgColor={palette.primary} textColor={palette.white} text="Upload" onPress={uploadLicense} />

                        </View>
                    }
                    {globalVars.getDriver() === 0 && licenseStatus === 0 &&
                        <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'center', justifyContent: 'center' }]}>
                            <Pending width="300" height="300" />
                            <Text style={{ marginTop: 20, fontSize: 32, fontWeight: '500', color: palette.accent, textAlign: 'center' }}>Your documents are being reviewed</Text>
                            <Text style={{ marginTop: 10, fontSize: 14, fontWeight: '500', color: palette.dark, textAlign: 'center' }}>To ensure the safety of our community, we have to carefully verify all documents sent to us. Please allow up to 24 hours for verification.</Text>
                        </View>
                    }

                </SafeAreaView>
            </ScrollView>
        </ScreenWrapper>
    );
}

export default SubmitDriverDocuments;
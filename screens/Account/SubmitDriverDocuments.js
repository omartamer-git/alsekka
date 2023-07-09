import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import useUserStore from '../../api/accountAPI';
import * as licensesAPI from '../../api/licenses';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import HeaderLip from '../../components/HeaderLip';
import { containerStyle, palette, rem, styles } from '../../helper';
import Pending from '../../svgs/pending';
import ScreenWrapper from '../ScreenWrapper';

const carsAPI = require('../../api/carsAPI');

const SubmitDriverDocuments = ({ route, navigation }) => {
    useEffect(() => {
    }, []);

    const isDarkMode = useColorScheme === 'dark';
    const imagePickerOptions = { title: 'Drivers\' License Photo', multiple: true, mediaType: 'photo', includeBase64: true, quality: 0.5, maxWidth: 500 * rem, maxHeight: 500 * rem, storageOptions: { skipBackup: true, path: 'images' } };
    const [licenseFront, setLicenseFront] = useState("");
    const [licenseBack, setLicenseBack] = useState("");
    const [frontPhotoButtonText, setFrontPhotoButtonText] = useState("Front Side");
    const [backPhotoButtonText, setBackPhotoButtonText] = useState("Back Side");
    const [licenseStatus, setLicenseStatus] = useState(null);
    const [frontSideTouched, setFrontSideTouched] = useState(false);
    const [backSideTouched, setBackSideTouched] = useState(false);

    const userStore = useUserStore();

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
        setFrontSideTouched(true);
        const response = await launchImageLibrary(imagePickerOptions);
        setImageFront(response);
    };

    const onClickUploadBack = async (e) => {
        setBackSideTouched(true);
        const response = await launchImageLibrary(imagePickerOptions);
        setImageBack(response);
    };

    const uploadLicense = async () => {
        const licenseBody = {
            uid: userStore.id,
            frontSide: licenseFront,
            backSide: licenseBack,
        };

        await licensesAPI.uploadLicense(licenseBody);
        setLicenseStatus("PENDING");
    };

    useEffect(() => {
        licensesAPI.getLicense().then((data) => {
            setLicenseStatus(data === null ? 0 : data.status);
        });
    }, []);

    return (
        <ScreenWrapper screenName="Submit Documents" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexGrow]}>
                    <HeaderLip />

                    {userStore.driver === 0 && licenseStatus === 0 &&
                        <View style={driverDocumentsStyles.wrapper}>
                            <Text style={styles.inputText}>Front Side Driver's License Upload *</Text>
                            <ErrorMessage condition={frontSideTouched && !licenseFront} message="This field is required" />
                            <Button bgColor={palette.accent} textColor={palette.white} text={frontPhotoButtonText} onPress={onClickUploadFront} />

                            <Text style={[styles.inputText]}>Back Side Driver's License Upload *</Text>
                            <ErrorMessage condition={backSideTouched && !licenseBack} message="This field is required" />
                            <Button bgColor={palette.accent} textColor={palette.white} text={backPhotoButtonText} onPress={onClickUploadBack} />
                            
                            <Button bgColor={palette.primary} textColor={palette.white} text="Upload" onPress={uploadLicense} disabled={!licenseFront || !licenseBack} />
                        </View>
                    }
                    {userStore.driver === 0 && licenseStatus === 'PENDING' &&
                        <View style={driverDocumentsStyles.wrapper}>
                            <Pending width="300" height="300" />
                            <Text style={[styles.mt20, styles.font28, styles.semiBold, styles.accent, styles.textCenter]}>Your documents are being reviewed</Text>
                            <Text style={[styles.mt10, styles.font14, styles.semiBold, styles.dark, styles.textCenter]}>To ensure the safety of our community, we have to carefully verify all documents sent to us. Please allow up to 24 hours for verification.</Text>
                        </View>
                    }

                </SafeAreaView>
            </ScrollView>
        </ScreenWrapper>
    );
}

const driverDocumentsStyles = StyleSheet.create({
    wrapper: {
        ...styles.defaultContainer,
        ...styles.defaultPadding,
        ...styles.bgLightGray,
        ...styles.w100,
        ...styles.fullCenter,
        zIndex: 5,
    },
});

export default SubmitDriverDocuments;
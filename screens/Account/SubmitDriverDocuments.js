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
import { useTranslation } from 'react-i18next';

const carsAPI = require('../../api/carsAPI');

const SubmitDriverDocuments = ({ route, navigation }) => {
    useEffect(() => {
    }, []);
    const {t} = useTranslation();


    const isDarkMode = useColorScheme === 'dark';
    const imagePickerOptions = { title: 'Drivers\' License Photo', mediaType: 'photo', quality: 0.5, maxWidth: 500 * rem, maxHeight: 500 * rem, storageOptions: { skipBackup: true, path: 'images' } };
    const [licenseFront, setLicenseFront] = useState("");
    const [licenseBack, setLicenseBack] = useState("");
    const [frontPhotoButtonText, setFrontPhotoButtonText] = useState(t('front_side'));
    const [backPhotoButtonText, setBackPhotoButtonText] = useState(t('back_side'));
    const [licenseStatus, setLicenseStatus] = useState(null);
    const [frontSideTouched, setFrontSideTouched] = useState(false);
    const [backSideTouched, setBackSideTouched] = useState(false);

    const userStore = useUserStore();

    const setImageBack = (response) => {
        if (!response.didCancel && !response.error) {
            setLicenseBack(response);
            setBackPhotoButtonText(t('back_chosen'));
        }
    };

    const setImageFront = (response) => {
        if (!response.didCancel && !response.error) {
            setLicenseFront(response);
            setFrontPhotoButtonText(t('front_chosen'));
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
        <ScreenWrapper screenName={t('submit_documents')} navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexGrow]}>
                    <HeaderLip />

                    {!userStore.driver && !licenseStatus &&
                        <View style={driverDocumentsStyles.wrapper}>
                            <Text style={styles.inputText}>{t('front_side_drivers_license')}</Text>
                            <ErrorMessage condition={frontSideTouched && !licenseFront} message="This field is required" />
                            <Button bgColor={palette.accent} textColor={palette.white} text={frontPhotoButtonText} onPress={onClickUploadFront} />

                            <Text style={[styles.inputText]}>{t('back_side_drivers_license')}</Text>
                            <ErrorMessage condition={backSideTouched && !licenseBack} message="This field is required" />
                            <Button bgColor={palette.accent} textColor={palette.white} text={backPhotoButtonText} onPress={onClickUploadBack} />
                            
                            <Button bgColor={palette.primary} textColor={palette.white} text={t('submit')} onPress={uploadLicense} disabled={!licenseFront || !licenseBack} />
                        </View>
                    }
                    {!userStore.driver && licenseStatus === 'PENDING' &&
                        <View style={driverDocumentsStyles.wrapper}>
                            <Pending width="300" height="300" />
                            <Text style={[styles.mt20, styles.font28, styles.semiBold, styles.accent, styles.textCenter]}>{t('wait_processing')}</Text>
                            <Text style={[styles.mt10, styles.font14, styles.semiBold, styles.dark, styles.textCenter]}>{t('wait_processing2')}</Text>
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
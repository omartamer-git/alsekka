import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ScrollView,
    Text,
    View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useUserStore from '../../api/accountAPI';
import * as licensesAPI from '../../api/licenses';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import HeaderLip from '../../components/HeaderLip';
import { containerStyle, palette, rem, styles } from '../../helper';
import Pending from '../../svgs/pending';
import ScreenWrapper from '../ScreenWrapper';
import FastImage from 'react-native-fast-image';
import ImagePicker from '../../components/ImagePicker';
import LottieView from 'lottie-react-native';

const carsAPI = require('../../api/carsAPI');

function SubmitDriverDocuments({ route, navigation }) {
    useEffect(function () {
    }, []);
    const { t } = useTranslation();

    const [submitDisabled, setSubmitDisabled] = useState(false);
    const imagePickerOptions = { title: 'Drivers\' License Photo', mediaType: 'photo', quality: 0.5, maxWidth: 500 * rem, maxHeight: 500 * rem, storageOptions: { skipBackup: true, path: 'images' } };
    const [licenseFront, setLicenseFront] = useState("");
    const [licenseBack, setLicenseBack] = useState("");
    const [frontPhotoButtonText, setFrontPhotoButtonText] = useState(t('front_side'));
    const [backPhotoButtonText, setBackPhotoButtonText] = useState(t('back_side'));
    const [licenseStatus, setLicenseStatus] = useState(null);
    const [frontSideTouched, setFrontSideTouched] = useState(false);
    const [backSideTouched, setBackSideTouched] = useState(false);

    const userStore = useUserStore();

    function setImageBack(response) {
        if (!response.didCancel && !response.error) {
            setLicenseBack(response);
            setBackPhotoButtonText(t('back_chosen'));
        }
    };

    function setImageFront(response) {
        if (!response.didCancel && !response.error) {
            setLicenseFront(response);
            setFrontPhotoButtonText(t('front_chosen'));
        }
    };

    async function onClickUploadFront(e) {
        setFrontSideTouched(true);
        setImageFrontModal(true);
        // const response = await launchCamera(imagePickerOptions);
        // setImageFront(response);
    };

    async function onClickUploadBack(e) {
        setBackSideTouched(true);
        setImageBackModal(true);
        // const response = await launchCamera(imagePickerOptions);
        // setImageBack(response);
    };

    const uploadLicense = async function () {
        setSubmitDisabled(true);
        const licenseBody = {
            frontSide: licenseFront,
            backSide: licenseBack,
        };

        licensesAPI.uploadLicense(licenseBody).then(function () {
            navigation.navigate('New Car');
            setLicenseStatus("PENDING");
        }).catch(err => {
            console.error(err);
        }).finally(function () {
            setSubmitDisabled(false);
        });
    };

    const [loading, setLoading] = useState(true);
    const [imageFrontModal, setImageFrontModal] = useState(false);
    const [imageBackModal, setImageBackModal] = useState(false);

    useEffect(function () {
        setLoading(true);
        licensesAPI.getLicense().then((data) => {
            setLicenseStatus(data === null ? 0 : data.status);
            setLoading(false);
        });
    }, []);


    return (
        <ScreenWrapper screenName={t('submit_documents')} navType="back" navAction={function () { navigation.goBack() }}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                <View style={[styles.bgLightGray, styles.w100, styles.flexGrow, styles.fullCenter]}>
                    <HeaderLip />
                    {!loading &&
                        <>
                            {!userStore.driver && !licenseStatus &&
                                <>
                                    {/* <Text style={[styles.text, styles.textCenter, styles.mb5]}>
                                        Please upload your driving license
                                    </Text>
                                    <Text style={[styles.bold, styles.mb5]}>(رخصة القيادة الشخصية)</Text>
                                    <Text style={[styles.text, styles.textCenter, styles.mb5]}>
                                        in order to proceed
                                    </Text> */}
                                    <FastImage
                                        source={{ uri: 'https://storage.googleapis.com/seaatspublic/license.png??' }}
                                        style={{ width: '100%', aspectRatio: 1.8 }}
                                        resizeMode='contain'
                                    />
                                    <Text style={[styles.text, styles.inputText]}>{t('front_side_drivers_license')}</Text>
                                    <ErrorMessage condition={frontSideTouched && !licenseFront} message={t('error_required')} />
                                    <Button bgColor={palette.accent} textColor={palette.white} text={frontPhotoButtonText} onPress={onClickUploadFront} />
                                    <ImagePicker visible={imageFrontModal} onChoose={setImageFront} onHide={() => setImageFrontModal(false)} />

                                    <Text style={[[styles.text, styles.inputText]]}>{t('back_side_drivers_license')}</Text>
                                    <ErrorMessage condition={backSideTouched && !licenseBack} message={t('error_required')} />
                                    <Button bgColor={palette.accent} textColor={palette.white} text={backPhotoButtonText} onPress={onClickUploadBack} />
                                    <ImagePicker visible={imageBackModal} onChoose={setImageBack} onHide={() => setImageBackModal(false)} />


                                    <Button bgColor={palette.primary} textColor={palette.white} text={t('next_new_car')} onPress={uploadLicense} disabled={!licenseFront || !licenseBack || submitDisabled} />
                                </>
                            }
                            {!userStore.driver && licenseStatus === 'PENDING' &&
                                <>
                                    {/* <Pending width="300" height="300" /> */}
                                    <LottieView source={require('../../assets/waiting_animation.json')} loop autoPlay style={{width: 300 * rem, height: 300 * rem, marginVertical: '-15%'}} resizeMode='center' />
                                    <Text style={[styles.text, styles.headerText, styles.textCenter]}>{t('wait_processing')}</Text>
                                    <Text style={[styles.text, styles.mt10, styles.font14, styles.dark, styles.textCenter]}>{t('wait_processing2')}</Text>
                                </>
                            }
                        </>
                    }

                    {loading &&
                        <>
                            <View style={[styles.w100]}>
                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'70%'} height={20 * rem} alignSelf='center' marginVertical={10 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'80%'} height={45 * rem} alignSelf='center' marginVertical={10 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'70%'} height={20 * rem} alignSelf='center' marginVertical={10 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'80%'} height={45 * rem} alignSelf='center' marginVertical={10 * rem} />
                                </SkeletonPlaceholder>
                            </View>
                        </>
                    }

                </View>
            </ScrollView>
        </ScreenWrapper >
    );
}

// const driverDocumentsStyles = StyleSheet.create({
//     wrapper: {
//         ...styles.bgLightGray,
//         ...styles.w100,
//         ...styles.fullCenter,
//         zIndex: 5,
//     },
// });

export default SubmitDriverDocuments;
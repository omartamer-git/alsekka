import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useRef, useState, memo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActionSheetIOS,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import * as carsAPI from '../../api/carsAPI';
import Button from '../../components/Button';
import CustomTextInput from '../../components/CustomTextInput';
import ErrorMessage from '../../components/ErrorMessage';
import HeaderView from '../../components/HeaderView';
import { containerStyle, palette, rem, styles } from '../../helper';
import CoffeeIcon from '../../svgs/coffee';
import ScreenWrapper from '../ScreenWrapper';
import ImagePicker from '../../components/ImagePicker';

function NewCar({ route, navigation }) {
    const { t } = useTranslation();

    const [cars, setCars] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const [charLicense1, setCharLicense1] = useState("");
    const [charLicense2, setCharLicense2] = useState("");
    const [charLicense3, setCharLicense3] = useState("");
    const imagePickerOptions = { title: 'Drivers\' License Photo', mediaType: 'photo', quality: 0.5, maxWidth: 500 * rem, maxHeight: 500 * rem, storageOptions: { skipBackup: true, path: 'images' } };

    const [licenseFront, setLicenseFront] = useState("");
    const [licenseBack, setLicenseBack] = useState("");

    const userStore = useUserStore();

    const [brand, setBrand] = useState('');
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [licensePlateNumbers, setLicensePlateNumbers] = useState('');

    const [frontPhotoButtonText, setFrontPhotoButtonText] = useState(t("choose_photo"));
    const [backPhotoButtonText, setBackPhotoButtonText] = useState(t("choose_photo"));
    const [frontPhotoButtonTouched, setFrontPhotoButtonTouched] = useState(false);
    const [backPhotoButtonTouched, setBackPhotoButtonTouched] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [frontImageModal, setFrontImageModal] = useState(false);
    const [backImageModal, setBackImageModal] = useState(false);

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events    

    function handleKeyPress(input, nextInputRef, prevInputRef) {
        if (input.length === 1 && nextInputRef) {
            nextInputRef.current.focus();
        } else if (input.length === 0 && prevInputRef) {
            prevInputRef.current.focus();
        }
    };

    async function addCar(brand, year, model, color, charLicense1, charLicense2, charLicense3, licensePlateNumbers) {
        setSubmitDisabled(true);
        const newCarBody = {
            brand: brand,
            year: year,
            model: model,
            color: color,
            licensePlateLetters: charLicense1 + charLicense2 + charLicense3,
            licensePlateNumbers: licensePlateNumbers,
        };

        carsAPI.newCar(newCarBody, licenseFront, licenseBack).then(() => setModalVisible(true)).catch((e) => console.error(e)).finally(() => setSubmitDisabled(false));
    };

    function setImageFront(response) {
        if (!response.didCancel && !response.error) {
            setLicenseFront(response.assets[0]);
            setFrontPhotoButtonText(t('front_chosen'));
        }
    };

    function setImageBack(response) {
        if (!response.didCancel && !response.error) {
            setLicenseBack(response.assets[0]);
            setBackPhotoButtonText(t('back_chosen'));
        }
    };

    async function chooseLicenseFront(e) {
        setFrontPhotoButtonTouched(true);
        setFrontImageModal(true);
        // const response = await launchCamera(imagePickerOptions);
        // setImageFront(response);
    };

    async function chooseLicenseBack(e) {
        setBackPhotoButtonTouched(true);
        setBackImageModal(true);
        // const response = await launchCamera(imagePickerOptions);
        // setImageBack(response);
    };

    const newCarSchema = Yup.object().shape({
        carBrandInput: Yup.string().required(t('error_required')).min(2, t('error_short')).max(20, t('error_long')),
        carYearInput: Yup.number().required(t('error_required')).positive().integer(t('error_number')).min(1980, t('error_year')).max(new Date().getFullYear() + 1, t('error_year')),
        carModelInput: Yup.string().required(t('error_required')),
        carColorInput: Yup.string().required(t('error_required')),
        licensePlateLetters1: Yup.string().required(' ').max(1, ' '),
        licensePlateLetters2: Yup.string(),
        licensePlateLetters3: Yup.string(),
        licensePlateNumbersInput: Yup.number('not a num').required(t('error_required')).positive().integer().max(9999).required(t('error_required')).typeError(t('error_number_type')),
    });


    return (
        <ScreenWrapper screenName={t('add_car')} navType="back" navAction={function () { navigation.goBack() }}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Formik
                    initialValues={{
                        carBrandInput: '',
                        carYearInput: '',
                        carModelInput: '',
                        carColorInput: '',
                        licensePlateLetters1: '',
                        licensePlateLetters2: '',
                        licensePlateLetters3: '',
                        licensePlateNumbersInput: ''
                    }}
                    validationSchema={newCarSchema}
                    onSubmit={(values) => {
                        if (licenseFront && licenseBack) {
                            addCar(
                                values.carBrandInput,
                                values.carYearInput,
                                values.carModelInput,
                                values.carColorInput,
                                values.licensePlateLetters1,
                                values.licensePlateLetters2,
                                values.licensePlateLetters3,
                                values.licensePlateNumbersInput)
                        }
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
                        <>
                            <Text style={[styles.text, styles.inputText]}>{t('car_brand')}</Text>
                            <CustomTextInput
                                placeholder={t('car_brand2')}
                                iconRight="directions-car"
                                value={values.carBrandInput}
                                onChangeText={handleChange('carBrandInput')}
                                onBlur={handleBlur('carBrandInput')}
                                error={touched.carBrandInput && errors.carBrandInput}
                            />

                            <Text style={[styles.text, styles.inputText]}>{t('yom')}</Text>
                            <CustomTextInput
                                keyboardType='number-pad'
                                placeholder={t('yom2')}
                                iconRight="date-range"
                                value={values.carYearInput}
                                onChangeText={handleChange('carYearInput')}
                                onBlur={handleBlur('carYearInput')}
                                error={touched.carYearInput && errors.carYearInput}
                            />

                            <Text style={[styles.text, styles.inputText]}>{t('car_model')}</Text>
                            <CustomTextInput
                                placeholder={t('car_model2')}
                                iconRight="badge"
                                value={values.carModelInput}
                                onChangeText={handleChange('carModelInput')}
                                onBlur={handleBlur('carModelInput')}
                                error={touched.carModelInput && errors.carModelInput}
                            />

                            <Text style={[styles.text, styles.inputText]}>{t('color')}</Text>
                            <CustomTextInput
                                placeholder={t('color2')}
                                iconRight="palette"
                                value={values.carColorInput}
                                onChangeText={handleChange('carColorInput')}
                                onBlur={handleBlur('carColorInput')}
                                error={touched.carColorInput && errors.carColorInput}
                            />

                            <Text style={[styles.text, styles.inputText]}>{t('license_letters')}</Text>

                            <View style={[{ flexDirection: 'row-reverse' }, styles.w100]}>


                                <CustomTextInput
                                    style={[styles.flexOne, styles.mh5]}
                                    textStyles={styles.textEnd}
                                    inputRef={input1Ref}

                                    value={values.licensePlateLetters1}
                                    onChangeText={(data) => {
                                        setFieldValue('licensePlateLetters1', data);
                                        handleKeyPress(data, input2Ref, null);
                                    }}
                                    onBlur={handleBlur('licensePlateLetters1')}
                                    error={touched.licensePlateLetters1 && errors.licensePlateLetters1}
                                    placeholder="أ"
                                />

                                <CustomTextInput style={[styles.flexOne, styles.mh5]}
                                    textStyles={styles.textEnd}
                                    inputRef={input2Ref}

                                    placeholder="ب"
                                    value={values.licensePlateLetters2}
                                    onChangeText={(data) => {
                                        setFieldValue('licensePlateLetters2', data);
                                        handleKeyPress(data, input3Ref, input1Ref);
                                    }}
                                    onBlur={handleBlur('licensePlateLetters2')}
                                    error={touched.licensePlateLetters2 && errors.licensePlateLetters2}
                                />

                                <CustomTextInput
                                    style={[styles.flexOne, styles.mh5]}
                                    textStyles={styles.textEnd}
                                    inputRef={input3Ref}
                                    placeholder="ت"
                                    value={values.licensePlateLetters3}
                                    onChangeText={(data) => {
                                        setFieldValue('licensePlateLetters3', data);
                                        handleKeyPress(data, null, input2Ref)
                                    }}
                                    onBlur={handleBlur('licensePlateLetters3')}
                                    error={touched.licensePlateLetters3 && errors.licensePlateLetters3}
                                />




                            </View>

                            <Text style={[styles.text, styles.inputText]}>{t('license_numbers')}</Text>
                            <CustomTextInput
                                keyboardType='number-pad'
                                placeholder={t('license_numbers2')}
                                value={values.licensePlateNumbersInput}
                                onChangeText={handleChange('licensePlateNumbersInput')}
                                onBlur={handleBlur('licensePlateNumbersInput')}
                                error={touched.licensePlateNumbersInput && errors.licensePlateNumbersInput}
                            />

                            <Text style={[styles.text, styles.inputText]}>{t('car_license_front')}</Text>
                            <ErrorMessage condition={frontPhotoButtonTouched && !licenseFront} message={t('error_required')} />
                            <Button
                                text={frontPhotoButtonText}
                                bgColor={palette.accent}
                                textColor={palette.white}
                                onPress={chooseLicenseFront}
                            />
                            <ImagePicker visible={frontImageModal} onHide={() => setFrontImageModal(false)} onChoose={setImageFront} />

                            <Text style={[styles.text, styles.inputText]}>{t('car_license_back')}</Text>
                            <ErrorMessage condition={backPhotoButtonTouched && !licenseBack} message={t('error_required')} />
                            <Button
                                text={backPhotoButtonText}
                                bgColor={palette.accent}
                                textColor={palette.white}
                                onPress={chooseLicenseBack}
                            />
                            <ImagePicker visible={backImageModal} onHide={() => setBackImageModal(false)} onChoose={setImageBack} />

                            <Button
                                text={t('confirm')}
                                bgColor={palette.primary}
                                textColor={palette.white}
                                onPress={handleSubmit}
                                style={[styles.mt20]}
                                disabled={!isValid || !licenseBack || !licenseFront || submitDisabled}
                            />
                        </>
                    )}
                </Formik>
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide">
                <SafeAreaView style={styles.bgPrimary}>
                    <HeaderView navType="back" screenName={t('manage_cars')} borderVisible={false} style={styles.bgPrimary} action={function () { setModalVisible(false) }} >
                        <View style={styles.localeWrapper}>
                            <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                            <Text style={[styles.text, styles.locale]}>EN</Text>
                        </View>
                    </HeaderView>
                </SafeAreaView>
                <View style={[styles.defaultContainer, styles.defaultPadding, styles.justifyCenter, styles.alignCenter]}>
                    <CoffeeIcon width={250} height={250} />
                    <Text style={[styles.text, styles.font28, styles.bold, styles.mt10]}>{t('wait_processing')}</Text>
                    <Text style={[styles.text, styles.font18, styles.mt5, styles.textCenter]}>{t('wait_processing2')}</Text>
                    <Button bgColor={palette.primary} textColor={palette.white} text={t('back')} onPress={function () { navigation.goBack(); }}></Button>
                </View>
            </Modal>
        </ScreenWrapper>
    );
}

export default memo(NewCar);
import React, { useState, useEffect, useRef } from 'react';
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
    ActionSheetIOS,
    Modal,
    Platform
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, translateEnglishNumbers, containerStyle, rem } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import * as carsAPI from '../../api/carsAPI';
import DatePicker from 'react-native-date-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Pending from '../../svgs/pending';
import ScreenWrapper from '../ScreenWrapper';
import CoffeeIcon from '../../svgs/coffee';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ErrorMessage from '../../components/ErrorMessage';
import useUserStore from '../../api/accountAPI';

const NewCar = ({ route, navigation }) => {
    const colorMode = useColorScheme();
    const isDarkMode = colorMode === 'dark';
    const [cars, setCars] = useState(null);

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const [charLicense1, setCharLicense1] = useState("");
    const [charLicense2, setCharLicense2] = useState("");
    const [charLicense3, setCharLicense3] = useState("");
    const imagePickerOptions = { title: 'Drivers\' License Photo', multiple: true, mediaType: 'photo', includeBase64: true, quality: 0.5, maxWidth: 500 * rem, maxHeight: 500 * rem, storageOptions: { skipBackup: true, path: 'images' } };

    const [licenseFront, setLicenseFront] = useState("");
    const [licenseBack, setLicenseBack] = useState("");

    const userStore = useUserStore();

    const [brand, setBrand] = useState('');
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [licensePlateNumbers, setLicensePlateNumbers] = useState('');

    const [frontPhotoButtonText, setFrontPhotoButtonText] = useState("Choose Photo...");
    const [backPhotoButtonText, setBackPhotoButtonText] = useState("Choose Photo...");
    const [frontPhotoButtonTouched, setFrontPhotoButtonTouched] = useState(false);
    const [backPhotoButtonTouched, setBackPhotoButtonTouched] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    const handleKeyPress = (input, nextInputRef, prevInputRef) => {
        if (input.length === 1 && nextInputRef) {
            nextInputRef.current.focus();
        } else if (input.length === 0 && prevInputRef) {
            prevInputRef.current.focus();
        }
    };

    const addCar = async (brand, year, model, color, charLicense1, charLicense2, charLicense3, licensePlateNumbers) => {
        const newCarBody = {
            uid: userStore.id,
            brand: brand,
            year: year,
            model: model,
            color: color,
            licensePlateLetters: charLicense1 + charLicense2 + charLicense3,
            licensePlateNumbers: licensePlateNumbers,
            license_front: licenseFront,
            license_back: licenseBack,
        };

        await carsAPI.newCar(newCarBody);
        setModalVisible(true);
    };

    const setImageFront = (response) => {
        if (!response.didCancel && !response.error) {
            setLicenseFront(response.assets[0]['base64']);
            setFrontPhotoButtonText("Front Side Chosen");
        }
    };

    const setImageBack = (response) => {
        if (!response.didCancel && !response.error) {
            setLicenseBack(response.assets[0]['base64']);
            setBackPhotoButtonText("Back Side Chosen");
        }
    };

    const chooseLicenseFront = (e) => {
        setFrontPhotoButtonTouched(true);
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Take Photo', 'Choose Photo'],
                cancelButtonIndex: 0,
                userInterfaceStyle: colorMode,
            },
            async (buttonIndex) => {
                if (buttonIndex === 1) {
                    const response = await launchCamera(imagePickerOptions);
                    setImageFront(response);
                } else if (buttonIndex === 2) {
                    const response = await launchImageLibrary(imagePickerOptions);
                    setImageFront(response);
                }
            }
        )
    };

    const chooseLicenseBack = (e) => {
        setBackPhotoButtonTouched(true);
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Take Photo', 'Choose Photo'],
                cancelButtonIndex: 0,
                userInterfaceStyle: colorMode,
            },
            async (buttonIndex) => {
                if (buttonIndex === 1) {
                    const response = await launchCamera(imagePickerOptions);
                    setImageBack(response);
                } else if (buttonIndex === 2) {
                    const response = await launchImageLibrary(imagePickerOptions);
                    setImageBack(response);
                }
            }
        )
    };

    const newCarSchema = Yup.object().shape({
        carBrandInput: Yup.string().required('This field is required').min(2, 'Too Short').max(20, 'Too Long'),
        carYearInput: Yup.number().positive().integer().max(new Date().getFullYear() + 1, "Please enter a valid year"),
        carModelInput: Yup.string().required('This field is required'),
        carColorInput: Yup.string().required('This field is required'),
        licensePlateLetters1: Yup.string().required(' ').max(1, ' '),
        licensePlateLetters2: Yup.string().max(1, ' '),
        licensePlateLetters3: Yup.string().max(1, ' '),
        licensePlateNumbersInput: Yup.number().positive().integer().max(9999).required('This field is required'),
    });

    return (
        <ScreenWrapper screenName="Add Car" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
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
                            <Text style={styles.inputText}>Car Brand</Text>
                            <CustomTextInput
                                placeholder="Car Brand (e.g. Mercedes)"
                                iconRight="directions-car"
                                value={values.carBrandInput}
                                onChangeText={handleChange('carBrandInput')}
                                onBlur={handleBlur('carBrandInput')}
                                error={touched.carBrandInput && errors.carBrandInput}
                            />

                            <Text style={styles.inputText}>Year of Manufacture</Text>
                            <CustomTextInput
                                placeholder="Car Year (e.g. 2022)"
                                iconRight="date-range"
                                value={values.carYearInput}
                                onChangeText={handleChange('carYearInput')}
                                onBlur={handleBlur('carYearInput')}
                                error={touched.carYearInput && errors.carYearInput}
                            />

                            <Text style={styles.inputText}>Car Model</Text>
                            <CustomTextInput
                                placeholder="Car Model (e.g. C180)"
                                iconRight="badge"
                                value={values.carModelInput}
                                onChangeText={handleChange('carModelInput')}
                                onBlur={handleBlur('carModelInput')}
                                error={touched.carModelInput && errors.carModelInput}
                            />

                            <Text style={styles.inputText}>Color</Text>
                            <CustomTextInput
                                placeholder="Color (e.g. Red)"
                                iconRight="palette"
                                value={values.carColorInput}
                                onChangeText={handleChange('carColorInput')}
                                onBlur={handleBlur('carColorInput')}
                                error={touched.carColorInput && errors.carColorInput}
                            />

                            <Text style={styles.inputText}>License Plate (Letters) *</Text>
                            <View style={[styles.w100, styles.flexRow]}>
                                <CustomTextInput
                                    style={styles.flexOne}
                                    textStyles={styles.textEnd}
                                    inputRef={input3Ref}
                                    placeholder="٣"
                                    value={values.licensePlateLetters3}
                                    onChangeText={(data) => {
                                        setFieldValue('licensePlateLetters3', data);
                                        handleKeyPress(data, null, input2Ref)
                                    }}
                                    onBlur={handleBlur('licensePlateLetters3')}
                                    error={touched.licensePlateLetters3 && errors.licensePlateLetters3}
                                />

                                <CustomTextInput style={[styles.flexOne, styles.ml10]}
                                    textStyles={styles.textEnd}
                                    inputRef={input2Ref}

                                    placeholder="٢"
                                    value={values.licensePlateLetters2}
                                    onChangeText={(data) => {
                                        setFieldValue('licensePlateLetters2', data);
                                        handleKeyPress(data, input3Ref, input1Ref);
                                    }}
                                    onBlur={handleBlur('licensePlateLetters2')}
                                    error={touched.licensePlateLetters2 && errors.licensePlateLetters2}
                                />

                                <CustomTextInput
                                    style={[styles.flexOne, styles.ml10]}
                                    textStyles={styles.textEnd}
                                    inputRef={input1Ref}

                                    value={values.licensePlateLetters1}
                                    onChangeText={(data) => {
                                        setFieldValue('licensePlateLetters1', data);
                                        handleKeyPress(data, input2Ref, null);
                                    }}
                                    onBlur={handleBlur('licensePlateLetters1')}
                                    error={touched.licensePlateLetters1 && errors.licensePlateLetters1}

                                    placeholder="١"
                                />
                            </View>

                            <Text style={styles.inputText}>License Plate (Numbers)</Text>
                            <CustomTextInput
                                placeholder="License Plate Number (e.g. 1234)"
                                value={values.licensePlateNumbersInput}
                                onChangeText={handleChange('licensePlateNumbersInput')}
                                onBlur={handleBlur('licensePlateNumbersInput')}
                                error={touched.licensePlateNumbersInput && errors.licensePlateNumbersInput}
                            />

                            <Text style={styles.inputText}>Car License (Front)</Text>
                            <ErrorMessage condition={frontPhotoButtonTouched && !licenseFront} message="This field is required." />
                            <Button
                                text={frontPhotoButtonText}
                                bgColor={palette.accent}
                                textColor={palette.white}
                                onPress={chooseLicenseFront}
                            />

                            <Text style={styles.inputText}>Car License (Back)</Text>
                            <ErrorMessage condition={backPhotoButtonTouched && !licenseBack} message="This field is required." />
                            <Button
                                text={backPhotoButtonText}
                                bgColor={palette.accent}
                                textColor={palette.white}
                                onPress={chooseLicenseBack}
                            />

                            <Button
                                text="Confirm"
                                bgColor={palette.primary}
                                textColor={palette.white}
                                onPress={handleSubmit}
                                disabled={!isValid || !licenseBack || !licenseFront}
                            />
                        </>
                    )}
                </Formik>
            </ScrollView>

            <Modal visible={modalVisible} animationType="slide">
                <SafeAreaView style={{ backgroundColor: palette.primary }}>
                    <HeaderView navType="back" screenName="Manage Cars" borderVisible={false} style={{ backgroundColor: palette.primary }} action={() => { setModalVisible(false) }} >
                        <View style={styles.localeWrapper}>
                            <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                            <Text style={styles.locale}>EN</Text>
                        </View>
                    </HeaderView>
                </SafeAreaView>
                <View style={[styles.defaultContainer, styles.defaultPadding, styles.justifyCenter, styles.alignCenter]}>
                    <CoffeeIcon width={250} height={250} />
                    <Text style={[styles.font28, styles.bold, styles.mt10]}>Hang Tight!</Text>
                    <Text style={[styles.font18, styles.mt5, styles.textCenter]}>We'll be processing your information soon.</Text>
                    <Button bgColor={palette.primary} textColor={palette.white} text="Go Back" onPress={() => { navigation.goBack(); }}></Button>
                </View>
            </Modal>
        </ScreenWrapper>
    );
}

export default NewCar;
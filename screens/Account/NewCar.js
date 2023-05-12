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
import * as globalVars from '../../globalVars';
import * as carsAPI from '../../api/carsAPI';
import DatePicker from 'react-native-date-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Pending from '../../svgs/pending';
import ScreenWrapper from '../ScreenWrapper';

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

    const [brand, setBrand] = useState('');
    const [year, setYear] = useState('');
    const [model, setModel] = useState('');
    const [color, setColor] = useState('');
    const [licensePlateNumbers, setLicensePlateNumbers] = useState('');

    const [frontPhotoButtonText, setFrontPhotoButtonText] = useState("Choose Photo...");
    const [backPhotoButtonText, setBackPhotoButtonText] = useState("Choose Photo...");

    const [modalVisible, setModalVisible] = useState(false);

    const handleKeyPress = (input, nextInputRef, prevInputRef) => {
        return ({ nativeEvent }) => {
            if (input.length === 0 && nextInputRef) {
                nextInputRef.current.focus();
            } else if (input.length === 1 && prevInputRef) {
                prevInputRef.current.focus();
            }
        };
    };

    const addCar = async () => {
        const newCarBody = {
            uid: globalVars.getUserId(),
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

    const setCharLicenseFull = (data, i) => {
        data = data.charAt(0);
        if (i === 1) {
            setCharLicense1(data);
        } else if (i === 2) {
            setCharLicense2(data);
        } else {
            setCharLicense3(data);
        }
    }

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


    return (
        <ScreenWrapper screenName="Add Card" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Text style={styles.inputText}>Car Brand</Text>
                <CustomTextInput placeholder="Car Brand (e.g. Mercedes)" iconRight="directions-car" value={brand} onChangeText={setBrand} />

                <Text style={styles.inputText}>Year of Manufacture</Text>
                <CustomTextInput placeholder="Car Year (e.g. 2022)" iconRight="date-range" value={year} onChangeText={setYear} />

                <Text style={styles.inputText}>Car Model</Text>
                <CustomTextInput placeholder="Car Model (e.g. C180)" iconRight="badge" value={model} onChangeText={setModel} />

                <Text style={styles.inputText}>Color</Text>
                <CustomTextInput placeholder="Color (e.g. Red)" iconRight="palette" value={color} onChangeText={setColor} />

                <Text style={styles.inputText}>License Plate (Letters)</Text>
                <View style={[styles.w100, styles.flexRow]}>
                    <CustomTextInput style={styles.flexOne} textStyles={styles.textEnd} inputRef={input3Ref} value={charLicense3} onKeyPress={handleKeyPress(charLicense3, null, input2Ref)} onChangeText={(data) => setCharLicenseFull(data, 3)} placeholder="٣" />
                    <CustomTextInput style={[styles.flexOne, styles.ml10]} textStyles={styles.textEnd} inputRef={input2Ref} onKeyPress={handleKeyPress(charLicense2, input3Ref, input1Ref)} value={charLicense2} onChangeText={(data) => setCharLicenseFull(data, 2)} placeholder="٢" />
                    <CustomTextInput style={[styles.flexOne, styles.ml10]} textStyles={styles.textEnd} inputRef={input1Ref} onKeyPress={handleKeyPress(charLicense1, input2Ref, null)} value={charLicense1} onChangeText={(data) => setCharLicenseFull(data, 1)} placeholder="١" />
                </View>

                <Text style={styles.inputText}>License Plate (Numbers)</Text>
                <CustomTextInput placeholder="License Plate Number (e.g. 1234)" value={licensePlateNumbers} onChangeText={setLicensePlateNumbers} />

                <Text style={styles.inputText}>Car License (Front)</Text>
                <Button text={frontPhotoButtonText} bgColor={palette.accent} textColor={palette.white} onPress={chooseLicenseFront} />

                <Text style={styles.inputText}>Car License (Back)</Text>
                <Button text={backPhotoButtonText} bgColor={palette.accent} textColor={palette.white} onPress={chooseLicenseBack} />

                <Button text="Confirm" bgColor={palette.primary} textColor={palette.white} onPress={addCar} />
            </ScrollView>
        </ScreenWrapper>
    );
}

export default NewCar;
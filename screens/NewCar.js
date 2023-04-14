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
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, translateEnglishNumbers } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../components/HeaderView';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Pending from '../svgs/pending';

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
    const imagePickerOptions = { title: 'Drivers\' License Photo', multiple: true, mediaType: 'photo', includeBase64: true, quality: 0.5, maxWidth: 500, maxHeight: 500, storageOptions: { skipBackup: true, path: 'images' } };

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

    useEffect(() => {
        const url = `${SERVER_URL}/cars?uid=${globalVars.getUserId()}`;
        fetch(url).then(response => response.json()).then(
            data => {
                setCars(data);
            });
    }, []);

    const handleKeyPress = (input, nextInputRef, prevInputRef) => {
        return ({ nativeEvent }) => {
            if (input.length === 0 && nextInputRef) {
                nextInputRef.current.focus();
            } else if (input.length === 1 && prevInputRef) {
                prevInputRef.current.focus();
            }
        };
    };

    const addCar = () => {
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
        fetch(SERVER_URL + `/newcar`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCarBody)
            }).then(response => response.json()).then(
                data => {
                    setModalVisible(true);
                }
            )

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
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="New Car" borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <View style={styles.wrapper}>
                <SafeAreaView style={{ backgroundColor: palette.inputbg, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    </View>

                    <Modal animationType='slide' transparent='true' visible={modalVisible} style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <SafeAreaView style={{ flex: 1, width: '100%' }}>
                            <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
                                <Pending width="300" height="300" />
                                <Text style={{ marginTop: 20, fontSize: 32, fontWeight: '500', color: palette.accent, textAlign: 'center' }}>Your documents are under review</Text>
                                <Text style={{ marginTop: 10, fontSize: 14, fontWeight: '500', color: palette.dark, textAlign: 'center' }}>To ensure the safety of our community, we have to carefully verify all documents sent to us. Please allow up to 24 hours for verification.</Text>
                            </View>
                            <View style={{ width: '100%', paddingLeft: 32, paddingRight: 32 }}>
                                <Button text="Continue" bgColor={palette.accent} textColor={palette.white} style={{ marginTop: 'auto' }} onPress={() => { setModalVisible(false); navigation.goBack(); }} />
                            </View>
                        </SafeAreaView>
                    </Modal>

                    <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', flex: 0 }]}>
                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Car Brand</Text>
                        <CustomTextInput placeholder="Car Brand (e.g. Mercedes)" iconRight="directions-car" value={brand} onChangeText={setBrand} />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Year of Manufacture</Text>
                        <CustomTextInput placeholder="Car Year (e.g. 2022)" iconRight="date-range" value={year} onChangeText={setYear} />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Car Model</Text>
                        <CustomTextInput placeholder="Car Model (e.g. C180)" iconRight="badge" value={model} onChangeText={setModel} />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Color</Text>
                        <CustomTextInput placeholder="Color (e.g. Red)" iconRight="palette" value={color} onChangeText={setColor} />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>License Plate (Letters)</Text>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <CustomTextInput style={{ flex: 1 }} textStyles={{ textAlign: 'right' }} inputRef={input3Ref} value={charLicense3} onKeyPress={handleKeyPress(charLicense3, null, input2Ref)} onChangeText={(data) => setCharLicenseFull(data, 3)} placeholder="٣" />
                            <CustomTextInput style={{ flex: 1, marginLeft: 10 }} textStyles={{ textAlign: 'right' }} inputRef={input2Ref} onKeyPress={handleKeyPress(charLicense2, input3Ref, input1Ref)} value={charLicense2} onChangeText={(data) => setCharLicenseFull(data, 2)} placeholder="٢" />
                            <CustomTextInput style={{ flex: 1, marginLeft: 10 }} textStyles={{ textAlign: 'right' }} inputRef={input1Ref} onKeyPress={handleKeyPress(charLicense1, input2Ref, null)} value={charLicense1} onChangeText={(data) => setCharLicenseFull(data, 1)} placeholder="١" />
                        </View>

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>License Plate (Numbers)</Text>
                        <CustomTextInput placeholder="License Plate Number (e.g. 1234)" value={licensePlateNumbers} onChangeText={setLicensePlateNumbers} />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Car License (Front)</Text>
                        <Button text={frontPhotoButtonText} bgColor={palette.accent} textColor={palette.white} onPress={chooseLicenseFront} />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Car License (Back)</Text>
                        <Button text={backPhotoButtonText} bgColor={palette.accent} textColor={palette.white} onPress={chooseLicenseBack} />

                        <Button text="Confirm" bgColor={palette.primary} textColor={palette.white} onPress={addCar} />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default NewCar;
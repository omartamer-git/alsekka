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
    ScrollView
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, translateEnglishNumbers } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../components/HeaderView';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';

const NewCar = ({ route, navigation }) => {
    const isDarkMode = useColorScheme === 'dark';
    const [cars, setCars] = useState(null);

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const [charLicense1, setCharLicense1] = useState("");
    const [charLicense2, setCharLicense2] = useState("");
    const [charLicense3, setCharLicense3] = useState("");

    useEffect(() => {
        const url = `${SERVER_URL}/cars?uid=${globalVars.getUserId()}`;
        fetch(url).then(response => response.json()).then(
            data => {
                setCars(data);
            });
    }, []);

    const handleKeyPress = (input, nextInputRef, prevInputRef) => {
        console.log("KEY PRESS HE");
        return ({ nativeEvent }) => {
            if (input.length === 0 && nextInputRef) {
                nextInputRef.current.focus();
            } else if (input.length === 1 && prevInputRef) {
                prevInputRef.current.focus();
            }
        };
    };

    const setCharLicenseFull = (data, i) => {
        data = data.charAt(0);
        if(i === 1) {
            setCharLicense1(data);
        } else if(i === 2) {
            setCharLicense2(data);
        } else {
            setCharLicense3(data);
        }
    }


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

                    <ScrollView style={{flex: 1}} contentContainerStyle={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', flex:0 }]}>
                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Car Brand</Text>
                        <CustomTextInput placeholder="Car Brand (e.g. Mercedes)" iconRight="directions-car" />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Year of Manufacture</Text>
                        <CustomTextInput placeholder="Car Year (e.g. 2022)" iconRight="date-range" />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Car Model</Text>
                        <CustomTextInput placeholder="Car Model (e.g. C180)" iconRight="badge" />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Color</Text>
                        <CustomTextInput placeholder="Color (e.g. Red)" iconRight="palette" />

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>License Plate (Letters)</Text>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <CustomTextInput style={{ flex: 1 }} textStyles={{textAlign: 'right'}} inputRef={input3Ref} value={charLicense3} onKeyPress={handleKeyPress(charLicense3, null, input2Ref)} onChangeText={(data) => setCharLicenseFull(data, 3) } placeholder="٣" />
                            <CustomTextInput style={{ flex: 1, marginLeft: 10 }} textStyles={{textAlign: 'right'}} inputRef={input2Ref} onKeyPress={handleKeyPress(charLicense2, input3Ref, input1Ref)} value={charLicense2} onChangeText={(data) => setCharLicenseFull(data, 2) }  placeholder="٢" />
                            <CustomTextInput style={{ flex: 1, marginLeft: 10 }} textStyles={{textAlign: 'right'}} inputRef={input1Ref} onKeyPress={handleKeyPress(charLicense1, input2Ref, null)} value={charLicense1} onChangeText={(data) => setCharLicenseFull(data, 1) }  placeholder="١" />
                        </View>

                        <Text style={{ color: palette.dark, marginTop: 20, fontSize: 15, fontWeight: '600' }}>License Plate (Numbers)</Text>
                        <CustomTextInput placeholder="License Plate Number (e.g. 1234)" />

                        <Button text="Confirm" />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default NewCar;
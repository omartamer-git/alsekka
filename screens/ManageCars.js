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
    ScrollView
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, translateEnglishNumbers } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HeaderView from '../components/HeaderView';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';

const ManageCars = ({ route, navigation }) => {
    const isDarkMode = useColorScheme === 'dark';
    const [cars, setCars] = useState(null);

    useEffect(() => {
        const url = `${SERVER_URL}/cars?uid=${globalVars.getUserId()}`;
        fetch(url).then(response => response.json()).then(
            data => {
                setCars(data);
            });
    }, []);

    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="My Cars" borderVisible={false} action={() => { navigation.goBack() }} >
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

                    <ScrollView contentContainerStyle={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5 }]}>
                        <View style={{ alignItems: 'flex-end', width: '100%', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => navigation.navigate('New Car')} style={{ backgroundColor: palette.inputbg, borderColor: palette.secondary, borderWidth: 2, padding: 24, paddingTop: 12, paddingBottom: 12, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialIcons name="add" size={22} color={palette.black} />
                                <Text style={{ color: palette.black, fontWeight: '600' }}>Add Car</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ width: '100%', marginTop: 10 }}>
                            {
                                cars && cars.map((data, index) => {
                                    return (
                                        <View style={{ width: '100%', padding: 16, borderBottomWidth: 1, borderColor: palette.light, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} key={"car" + index}>
                                            <View style={{ width: '60%', flexDirection: 'row' }}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                    <FontsAwesome5 name="car-alt" size={28} />
                                                </View>
                                                <View style={{ justifyContent: 'center', marginLeft: 10 }}>
                                                    <Text style={{ fontSize: 14, fontWeight: '600', flexWrap: 'wrap' }}>{data.brand} {data.model} ({data.year})</Text>
                                                    <Text style={{ fontSize: 14, fontWeight: '600', flexWrap: 'wrap', color: palette.dark }}>{data.color}</Text>
                                                </View>
                                            </View>
                                            <View style={{ height: 60, alignSelf: 'flex-end', width: '30%', marginTop: 10, borderRadius: 4, borderColor: palette.dark, borderWidth: 2 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: palette.dark, width: '100%', flexShrink: 1, paddingLeft: 2, paddingRight: 2, backgroundColor: '#0377b4' }}>
                                                    <Text style={{ fontWeight: '500', fontSize: 12 }}>EGYPT</Text>
                                                    <Text style={{ fontWeight: '500', fontSize: 12 }}>مصر</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', flex: 1 }}  >
                                                    <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '600', fontSize: 13, flexWrap: 'nowrap' }}>{translateEnglishNumbers(data.licensePlateNumbers)}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, backgroundColor: '#999999' }}></View>
                                                    <View style={{ flex: 10, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontWeight: '600', fontSize: 13, flexWrap: 'nowrap' }}>{data.licensePlateLetters.split('').join('​')}</Text></View>
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })
                            }
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default ManageCars;
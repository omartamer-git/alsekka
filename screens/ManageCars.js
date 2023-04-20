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
import CarCard from '../components/CarCard';

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

                    <ScrollView contentContainerStyle={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, flex: 0, flexGrow: 1 }]}>
                        {cars && cars.length > 0 &&
                            <View style={{ flex: 1, width: '100%' }}>
                                <View style={{ alignItems: 'flex-end', width: '100%', marginTop: 10 }}>
                                    <TouchableOpacity onPress={() => navigation.navigate('New Car')} style={{ backgroundColor: palette.inputbg, borderColor: palette.secondary, borderWidth: 2, padding: 24, paddingTop: 12, paddingBottom: 12, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <MaterialIcons name="add" size={22} color={palette.black} />
                                        <Text style={{ color: palette.black, fontWeight: '600' }}>Add Car</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ width: '100%', marginTop: 10 }}>
                                    {
                                        cars.map((data, index) => {
                                            return (
                                                <CarCard
                                                    approved={data.approved}
                                                    brand={data.brand}
                                                    model={data.model}
                                                    year={data.year}
                                                    color={data.color}
                                                    licensePlateLetters={data.licensePlateLetters}
                                                    licensePlateNumbers={data.licensePlateNumbers}
                                                    key={"car" + index} />
                                            );
                                        })
                                    }
                                </View>
                            </View>
                        }
                        {cars && cars.length === 0 &&
                            <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ textAlign: 'center', fontSize: 28, fontWeight: '600' }}>Let's get you on the road!</Text>
                                <Text style={{ fontSize: 18 }}>Register your car details now.</Text>
                                <Button onPress={() => navigation.navigate('New Car')} bgColor={palette.primary} textColor={palette.white} text="Add Car" />
                            </View>
                        }


                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default ManageCars;
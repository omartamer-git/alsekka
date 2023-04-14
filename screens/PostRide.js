import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    ScrollView,
    ActionSheetIOS,
    Modal
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle } from '../helper';
import Button from '../components/Button';
import Separator from '../components/Separator';
import CustomTextInput from '../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../components/HeaderView';
import AutoComplete from '../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../globalVars';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../components/FromToIndicator';
import { Picker } from '@react-native-picker/picker';

const carsAPI = require('../api/carsAPI');

const PostRide = ({ route, navigation }) => {
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const [pricePerSeat, setPricePerSeat] = useState('');
    const [time, setTime] = useState(new Date());
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [seatsAvailable, setSeatsAvailable] = useState('');
    const [seatsOccupied, setSeatsOccupied] = useState('');
    const [mainTextFrom, setMainTextFrom] = useState('');
    const [mainTextTo, setMainTextTo] = useState('');
    const [selectedCar, setSelectedCar] = useState('');
    const [usableCars, setUsableCars] = useState(null);

    const mapViewRef = useRef(null);
    const carPicker = useRef(null);

    useEffect(() => {
        carsAPI.getUsableCars()
        .then((usableCars) => {
            setUsableCars(usableCars);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const setLocationFrom = (loc, mainTextFrom) => {
        setMarkerFrom({ latitude: loc.lat, longitude: loc.lng });
        setMainTextFrom(mainTextFrom);
    }

    const setLocationTo = (loc, mainTextTo) => {
        setMarkerTo({ latitude: loc.lat, longitude: loc.lng });
        setMainTextTo(mainTextTo);
    }

    const postRide = (e) => {
        if (markerFrom && markerTo) {
            let newDate = date;
            newDate.setHours(time.getHours());
            newDate.setMinutes(time.getMinutes());

            const data = {
                fromLatitude: markerFrom.latitude,
                fromLongitude: markerFrom.longitude,
                toLatitude: markerTo.latitude,
                toLongitude: markerTo.longitude,
                mainTextFrom: mainTextFrom,
                mainTextTo: mainTextTo,
                pricePerSeat: pricePerSeat,
                driver: globalVars.getUserId(),
                datetime: getDateTime(date, false),
            };
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            }
            const url = `${SERVER_URL}/postride`;
            fetch(url, options).then(response => response.json()).then(data => {
                console.log(data);
            });
        }
    }

    const onChangePricePerSeat = (data) => {
        setPricePerSeat(data);
    }

    const handleChangeSeatsAvailable = (data) => {
        const numeric = data.replace(/[^0-9]/g, '');
        setSeatsAvailable(numeric);
    }

    const handleChangeSeatsOccupied = (data) => {
        const numeric = data.replace(/[^0-9]/g, '');
        setSeatsOccupied(numeric);
    }

    const handleChangePricePerSeat = (data) => {
        const numeric = data.replace(/[^0-9]/g, '');
        setPricePerSeat(numeric);
    }

    const isDarkMode = useColorScheme === 'dark';


    return (
        <View style={styles.backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'dark-content' : 'light-content'} />
            <SafeAreaView>
                <HeaderView navType="back" screenName="Post Ride" borderVisible={false} action={() => { navigation.goBack() }} >
                    <View style={styles.localeWrapper}>
                        <MaterialIcons style={styles.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                        <Text style={styles.locale}>EN</Text>
                    </View>
                </HeaderView>
            </SafeAreaView>

            <ScrollView style={styles.wrapper}>
                <SafeAreaView style={{ backgroundColor: palette.inputbg, borderRadius: 10, width: '100%', flex: 1 }}>
                    <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                    </View>

                    <View style={[styles.defaultContainer, styles.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start', justifyContent: 'flex-start' }]}>
                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Starting Point</Text>
                        <AutoComplete key="autoCompleteFrom" type="my-location" placeholder="From..." handleLocationSelect={setLocationFrom} inputStyles={{ backgroundColor: palette.white }} />

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Destination</Text>
                        <AutoComplete key="autoCompleteTo" type="place" placeholder="To..." handleLocationSelect={setLocationTo} inputStyles={{ backgroundColor: palette.white }} />
                        <DatePicker
                            modal
                            mode="date"
                            open={datePickerOpen}
                            date={date}
                            onConfirm={(date) => {
                                setDatePickerOpen(false);
                                date = new Date(date.toDateString());
                                setDate(date);
                                console.log(date);
                            }}
                            onCancel={() => {
                                setDatePickerOpen(false)
                            }}
                        />

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Date</Text>

                        <CustomTextInput
                            placeholder="Date"
                            value={date.toDateString()}
                            textColor={palette.black}
                            onPressIn={() => {
                                setDatePickerOpen(true)
                            }}
                            iconRight="date-range"
                            editable={false}
                            style={{ backgroundColor: palette.white }}
                        />

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Time</Text>

                        <CustomTextInput
                            placeholder="Time"
                            value={time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            textColor={palette.black}
                            onPressIn={() => {
                                setTimePickerOpen(true)
                            }}
                            iconRight="schedule"
                            editable={false}
                            style={{ backgroundColor: palette.white }}
                        />

                        <DatePicker
                            modal
                            mode="time"
                            open={timePickerOpen}
                            date={time}
                            onConfirm={(time) => {
                                setTimePickerOpen(false);
                                time.setSeconds(0);
                                time.setMilliseconds(0);
                                setTime(time);
                                console.log(time);
                            }}
                            onCancel={() => {
                                setTimePickerOpen(false)
                            }}
                        />



                        <Modal
                            visible={true}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={() => { console.log("close") }}
                        >
                            <ScrollView style={[styles.bottomModal, { height: '50%' }]} contentContainerStyle={{ padding: 16, }}>
                                {usableCars && usableCars.map((car, index) => {
                                    return (<Text>Hello</Text>);
                                })}
                            </ScrollView>   
                        </Modal>

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Seats Available</Text>

                        <CustomTextInput
                            placeholder="Number of empty seats"
                            value={seatsAvailable}
                            onChangeText={handleChangeSeatsAvailable}
                            iconLeft="groups"
                            style={{ backgroundColor: palette.white }}
                        />

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Seats Occupied</Text>

                        <CustomTextInput
                            placeholder="Number of full seats (without driver)"
                            value={seatsOccupied}
                            onChangeText={handleChangeSeatsOccupied}
                            iconLeft="group-work"
                            style={{ backgroundColor: palette.white }}
                        />

                        <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Price Per Seat</Text>

                        <CustomTextInput
                            placeholder="Price For One Seat"
                            value={pricePerSeat}
                            onChangeText={handleChangePricePerSeat}
                            iconLeft="attach-money"
                            style={{ backgroundColor: palette.white }}
                        />

                        <Button text="Post Ride" bgColor={palette.primary} textColor={palette.white} onPress={postRide} />

                    </View>
                </SafeAreaView>
            </ScrollView>
        </View>
    );
}

export default PostRide;
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
    TouchableOpacity,
    Modal
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, rem } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import { Picker } from '@react-native-picker/picker';
import CarCard from '../../components/CarCard';
import PiggyBank from '../../svgs/piggybank';
import * as carsAPI from '../../api/carsAPI';
import * as ridesAPI from '../../api/ridesAPI';
import ScreenWrapper from '../ScreenWrapper';
import BottomModal from '../../components/BottomModal';

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

    const [carSelectorOpen, setCarSelectorOpen] = useState(false);
    const [carSelectorText, setCarSelectorText] = useState('Choose a car..');
    const [selectedCar, setSelectedCar] = useState(null);
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

    const selectCar = (data) => {
        setSelectedCar(data);
        const carSelectorText = `${data.color} ${data.brand} ${data.model} (${data.licensePlateNumbers})`;
        setCarSelectorText(carSelectorText);
        setCarSelectorOpen(false);

    };

    const postRide = (e) => {
        if (markerFrom && markerTo) {
            let newDate = date;
            newDate.setHours(time.getHours());
            newDate.setMinutes(time.getMinutes());

            ridesAPI.postRide(markerFrom.latitude, markerFrom.longitude, markerTo.latitude, markerTo.longitude,
                mainTextFrom, mainTextTo, pricePerSeat, newDate, selectedCar.id);
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
        <ScreenWrapper screenName={"Post Ride"} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.wrapper} contentContainerStyle={styles.flexGrow}>
                <SafeAreaView style={[styles.bgLightGray, styles.w100, styles.flexGrow]}>

                    {globalVars.getDriver() === 1 &&
                        <View style={[styles.defaultContainer, styles.defaultPadding, styles.bgLightGray, styles.w100, styles.alignStart, styles.justifyCenter, { zIndex: 5 }]}>
                            <Text style={styles.inputText}>Starting Point</Text>
                            <AutoComplete key="autoCompleteFrom" type="my-location" placeholder="From..." handleLocationSelect={setLocationFrom} inputStyles={styles.bgWhite} />

                            <Text style={styles.inputText}>Destination</Text>
                            <AutoComplete key="autoCompleteTo" type="place" placeholder="To..." handleLocationSelect={setLocationTo} inputStyles={styles.bgWhite} />
                            <DatePicker
                                modal
                                mode="date"
                                open={datePickerOpen}
                                date={date}
                                onConfirm={(date) => {
                                    setDatePickerOpen(false);
                                    date = new Date(date.toDateString());
                                    setDate(date);
                                }}
                                onCancel={() => {
                                    setDatePickerOpen(false)
                                }}
                            />

                            <Text style={styles.inputText}>Date</Text>

                            <CustomTextInput
                                placeholder="Date"
                                value={date.toDateString()}
                                textColor={palette.black}
                                onPressIn={() => {
                                    setDatePickerOpen(true)
                                }}
                                iconRight="date-range"
                                editable={false}
                            />

                            <Text style={styles.inputText}>Time</Text>

                            <CustomTextInput
                                placeholder="Time"
                                value={time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                textColor={palette.black}
                                onPressIn={() => {
                                    setTimePickerOpen(true)
                                }}
                                iconRight="schedule"
                                editable={false}
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
                                }}
                                onCancel={() => {
                                    setTimePickerOpen(false)
                                }}
                            />

                            <Text style={styles.inputText}>Select a Car</Text>

                            <CustomTextInput
                                placeholder="Select a car.."
                                value={carSelectorText}
                                onPressIn={() => setCarSelectorOpen(true)}
                                iconLeft="directions-car"
                                editable={false}
                            />

                            <BottomModal onHide={() => setCarSelectorOpen(false)} modalVisible={carSelectorOpen}>

                                {usableCars && usableCars.map((data, index) => {
                                    return (
                                        <CarCard
                                            approved={data.approved}
                                            brand={data.brand}
                                            model={data.model}
                                            year={data.year}
                                            color={data.color}
                                            licensePlateLetters={data.licensePlateLetters}
                                            licensePlateNumbers={data.licensePlateNumbers}
                                            onPress={() => selectCar(data)}
                                            key={"car" + index} />
                                    );
                                })}

                                <TouchableOpacity onPress={() => { setCarSelectorOpen(false); navigation.navigate("New Car") }} style={{ width: '100%', height: 60 * rem, padding: 16 * rem, flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons name="add" size={18} color={palette.black} />
                                    <Text style={{ fontSize: 14, fontWeight: '600' }}>Add New Car</Text>
                                </TouchableOpacity>

                            </BottomModal>

                            <Text style={styles.inputText}>Seats Available</Text>

                            <CustomTextInput
                                placeholder="Number of empty seats"
                                value={seatsAvailable}
                                onChangeText={handleChangeSeatsAvailable}
                                iconLeft="groups"
                            />

                            <Text style={styles.inputText}>Price Per Seat</Text>

                            <CustomTextInput
                                placeholder="Price For One Seat"
                                value={pricePerSeat}
                                onChangeText={handleChangePricePerSeat}
                                iconLeft="attach-money"
                            />

                            <Button text="Post Ride" bgColor={palette.primary} textColor={palette.white} onPress={postRide} />

                        </View>
                    }
                    {globalVars.getDriver() === 0 &&
                        <View style={[styles.defaultContainer, styles.defaultPadding, styles.bgLightGray, styles.w100, styles.fullCenter, { zIndex: 5 }]}>
                            <PiggyBank width={300} height={300} />
                            <Text style={[styles.headerText, styles.textCenter]}>Get Paid to Carpool!</Text>
                            <Text style={[styles.textCenter, styles.font18, styles.mt10]}>Submit your license and become a vehicle owner to start making money on your commute!</Text>
                            <Button bgColor={palette.primary} textColor={palette.white} text="Let's Do It" onPress={() => navigation.navigate("Driver Documents")} />
                        </View>
                    }

                </SafeAreaView>
            </ScrollView>
        </ScreenWrapper>

    );
}

export default PostRide;
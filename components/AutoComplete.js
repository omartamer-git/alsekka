import React, { useState, useCallback, useEffect, useRef } from 'react';
import CustomTextInput from './CustomTextInput';
import HeaderView from './HeaderView';
import _debounce from 'lodash/debounce';
import {
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    TouchableOpacity,
    View,
    Modal,
    SafeAreaView,
} from 'react-native';
import { styles as styles2, palette, customMapStyle } from '../helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const googleKey = "AIzaSyDUNz5SYhR1nrdfk9TW4gh3CDpLcDMKwuw";

const AutoComplete = ({ style = {}, type, placeholder, handleLocationSelect, inputStyles = {} }) => {
    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [favoritePlaces, setFavoritePlaces] = useState(null);

    const [modalMap, setModalMap] = useState(true);
    const [location, setLocation] = useState(null);
    const mapViewRef = useRef(null);

    let placeIds = [];

    useEffect(() => {
        Geolocation.getCurrentPosition(
            info => {
                setLocation({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude
                });
            }
        );

        AsyncStorage.getItem("favorite_places").then((value) => {
            console.log(value);
            setFavoritePlaces(JSON.parse(value));
        });
    }, [modalVisible]);

    const handleTextChange = (data) => {
        if (data !== "") {
            let pred = [];
            placeIds = [];
            let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data}&key=${googleKey}&region=eg&language=en&locationbias=ipbias`;
            fetch(url).then
                (response => response.json()).then(
                    data => {
                        for (let i = 0; i < data.predictions.length; i++) {
                            pred.push([data.predictions[i].description, data.predictions[i].place_id]);
                        }
                        setPredictions(pred);
                    }
                )
        } else {
            setPredictions(null);
            placeIds = [];
        }
    }

    const debounceFn = useCallback(_debounce(handleTextChange, 300), []);

    const onChangeText = (data) => {
        setText(data);
        debounceFn(data);
    }

    const getLocationFromPlaceId = async (place_id) => {
        let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${googleKey}`;
        const response = (await fetch(url));
        const data = (await response.json());
        const loc = data.result.geometry.location;
        return loc;
    }

    const moveInput = async (pred) => {
        setModalVisible(false);
        setText(pred[0]);
        const loc = (await getLocationFromPlaceId(pred[1]));
        handleLocationSelect(
            loc, pred[0]
        );
        setPredictions([]);
    }

    const addToFavorites = async (prediction) => {
        let currFavorites = [];
        const value = await AsyncStorage.getItem('favorite_places');

        if (value != null) {
            currFavorites = JSON.parse(value);
        }

        const index = currFavorites.map((subArr) => subArr[1]).concat().indexOf(prediction[1]);
        if (index !== -1) {
            currFavorites.splice(index, 1);
        } else {
            currFavorites.push(prediction);
        }

        setFavoritePlaces(currFavorites);
        await AsyncStorage.setItem('favorite_places', JSON.stringify(currFavorites));
    }

    return (
        <View style={{ width: '100%' }}>
            <CustomTextInput onFocus={() => { setModalVisible(true); }} placeholder={placeholder} value={text} style={inputStyles} iconLeft={type} />
            <Modal animationType="slide" visible={modalVisible}>
                <View style={styles.modalStyle}>
                    <SafeAreaView style={{ backgroundColor: palette.primary }}>
                        <HeaderView navType="back" screenName="Enter Location" borderVisible={false} action={() => { setModalVisible(false) }} >
                            <View style={styles2.localeWrapper}>
                                <MaterialIcons style={styles2.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                                <Text style={styles2.locale}>EN</Text>
                            </View>
                        </HeaderView>
                    </SafeAreaView>

                    <SafeAreaView style={{ flex: 1, width: '100%' }}>
                        <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                        </View>

                        <View style={[styles2.defaultContainer, styles2.defaultPadding, { backgroundColor: palette.inputbg, width: '100%', zIndex: 5, alignItems: 'flex-start' }]}>

                            <CustomTextInput iconLeft="pin-drop" onChangeText={onChangeText} placeholder={placeholder} value={text} />
                            {!modalMap && predictions &&
                                predictions.map(
                                    (prediction, index) => {
                                        let color = palette.light;
                                        if (favoritePlaces) {
                                            const favoritePlaces_ids = favoritePlaces.map((subArr) => subArr[1]).concat();
                                            if (favoritePlaces_ids.includes(prediction[1])) {
                                                color = palette.red;
                                            }
                                        }
                                        return (
                                            <TouchableOpacity key={index} style={styles.predictionBox} onPress={() => moveInput(prediction)}>
                                                <Text style={{ flex: 10 }}>{prediction[0]}</Text>
                                                <TouchableOpacity onPress={() => addToFavorites(prediction)} style={{ flex: 1 }}>
                                                    <MaterialIcons name="favorite" size={20} color={color} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )
                                    }
                                )
                            }
                            {!modalMap && !predictions &&
                                <View style={{ flex: 1, width: '100%' }}>
                                    <Text style={[styles2.headerText3, { marginTop: 30 }]}>Favorites</Text>
                                    <View style={{ flex: 1, width: '100%', marginTop: 10 }}>
                                        {
                                            favoritePlaces &&
                                            favoritePlaces.map(
                                                (prediction, index) => {
                                                    let color = palette.red;
                                                    return (
                                                        <TouchableOpacity key={index} style={styles.predictionBox} onPress={() => moveInput(prediction)}>
                                                            <Text style={{ flex: 17 }}>{prediction[0]}</Text>
                                                            <TouchableOpacity onPress={() => addToFavorites(prediction)} style={{ flex: 2 }}>
                                                                <MaterialIcons name="favorite" size={20} color={color} />
                                                            </TouchableOpacity>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            )
                                        }
                                    </View>

                                </View>
                            }
                        </View>
                    </SafeAreaView>
                    
                </View>


            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: palette.inputbg,
        width: '100%'
    },
    predictionBox: {
        width: '100%',
        height: 48,
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    }

});


export default AutoComplete;
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect } from '@react-navigation/native';
import _debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Modal,
    NativeModules,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as googleMapsAPI from '../api/googlemaps';
import { customMapStyle, mapPadding, palette, rem, styles as styles2 } from '../helper';
import Button from './Button';
import CustomTextInput from './CustomTextInput';
import HeaderView from './HeaderView';

const googleKey = "AIzaSyDUNz5SYhR1nrdfk9TW4gh3CDpLcDMKwuw";
const StatusBarManager = NativeModules;

const AutoComplete = ({ style = {}, type, placeholder, handleLocationSelect, inputStyles = {}, error=false }) => {
    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [favoritePlaces, setFavoritePlaces] = useState(null);

    const [modalMap, setModalMap] = useState(false);
    const [location, setLocation] = useState(null);
    const [mapPred, setMapPred] = useState(null);

    const mapViewRef = useRef(null);

    const [statusBarHeight, setStatusBarHeight] = useState(0);

    let placeIds = [];

    useEffect(() => {
        setModalMap(false);

        Geolocation.getCurrentPosition(
            info => {
                setLocation({
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude
                });
            }
        );

        AsyncStorage.getItem("favorite_places").then((value) => {
            setFavoritePlaces(JSON.parse(value));
        });

    }, [modalVisible]);

    if(Platform.OS === 'ios') {
        const onFocusEffect = useCallback(() => {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return () => {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }, []);
    
        useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    const handleTextChange = async (data) => {
        if (data !== "") {
            placeIds = [];
            const pred = await googleMapsAPI.getPredictions(data);
            setPredictions(pred);
        } else {
            setPredictions(null);
            placeIds = [];
        }
    }

    const handleRegionChange = async (region) => {
        const results = await googleMapsAPI.geocode(region.latitude, region.longitude);

        const description = results.formatted_address;
        const placeId = results.place_id;

        setMapPred([description, placeId]);

        moveInput([description, placeId], false);
    }

    const debounceFn = useCallback(_debounce(handleTextChange, 300), []);
    const debounceRegion = useCallback(_debounce(handleRegionChange, 300), [])
    const onChangeText = (data) => {
        setText(data);
        debounceFn(data);
    }

    const onChangeRegion = (region) => {
        debounceRegion(region);
    };

    const getLocationFromPlaceId = async (place_id) => {
        const loc = await googleMapsAPI.getLocationFromPlaceId(place_id);
        return loc;
    }

    const moveInput = async (pred, exit = true) => {
        setText(pred[0]);
        const loc = (await getLocationFromPlaceId(pred[1]));
        if (exit) {
            setModalVisible(false);
            handleLocationSelect(
                loc, pred[0]
            );
        }
        setPredictions(null);
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
            <CustomTextInput onFocus={() => { setModalVisible(true); }} placeholder={placeholder} value={text} style={inputStyles} iconLeft={type} error={error} />
            <Modal animationType="slide" visible={modalVisible}>
                <SafeAreaView style={[{backgroundColor: palette.primary}, styles2.AndroidSafeArea]}>
                    <HeaderView navType="back" screenName="Enter Location" borderVisible={false} style={{ backgroundColor: palette.primary }} action={() => { setText(''); setPredictions(null); setModalVisible(false); }} >
                        <View style={styles2.localeWrapper}>
                            <MaterialIcons style={styles2.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                            <Text style={styles2.locale}>EN</Text>
                        </View>
                    </HeaderView>
                </SafeAreaView>

                <View style={styles.container}>
                    <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 5, }}>
                        <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                        </View>

                        <View style={[styles2.defaultContainer, styles2.defaultPadding,]}>
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
                                                <TouchableOpacity onPress={() => addToFavorites(prediction)} style={styles.flexOne}>
                                                    <MaterialIcons name="favorite" size={20} color={color} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )
                                    }
                                )
                            }
                            {!modalMap && !predictions &&
                                <View style={[styles.flexOne, styles.w100]}>
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
                                        <TouchableOpacity style={{ flexDirection: 'row', height: 48 * rem, width: '100%', borderBottomColor: '#d9d9d9', borderBottomWidth: 1, padding: 5, alignItems: 'center' }} onPress={() => { setModalMap(true) }}>
                                            <MaterialIcons name="place" size={16} color={palette.black} />
                                            <Text style={styles2.ml10}>Choose Location on Map</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }

                        </View>
                    </View>

                    { modalMap && <View style={[styles2.defaultPadding, { position: 'absolute', bottom: 80, left: 0, width: '100%', zIndex: 8}]}>
                        <Button text="Choose Location" bgColor={palette.primary} textColor={palette.white} onPress={() => {moveInput(mapPred)}}/>
                    </View> }

                    {modalMap &&
                        <MapView
                            style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}
                            showUserLocation={true}
                            region={location}
                            onRegionChangeComplete={(region) => onChangeRegion(region)}
                            provider={PROVIDER_GOOGLE}
                            ref={mapViewRef}
                            customMapStyle={customMapStyle}
                            mapPadding={mapPadding}
                        >
                            <MaterialIcons name="place" size={48} color={palette.red} />
                        </MapView>}

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
        backgroundColor: palette.lightGray,
        width: '100%'
    },
    predictionBox: {
        width: '100%',
        height: 48 * rem,
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: palette.lightGray,
    }

});


export default AutoComplete;
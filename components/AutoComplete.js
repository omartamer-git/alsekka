import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import _debounce from 'lodash/debounce';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    Modal,
    NativeModules,
    Platform,
    SafeAreaView,
    ScrollView,
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
import { useTranslation } from 'react-i18next';
import { requestLocationPermission } from '../util/maps';

const StatusBarManager = NativeModules;

const AutoComplete = forwardRef(function ({ style = {}, type, placeholder, handleLocationSelect, inputStyles = {}, error = false }, ref) {
    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [favoritePlaces, setFavoritePlaces] = useState(null);
    const [recentPlaces, setRecentPlaces] = useState(null);

    const [modalMap, setModalMap] = useState(false);
    const [location, setLocation] = useState(null);
    const [mapPred, setMapPred] = useState(null);
    const inputLocRef = useRef(null);
    const { t } = useTranslation();

    const mapViewRef = useRef(null);

    const [statusBarHeight, setStatusBarHeight] = useState(0);

    let placeIds = [];

    useImperativeHandle(ref, () => ({
        setCompletionText(txt) {
            setText(txt);
        }
    }));


    useEffect(function () {
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

        AsyncStorage.getItem("recent_places").then((value) => {
            setRecentPlaces(JSON.parse(value));
        })

    }, [modalVisible]);

    useEffect(function () {
        if (inputLocRef.current && modalVisible) {
            inputLocRef.current.focus();
        }
    }, [modalVisible, inputLocRef.current]);

    useEffect(function () {
        if (modalVisible) {
            setText("");
        }
    }, [modalVisible]);

    if (Platform.OS === 'ios') {
        const onFocusEffect = useCallback(function () {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return function () {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }, []);

        useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    async function handleTextChange(data) {
        if (data !== "") {
            placeIds = [];
            const pred = await googleMapsAPI.getPredictions(data);
            setPredictions(pred);
        } else {
            setPredictions(null);
            placeIds = [];
        }
    }

    async function handleRegionChange(region) {
        const results = await googleMapsAPI.geocode(region.latitude, region.longitude);

        const description = results.formatted_address;
        const placeId = results.place_id;

        setMapPred([description, placeId]);

        moveInput([description, placeId], false);
    }

    const debounceFn = useCallback(_debounce(handleTextChange, 300), []);
    const debounceRegion = useCallback(_debounce(handleRegionChange, 300), [])
    function onChangeText(data) {
        setText(data);
        debounceFn(data);
    }

    function onChangeRegion(region) {
        debounceRegion(region);
    };

    async function getLocationFromPlaceId(place_id) {
        const loc = await googleMapsAPI.getLocationFromPlaceId(place_id);
        return loc;
    }

    async function moveInput(pred, exit = true) {
        try {
            setText(pred[0]);
            const loc = (await getLocationFromPlaceId(pred[1]));

            const value = await AsyncStorage.getItem('recent_places');
            let currRecents = [];
            if (value != null) {
                currRecents = JSON.parse(value);
            }
            const index = currRecents.filter((subArr) => subArr[1] === pred[1]);
            if (index.length === 0) {
                currRecents.unshift(pred);

                if (currRecents.length >= 4) {
                    currRecents.pop();
                }

                AsyncStorage.setItem('recent_places', JSON.stringify(currRecents));
            }

            if (exit) {
                setModalVisible(false);
                handleLocationSelect(
                    loc, pred[0]
                );
            }
            setPredictions(null);
        } catch (e) {
            console.log(e);
        }
    }

    async function setCurrentLocation() {
        setText(t('current_location'));
        const result = await requestLocationPermission();
        if (result) {
            Geolocation.getCurrentPosition(
                info => {
                    handleLocationSelect({ lat: info.coords.latitude, lng: info.coords.longitude }, t('current_location'));
                    setPredictions(null);
                    setModalVisible(false);
                }
            );
        }

    }

    async function addToFavorites(prediction) {
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

    function enableModal() {
        setModalVisible(true);
    }

    function cancelAutoComplete() {
        setText('');
        setPredictions(null);
        setModalVisible(false);
    }


    return (
        <View style={{ width: '100%' }}>
            <CustomTextInput onFocus={enableModal} placeholder={placeholder} value={text} style={inputStyles} iconLeft={type} error={error} />
            <Modal animationType="slide" visible={modalVisible}>
                <SafeAreaView style={[{ backgroundColor: palette.primary }, styles2.AndroidSafeArea]}>
                    <HeaderView navType="back" screenName={t('enter_location')} borderVisible={false} style={{ backgroundColor: palette.primary }} action={cancelAutoComplete} >
                        <View style={styles2.localeWrapper}>
                            <MaterialIcons style={styles2.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                            <Text style={[styles2.locale, styles2.text]}>EN</Text>
                        </View>
                    </HeaderView>
                </SafeAreaView>

                <View style={styles.container}>
                    <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 5, }}>
                        <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                        </View>

                        <View style={[styles2.defaultContainer, styles2.defaultPadding]}>
                            <CustomTextInput inputRef={inputLocRef} iconLeft="pin-drop" onChangeText={onChangeText} placeholder={placeholder} value={text} />
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
                                            <TouchableOpacity key={index} style={styles.predictionBox} onPress={function () { moveInput(prediction) }}>
                                                <Text style={[styles2.text, { flex: 10 }]}>{prediction[0]}</Text>
                                                <TouchableOpacity onPress={function () { addToFavorites(prediction) }} style={styles.flexOne}>
                                                    <MaterialIcons name="favorite" size={20} color={color} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )
                                    }
                                )
                            }
                            {!modalMap && !predictions &&
                                <ScrollView keyboardShouldPersistTaps={"handled"} style={[styles2.flexOne, styles2.w100]}>
                                    <Text style={[styles2.headerText3, styles2.text, { marginTop: 30 }]}>{t('recent_destinations')}</Text>
                                    <View style={[{ flex: 1, marginTop: 10, width: '100%' }]}>
                                        {
                                            recentPlaces &&
                                            recentPlaces.map(
                                                (prediction, index) => {
                                                    return (
                                                        <TouchableOpacity key={index} style={styles.predictionBox} onPress={function () { moveInput(prediction) }}>
                                                            <Text numberOfLines={2} style={[styles2.text, { flex: 17 }]}>{prediction[0]}</Text>
                                                            <TouchableOpacity activeOpacity={1} style={[styles2.alignEnd, { flex: 3 }]}>
                                                                <MaterialIcons name="history" size={20} color={palette.dark} />
                                                            </TouchableOpacity>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            )
                                        }
                                    </View>

                                    <Text style={[styles2.headerText3, styles2.text, { marginTop: 30 }]}>{t('favorite_destinations')}</Text>
                                    <View style={[{ flex: 1, marginTop: 10, width: '100%' }]}>
                                        {
                                            favoritePlaces &&
                                            favoritePlaces.map(
                                                (prediction, index) => {
                                                    let color = palette.red;
                                                    return (
                                                        <TouchableOpacity key={index} style={styles.predictionBox} onPress={function () { moveInput(prediction) }}>
                                                            <Text numberOfLines={2} style={[styles2.text, { flex: 17 }]}>{prediction[0]}</Text>
                                                            <TouchableOpacity onPress={function () { addToFavorites(prediction) }} style={[styles2.alignEnd, { flex: 3 }]}>
                                                                <MaterialIcons name="favorite" size={20} color={color} />
                                                            </TouchableOpacity>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            )
                                        }
                                    </View>


                                    <TouchableOpacity style={{ flexDirection: 'row', height: 48 * rem, width: '100%', borderBottomColor: '#d9d9d9', borderBottomWidth: 1, padding: 5, alignItems: 'center' }} onPress={function () { setModalMap(true) }}>
                                        <MaterialIcons name="place" size={16} color={palette.black} />
                                        <Text style={[styles2.text, styles2.ml10]}>{t('choose_location')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ flexDirection: 'row', height: 48 * rem, width: '100%', borderBottomColor: '#d9d9d9', borderBottomWidth: 1, padding: 5, alignItems: 'center' }} onPress={setCurrentLocation}>
                                        <MaterialIcons name="my-location" size={16} color={palette.black} />
                                        <Text style={[styles2.text, styles2.ml10]}>{t('current_location')}</Text>
                                    </TouchableOpacity>

                                </ScrollView>
                            }

                        </View>
                    </View>

                    {modalMap && <View style={[styles2.defaultPadding, { position: 'absolute', bottom: 80, left: 0, width: '100%', zIndex: 8 }]}>
                        <Button text={t('choose_location')} bgColor={palette.primary} textColor={palette.white} onPress={function () { moveInput(mapPred) }} />
                    </View>}

                    {modalMap &&
                        <MapView
                            style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}
                            showsUserLocation={true}
                            initialRegion={location}
                            onRegionChangeComplete={onChangeRegion}
                            provider={PROVIDER_GOOGLE}
                            ref={mapViewRef}
                            customMapStyle={customMapStyle}
                            mapPadding={{ bottom: 96 * rem, top: 0, left: 0 * rem, right: 0 }}
                            minZoomLevel={6}
                            showsMyLocationButton
                        >
                            <MaterialIcons style={{ marginBottom: (96 + 48) * rem }} name="place" size={48} color={palette.red} />
                        </MapView>}

                </View>
            </Modal>
        </View>
    );
});

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
        ...styles2.flexRow
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: palette.lightGray,
    }

});


export default AutoComplete;
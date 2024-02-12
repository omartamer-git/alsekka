import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import _debounce from 'lodash/debounce';
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    FlatList,
    I18nManager,
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
import MapView, { Geojson, PROVIDER_GOOGLE } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as googleMapsAPI from '../api/googlemaps';
import { customMapStyle, mapPadding, palette, rem, styles as styles2 } from '../helper';
import Button from './Button';
import CustomTextInput from './CustomTextInput';
import HeaderView from './HeaderView';
import { useTranslation } from 'react-i18next';
import { requestLocationPermission } from '../util/maps';
import ListItem from './WithdrawalMethod';
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import useAppManager from '../context/appManager';
import { getCityBounds } from '../api/geojson';
const geolib = require('geolib');
const d3 = require('d3-geo'); // Importing d3-geo module

const StatusBarManager = NativeModules;

const AutoComplete = forwardRef(function ({ style = {}, type, placeholder, handleLocationSelect, handleCancelLocationSelect, cities, inputStyles = {}, error = false }, ref) {
    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [favoritePlaces, setFavoritePlaces] = useState(null);
    const [recentPlaces, setRecentPlaces] = useState(null);
    const [chooseLocationDisabled, setChooseLocationDisabled] = useState(false);

    const [modalMap, setModalMap] = useState(false);
    const [city, setCity] = useState(null);

    const myLocation = useRef(null);
    // const sessionToken = useRef(null);
    const [mapPred, setMapPred] = useState(null);
    const inputLocRef = useRef(null);
    const { t } = useTranslation();

    const mapViewRef = useRef(null);
    const currRegion = useRef(null);

    const [statusBarHeight, setStatusBarHeight] = useState(0);
    const [geojson, setGeojson] = useState();

    const appManager = useAppManager();

    let placeIds = [];

    Geolocation.getCurrentPosition(
        info => {
            myLocation.current = {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude
            };
        }
    );

    useImperativeHandle(ref, () => ({
        setCompletionText(txt) {
            setText(txt);
        }
    }));


    useEffect(function () {
        setModalMap(false);
        if (city) {
            AsyncStorage.getItem("favorite_places").then((value) => {
                setFavoritePlaces(JSON.parse(value));
            });

            AsyncStorage.getItem("recent_places").then((value) => {
                setRecentPlaces(JSON.parse(value));
            });

            getCityBounds(city).then(setGeojson);
        }
    }, [city, modalVisible]);

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

    function handleTextChange(data) {
        if (data !== "") {
            placeIds = [];
            console.log("zhoooo");
            console.log(city);
            const pred = googleMapsAPI.getPredictions(data, myLocation.current.latitude, myLocation.current.longitude, city).then(pred => {
                setPredictions(pred.data);
            });
            // sessionToken.current = pred.sessiontoken;
        } else {
            setPredictions(null);
            placeIds = [];
        }
    }

    function isLocationWithinBounds(point) {
        for (const feature of geojson.features) {
            // Convert the feature to a GeoJSON object
            const geoJSONObject = {
                type: "Feature",
                geometry: feature.geometry
            };
            // Check if the GeoJSON contains the point
            if (d3.geoContains(geojson, [point.longitude, point.latitude])) {
                return true;
            } else {
                console.log(feature);
            }
        }
        return false;
    }

    async function handleRegionChange(region) {
        console.log(region);
        console.log(isLocationWithinBounds(region));
        console.log(geojson);
        if (isLocationWithinBounds(region)) {
            setChooseLocationDisabled(false);
            const results = await googleMapsAPI.geocode(region.latitude, region.longitude);
            currRegion.current = {
                latitude: region.latitude,
                longitude: region.longitude
            }
            const description = results.formatted_address;
            const placeId = results.place_id;

            setMapPred([description, placeId]);

            moveInput([description, placeId], false, { lat: region.latitude, lng: region.longitude });
        } else {
            setChooseLocationDisabled(true);
        }
    }

    const debounceFn = useCallback(_debounce(handleTextChange, 300), [city]);
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

    async function moveInput(pred, exit = true, extLoc = null) {
        try {
            setText(pred[0]);

            let loc;
            if (extLoc) {
                loc = extLoc;
            } else {
                loc = (await getLocationFromPlaceId(pred[1]));
            }

            const value = await AsyncStorage.getItem('recent_places');
            let currRecents = [];
            if (value != null) {
                currRecents = JSON.parse(value);
            }
            const index = currRecents.filter((subArr) => subArr[1] === pred[1]);
            if (index.length === 0) {
                currRecents.unshift({ ...pred, city: city });

                if (currRecents.length >= 4) {
                    currRecents.pop();
                }

                AsyncStorage.setItem('recent_places', JSON.stringify(currRecents));
            }

            if (exit) {
                setModalVisible(false);
                handleLocationSelect(
                    loc, pred[0], pred[1], city
                );
            }
            setPredictions(null);
        } catch (e) {
            console.log(e);
        }
    }

    const [currLocation, setCurrLocation] = useState(null);
    useEffect(() => {
        requestLocationPermission().then(result => {
            if (result) {
                Geolocation.getCurrentPosition(
                    info => {
                        if (!city) {
                            return;
                        }
                        const isWithinRadius = geolib.isPointWithinRadius(info.coords, { latitude: appManager.cities[city].latitude, longitude: appManager.cities[city].longitude }, appManager.cities[city].radius);

                        if (isWithinRadius) {
                            setCurrLocation({ lat: info.coords.latitude, lng: info.coords.longitude });
                        } else {
                            setCurrLocation(null);
                        }
                    }
                );
            }
        });
    }, [city])

    async function setCurrentLocation() {
        setText(t('current_location'));
        handleLocationSelect(currLocation, t('current_location'), null, city);
        setPredictions(null);
        setModalVisible(false);
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
            currFavorites.push({ ...prediction, city: city });
        }

        setFavoritePlaces(currFavorites);
        await AsyncStorage.setItem('favorite_places', JSON.stringify(currFavorites));
    }

    function enableModal() {
        setModalVisible(true);
    }

    function cancelAutoComplete() {
        if (city) {
            handleCancelLocationSelect(city);
            setCity('');
            return;
        }

        setText('');
        setPredictions(null);
        setModalVisible(false);
    }

    function Prediction({ prediction }) {
        let color = palette.light;
        if (favoritePlaces) {
            const favoritePlaces_ids = favoritePlaces.map((subArr) => subArr[1]).concat();
            if (favoritePlaces_ids.includes(prediction[1])) {
                color = palette.red;
            }
        }
        return (
            <TouchableOpacity style={styles.predictionBox} onPress={function () { moveInput(prediction) }}>
                <Text style={[styles2.text, { width: '90%' }]}>{prediction[0]}</Text>
                <TouchableOpacity onPress={function () { addToFavorites(prediction) }} style={[{ width: '10%' }]}>
                    <MaterialIcons name="favorite" size={20} color={color} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }


    return (
        <View style={styles2.w100}>
            <CustomTextInput onFocus={enableModal} placeholder={placeholder} value={text} style={inputStyles} iconLeft={type} error={error} />
            <Modal animationType="slide" visible={modalVisible}>
                <SafeAreaView style={[styles2.bgPrimary, styles2.AndroidSafeArea]}>
                    <HeaderView navType="back" screenName={t('enter_location')} borderVisible={false} style={styles2.bgPrimary} action={cancelAutoComplete} >
                        <View style={styles2.localeWrapper}>
                            <MaterialIcons style={styles2.icon} name="language" size={18} color="rgba(255,255,255,255)" />
                            <Text style={[styles2.locale, styles2.text]}>EN</Text>
                        </View>
                    </HeaderView>
                </SafeAreaView>

                <View style={styles.container}>
                    <View style={[styles2.positionAbsolute, styles2.w100, { top: 0, left: 0, zIndex: 5 }]}>
                        <View style={{ width: '100%', zIndex: 4, elevation: 4, backgroundColor: palette.primary, height: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                        </View>

                        {
                            !city &&
                            <Animated.View entering={SlideInLeft} exiting={SlideOutLeft} style={[styles2.defaultContainer, styles2.defaultPadding]}>
                                <>
                                    {
                                        cities.map((city, index) => {
                                            return (
                                                <TouchableOpacity key={`city${index}`} style={styles.predictionBox} onPress={() => setCity(city)}>
                                                    <Text style={[styles2.text, { width: '90%' }]}>
                                                        {
                                                            I18nManager.isRTL ? appManager.cities[city].label_ar : appManager.cities[city].label_en
                                                        }
                                                    </Text>

                                                    <MaterialIcons name="arrow-forward-ios" />
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </>
                            </Animated.View>
                        }

                        {
                            city &&

                            <Animated.View entering={SlideInRight} exiting={SlideOutRight} style={[styles2.defaultContainer, styles2.defaultPadding]}>
                                <>
                                    <CustomTextInput inputRef={inputLocRef} iconLeft="pin-drop" onChangeText={onChangeText} placeholder={placeholder} value={text} />
                                    {!modalMap && predictions &&
                                        <FlatList
                                            data={predictions}
                                            renderItem={({ item }) => <Prediction prediction={item} />}
                                            style={styles.flexOne}
                                        />
                                    }
                                    {!modalMap && !predictions &&
                                        <ScrollView keyboardShouldPersistTaps={"handled"} style={[styles2.flexOne, styles2.w100]}>
                                            <Text style={[styles2.headerText3, styles2.text, { marginTop: 30 }]}>{t('recent_destinations')}</Text>
                                            <View style={[{ flex: 1, marginTop: 10, width: '100%' }]}>
                                                {
                                                    recentPlaces &&
                                                    recentPlaces.map(
                                                        (prediction, index) => {
                                                            if (prediction.city !== city) {
                                                                return (<React.Fragment key={index}></React.Fragment>);
                                                            }
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
                                                            if (prediction.city !== city) {
                                                                return (<React.Fragment key={index}></React.Fragment>);
                                                            }
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


                                            <TouchableOpacity style={styles.alternativeOption} onPress={function () { setModalMap(true) }}>
                                                <MaterialIcons name="place" size={16} color={palette.black} />
                                                <Text style={[styles2.text, styles2.ml10]}>{t('choose_location')}</Text>
                                            </TouchableOpacity>

                                            {currLocation &&
                                                <TouchableOpacity style={styles.alternativeOption} onPress={setCurrentLocation}>
                                                    <MaterialIcons name="my-location" size={16} color={palette.black} />
                                                    <Text style={[styles2.text, styles2.ml10]}>{t('current_location')}</Text>
                                                </TouchableOpacity>
                                            }

                                        </ScrollView>
                                    }
                                </>

                            </Animated.View>
                        }
                    </View>

                    {modalMap && <View style={[styles2.defaultPadding, { position: 'absolute', bottom: 80, left: 0, width: '100%', zIndex: 8 }]}>
                        <Button text={t('choose_location')} bgColor={palette.primary} textColor={palette.white} disabled={chooseLocationDisabled} onPress={function () { moveInput(mapPred, true, { lat: currRegion.current.latitude, lng: currRegion.current.longitude }) }} />
                    </View>}

                    {modalMap &&
                        <MapView
                            style={[styles2.fullCenter, { ...StyleSheet.absoluteFillObject }]}
                            showsUserLocation={true}
                            initialRegion={myLocation.current}
                            onRegionChangeComplete={onChangeRegion}
                            provider={PROVIDER_GOOGLE}
                            ref={mapViewRef}
                            customMapStyle={customMapStyle}
                            mapPadding={{ bottom: 96 * rem, top: 0, left: 0 * rem, right: 0 }}
                            minZoomLevel={6}
                            showsMyLocationButton
                        >
                            <MaterialIcons style={{ marginBottom: (96 + 48) * rem }} name="place" size={48} color={palette.red} />
                            {geojson &&
                                <Geojson
                                    geojson={geojson}
                                    strokeColor="#2e1760"
                                    fillColor="rgba(46,23,96,0.5)"
                                    strokeWidth={2}
                                />
                            }
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
    },
    alternativeOption: {
        flexDirection: 'row',
        height: 48 * rem,
        width: '100%',
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1,
        padding: 5,
        alignItems: 'center'
    }

});


export default memo(AutoComplete);
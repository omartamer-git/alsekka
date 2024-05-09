import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    I18nManager,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import DatePicker from 'react-native-date-picker';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import * as StoreReview from 'react-native-store-review';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import * as carsAPI from '../../api/carsAPI';
import * as communitiesAPI from '../../api/communitiesAPI';
import * as ridesAPI from '../../api/ridesAPI';
import AutoComplete from '../../components/AutoComplete';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import CarCard from '../../components/CarCard';
import CommunityCard from '../../components/CommunityCard';
import Counter from '../../components/Counter';
import CustomTextInput from '../../components/CustomTextInput';
import CustomDatePicker from '../../components/DatePicker';
import SuccessCheck from '../../components/SuccessCheck';
import useAppManager from '../../context/appManager';
import { palette, rem, styles } from '../../helper';
import PiggyBank from '../../svgs/piggybank';
import ScreenWrapper from '../ScreenWrapper';

function PostRide({ route, navigation }) {
    const { t } = useTranslation();

    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const [pricePerSeat, setPricePerSeat] = useState('');
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [carInput, setCarInput] = useState(null);
    const [mainTextFrom, setMainTextFrom] = useState('');
    const placeIdFrom = useRef(null);

    const [mainTextTo, setMainTextTo] = useState('');
    const placeIdTo = useRef(null);

    const [carSelectorOpen, setCarSelectorOpen] = useState(false);
    const [carSelectorText, setCarSelectorText] = useState(t('choose_car'));

    const [communitySelectorOpen, setCommunitySelectorOpen] = useState(false);
    const [communitySelectorText, setCommunitySelectorText] = useState(t('choose_community'));

    const [usableCars, setUsableCars] = useState(null);
    const [communities, setCommunities] = useState(null);

    const [fromTouched, setFromTouched] = useState(false);
    const [toTouched, setToTouched] = useState(false);

    const [ridePosted, setRidePosted] = useState(false);
    const [rideId, setRideId] = useState(null);
    const [pickupEnabled, setPickupEnabled] = useState(false);

    const [advancedOptions, setAdvancedOptions] = useState(false);

    const [genderChoice, setGenderChoice] = useState('ANY');

    const formikRef = useRef(null);

    const { cities, driverFee } = useAppManager();
    const listCities = Object.keys(cities);
    const [citiesFrom, setCitiesFrom] = useState(listCities);
    const [citiesTo, setCitiesTo] = useState(listCities);
    const [suggestedPrice, setSuggestedPrice] = useState(0);

    const userStore = useUserStore();


    const mapViewRef = useRef(null);
    const carPicker = useRef(null);

    const loadCars = function () {
        return carsAPI.getUsableCars();
    };

    const loadCommunities = function () {
        return communitiesAPI.myCommunities();
    };

    function resetData() {
        setMarkerFrom(null);
        setMarkerTo(null);
        setPricePerSeat('');
        setMainTextFrom('');
        setMainTextTo('');
        setSuggestedPrice(0);

        placeIdFrom.current = null;
        placeIdTo.current = null;

        setFromTouched(false);
        setToTouched(false);
        setRideId(null);
        setPickupEnabled(false);
        setAdvancedOptions(false);
        setGenderChoice('ANY');
        setCitiesFrom(listCities);
        setCitiesTo(listCities);
    }

    const loadData = function () {
        if (!userStore.driver) {
            setLoading(false);
            return;
        }
        setLoading(true);
        Promise.all([loadCars(), loadCommunities()])
            .then(([usableCars, communityData]) => {
                setUsableCars(usableCars);
                if (usableCars && usableCars.length > 0) {
                    selectCar(usableCars[0]);
                }

                setCommunities(communityData);
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                // Handle error here
            });
    }

    const onFocusEffect = useCallback(function () {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setEnabled(true);
        return function () {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events    


    useEffect(function () {
        loadData();
    }, []);


    useEffect(function () {
        if (markerFrom && markerTo) {
            ridesAPI.getSuggestedPrice(markerFrom.latitude, markerFrom.longitude, markerTo.latitude, markerTo.longitude).then(data => {
                setSuggestedPrice(parseInt(data.suggestedPrice / 100));
            });
        }
    }, [markerFrom, markerTo])

    function setLocationFrom(loc, mainTextFrom, placeId, city) {
        setFromTouched(true);
        setMarkerFrom({ latitude: loc.lat, longitude: loc.lng });
        setMainTextFrom(mainTextFrom);
        setCitiesTo(listCities.filter(c => c != city));
        placeIdFrom.current = placeId;
    }

    function setLocationTo(loc, mainTextTo, placeId, city) {
        setToTouched(true);
        setMarkerTo({ latitude: loc.lat, longitude: loc.lng });
        setMainTextTo(mainTextTo);
        setCitiesFrom(listCities.filter(c => c != city));
        placeIdTo.current = placeId;
    }

    function cancelLocationFrom(city) {
        const oldCitiesTo = citiesTo;

        if (city && !oldCitiesTo.includes(city)) {
            setCitiesTo([...oldCitiesTo, city])
        }
    }

    function cancelLocationTo(city) {
        const oldCitiesFrom = citiesFrom;

        if (city && !oldCitiesFrom.includes(city)) {
            setCitiesFrom([...oldCitiesFrom, city])
        }
    }

    function selectCar(data) {
        const carSelectorText = `${data.color} ${data.brand} ${data.model} (${data.licensePlateNumbers})`;
        setCarSelectorText(carSelectorText);
        setCarSelectorOpen(false);
        setCarInput(data);
    };

    function selectCommunity(data) {
        const communitySelectorText = data.name;
        setCommunitySelectorText(communitySelectorText);
        setCommunitySelectorOpen(false);
    }

    function postRide(pricePerSeat, pickupPrice, date, time, selectedCar, selectedCommunity, seatsAvailable) {
        if (markerFrom && markerTo) {
            setSubmitDisabled(true);
            const newDateUTC = date.toISOString(); // Convert to UTC string
            const timeInputUTC = time.toISOString(); // Convert to UTC string

            let newDate = new Date(newDateUTC);
            let newTime = new Date(timeInputUTC);

            newDate.setHours(newTime.getHours());
            newDate.setMinutes(newTime.getMinutes());

            if (new Date() >= newDate) {

            }

            ridesAPI.postRide(markerFrom.latitude, markerFrom.longitude, markerTo.latitude, markerTo.longitude,
                placeIdFrom.current, placeIdTo.current, parseInt(parseFloat(pricePerSeat) * 100), pickupEnabled, parseInt(parseFloat(pickupPrice) * 100), newDate, selectedCar.id, selectedCommunity ? selectedCommunity.id : null, genderChoice, seatsAvailable, mainTextFrom, mainTextTo).then((res) => {
                    setRidePosted(true);
                    resetData();
                    setRideId(res.id);
                }).catch(console.error).finally(function () {
                    StoreReview.requestReview();
                    setSubmitDisabled(false);
                });
        }
    }

    async function onShare() {
        const shareMsg = "🚗✨ Save on transportation by joining my carpool on Seaats! Click here: https://seaats.app/share/ride/" + rideId + " Let's ride together and cut costs! 🌍💰"
        const shareMsgAr = "🚗✨ وفر في تكاليف التنقل بالانضمام إلى رحلتي في Seaats! اضغط هنا: https://seaats.app/share/ride/" + rideId + " يلا نشارك الرحلة نوفر في المصاريف! 🌍💰";
        try {
            const result = await Share.share({
                message: I18nManager.isRTL ? shareMsgAr : shareMsg
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (err) {
            console.log(err);
        }
    };

    function onChangePricePerSeat(data) {
        setPricePerSeat(data);
    }

    function handleChangeSeatsAvailable(data) {
        const numeric = data.replace(/[^0-9]/g, '');
        setSeatsAvailable(numeric);
    }

    function handleChangeSeatsOccupied(data) {
        const numeric = data.replace(/[^0-9]/g, '');
        setSeatsOccupied(numeric);
    }

    function handleChangePricePerSeat(data) {
        const numeric = data.replace(/[^0-9]/g, '');
        setPricePerSeat(numeric);
    }

    const postRideSchema = Yup.object().shape({
        dateInput: Yup.date().required(t('error_required')),
        timeInput: Yup.date().required(t('error_required')),
        seatsInput: Yup.number().integer().max(7, t('error_seats')).required(t('error_required')),
        priceInput: Yup.number().required(t('error_required')).min(20, t('error_pickup_price')),
        pickupPriceInput: Yup.number().typeError(t('error_number')).positive('Must be a positive number.').notRequired(),
        communityInput: Yup.object()
    }).test(
        'datetime-validation',
        t('error_datetime'),
        function (values) {
            const newDateUTC = values.dateInput.toISOString(); // Convert to UTC string
            const timeInputUTC = values.timeInput.toISOString(); // Convert to UTC string

            let newDate = new Date(newDateUTC);
            let newTime = new Date(timeInputUTC);

            newDate.setHours(newTime.getHours());
            newDate.setMinutes(newTime.getMinutes());

            const currentDatetime = new Date();

            if (newDate <= currentDatetime) {
                throw new Yup.ValidationError(
                    t('error_datetime'),
                    null,
                    'timeInput'
                );
            }

            return true;
        }
    );

    function navigateDocuments() {
        navigation.navigate("Driver Documents");
    }

    function navigateNewCar() {
        setCarSelectorOpen(false);
        navigation.navigate('New Car')
    }


    let oneHourFromNow = new Date();
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
    oneHourFromNow.setMinutes(0)
    oneHourFromNow.setSeconds(0);

    return (
        <ScreenWrapper screenName={t('post_ride')}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.wrapper} contentContainerStyle={styles.flexGrow}>
                <View style={[styles.bgLightGray, styles.w100, styles.flexGrow, styles.defaultPadding]}>
                    {!userStore.driver &&
                        <View style={[styles.defaultContainer, styles.bgLightGray, styles.w100, styles.fullCenter, { zIndex: 5 }]}>
                            <PiggyBank width={300} height={300} />
                            <Text style={[styles.text, styles.headerText, styles.textCenter]}>{t('get_paid')}</Text>
                            <Text style={[styles.text, styles.textCenter, styles.font18, styles.mt10]}>{t('submit_license')}</Text>
                            <Button bgColor={palette.primary} textColor={palette.white} text={t('cta_submit_driver')} onPress={navigateDocuments} />
                        </View>
                    }
                    {!loading && usableCars && usableCars.length > 0 && userStore.driver &&
                        <>
                            <View style={[styles.defaultContainer, styles.bgLightGray, styles.w100, styles.alignStart, styles.justifyCenter, { zIndex: 5 }]}>
                                <Formik
                                    initialValues={{
                                        dateInput: new Date(),
                                        timeInput: oneHourFromNow,
                                        seatsInput: 1,
                                        priceInput: '',
                                        communityInput: '',
                                        pickupPriceInput: ''
                                    }}
                                    validationSchema={postRideSchema}
                                    onSubmit={(values, { resetForm }) => {
                                        if (!markerFrom || !markerTo) {
                                            setFromTouched(true);
                                            setToTouched(true);
                                            return;
                                        }
                                        postRide(values.priceInput, values.pickupPriceInput, values.dateInput, values.timeInput, carInput, values.communityInput, values.seatsInput);
                                        resetForm();
                                    }}
                                >
                                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, values, errors, isValid, touched }) => (
                                        <>
                                            <Text style={[styles.text, styles.inputText]}>{t('pickup_point')}</Text>
                                            <AutoComplete
                                                key={"autoCompleteFrom" + rideId}
                                                type="my-location"
                                                placeholder={t('from')}
                                                handleLocationSelect={setLocationFrom}
                                                inputStyles={styles.bgWhite}
                                                error={!markerFrom && fromTouched && t('error_required')}
                                                cities={citiesFrom}
                                                handleCancelLocationSelect={cancelLocationFrom}
                                            />

                                            <Text style={[styles.text, styles.inputText]}>{t('destination')}</Text>
                                            <AutoComplete
                                                key={"autoCompleteTo" + rideId}
                                                type="place"
                                                placeholder={t('to')}
                                                handleLocationSelect={setLocationTo}
                                                inputStyles={styles.bgWhite}
                                                error={!markerTo && toTouched && t('error_required')}
                                                cities={citiesTo}
                                                handleCancelLocationSelect={cancelLocationTo}
                                            />

                                            <Text style={[styles.text, styles.inputText]}>{t('date')}</Text>

                                            <CustomDatePicker date={values.dateInput} setDate={(newDate) => { setFieldValue('dateInput', newDate) }} />

                                            <Text style={[styles.text, styles.inputText]}>{t('time')}</Text>

                                            <CustomTextInput
                                                placeholder={t('time')}
                                                value={values.timeInput.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                textColor={palette.black}
                                                onPressIn={function () {
                                                    setFieldTouched('timeInput', true);
                                                    setTimePickerOpen(true)
                                                }}
                                                role="button"
                                                onBlur={handleBlur('timeInput')}
                                                iconRight="schedule"
                                                editable={false}
                                                error={touched.timeInput && errors.timeInput}
                                            />

                                            <DatePicker
                                                modal
                                                mode="time"
                                                open={timePickerOpen}
                                                date={values.timeInput}
                                                onConfirm={(time) => {
                                                    setTimePickerOpen(false);
                                                    time.setSeconds(0);
                                                    time.setMilliseconds(0);
                                                    setFieldValue('timeInput', time);
                                                }}
                                                onCancel={function () {
                                                    setTimePickerOpen(false)
                                                }}
                                            />


                                            <Text style={[styles.text, styles.inputText]}>{t('seats_available')}</Text>

                                            <Counter
                                                counter={values.seatsInput}
                                                text={t("seat")}
                                                textPlural={t("seats")}
                                                setCounter={(f) => {
                                                    setFieldValue('seatsInput', f(values.seatsInput));
                                                }}
                                                min={1}
                                                max={4}
                                            />

                                            <Text style={[styles.text, styles.inputText]}>{t('price_per_seat')}</Text>

                                            <View style={[styles.flexRow, styles.w100]}>

                                                <View style={{ flex: 2 }}>
                                                    <CustomTextInput
                                                        keyboardType='numeric'
                                                        placeholder={t('price_one_seat')}
                                                        value={values.priceInput}
                                                        onChangeText={handleChange('priceInput')}
                                                        onBlur={handleBlur('priceInput')}
                                                        error={touched.priceInput && errors.priceInput}
                                                        iconLeft="attach-money"
                                                        style={{ borderBottomEndRadius: 0, borderTopEndRadius: 0 }}
                                                    />
                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => setFieldValue('priceInput', suggestedPrice.toString())}
                                                    activeOpacity={0.9}
                                                    style={[styles.flexOne, styles.bgPrimary, { height: 48 * rem, marginTop: 8 * rem, marginBottom: 8 * rem, padding: 6 * rem, borderTopEndRadius: 4 * rem, borderBottomEndRadius: 4 * rem }]}>
                                                    <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, styles.white, styles.bold, { fontSize: 10 * rem }]}>{t('suggested_price')}</Text>
                                                    <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.text, styles.white, styles.bold, styles.font18, styles.mt5]}>{suggestedPrice} {t('EGP')}</Text>
                                                </TouchableOpacity>

                                            </View>


                                            {values.priceInput && driverFee !== 0 &&
                                                <Text style={[styles.text, styles.dark, styles.bold]}>{t('your_share')} {Math.ceil(((1 - driverFee) * values.priceInput))} {t('EGP')}</Text>
                                            }

                                            {
                                                driverFee !== 0 && values.priceInput &&
                                                <Text style={[styles.text, styles.dark, styles.bold]}>{t('service_fees')}{Math.floor(driverFee * values.priceInput)} {t('EGP')} ({driverFee * 100}%)</Text>
                                            }


                                            
                                            { /* TEMPORARILY DISABLED, TODO: RE-ENABLE PROPERLY */}

                                            {/* <Text style={[styles.text, styles.inputText]}>{t('allow_pickup')}</Text>

                                            <View style={[styles.flexRow, styles.w100, styles.mv10]}>
                                                <TouchableOpacity onPress={function () { setPickupEnabled(true) }} activeOpacity={0.9} style={[postRideStyles.genderButton, { backgroundColor: pickupEnabled ? palette.secondary : palette.dark }]}>
                                                    <Text style={[styles.text, postRideStyles.genderText]}>{t('yes')}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={function () { setPickupEnabled(false) }} activeOpacity={0.9} style={[postRideStyles.genderButton, { backgroundColor: !pickupEnabled ? palette.secondary : palette.dark }]}>
                                                    <Text style={[styles.text, postRideStyles.genderText]}>{t('no')}</Text>
                                                </TouchableOpacity>
                                            </View> */}

                                            {
                                                pickupEnabled &&
                                                <>
                                                    <Text style={[styles.text, styles.dark, { textAlign: 'left' }]}>{t('pickup_range')}</Text>

                                                    <Text style={[styles.text, styles.inputText]}>{t('pickup_price')}</Text>
                                                    <CustomTextInput
                                                        value={values.pickupPriceInput}
                                                        iconLeft="attach-money"
                                                        placeholder={`${t('pickup_price')} ${t('pickup_price_placeholder')}`}
                                                        onChangeText={handleChange('pickupPriceInput')}
                                                        onBlur={handleBlur('pickupPriceInput')}
                                                        error={touched.pickupPriceInput && errors.pickupPriceInput}
                                                    />
                                                </>
                                            }

                                            <TouchableWithoutFeedback onPress={() => setAdvancedOptions(a => !a)}>
                                                <View style={[styles.w100, styles.pv8]}>
                                                    <Text style={[styles.text, styles.primary, styles.bold, styles.textCenter]}>
                                                        {!advancedOptions && t('show_advanced_options')}
                                                        {advancedOptions && t('hide_advanced_options')}
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>


                                            {
                                                (advancedOptions || !carInput || errors.communityInput) &&
                                                <>
                                                    <Text style={[styles.text, styles.inputText]}>{t('select_car')}</Text>

                                                    <CustomTextInput
                                                        placeholder={t('select_car')}
                                                        value={carSelectorText}
                                                        onPressIn={function () {
                                                            setCarSelectorOpen(true);
                                                        }}
                                                        role="button"
                                                        iconLeft="directions-car"
                                                        editable={false}
                                                        error={!carInput && t('error_required')}
                                                    />


                                                    <Text style={[styles.text, styles.inputText]}>{t('gender_to_carpool')}</Text>

                                                    <View style={[styles.flexRow, styles.w100, styles.mv10]}>
                                                        {
                                                            userStore.gender === "FEMALE" &&
                                                            <TouchableOpacity onPress={function () { setGenderChoice('FEMALE') }} activeOpacity={0.9} style={[postRideStyles.genderButton, { backgroundColor: genderChoice === 'FEMALE' ? palette.primary : palette.gray }]}>
                                                                <Text style={[styles.text, postRideStyles.genderText]}>{t('female_only')}</Text>
                                                            </TouchableOpacity>
                                                        }
                                                        <TouchableOpacity onPress={function () { setGenderChoice('ANY') }} activeOpacity={0.9} style={[postRideStyles.genderButton, { backgroundColor: genderChoice === 'ANY' ? palette.primary : palette.gray }]}>
                                                            <Text style={[styles.text, postRideStyles.genderText]}>{t('any')}</Text>
                                                        </TouchableOpacity>
                                                        {
                                                            userStore.gender === "MALE" &&
                                                            <TouchableOpacity onPress={function () { setGenderChoice('MALE') }} activeOpacity={0.9} style={[postRideStyles.genderButton, { backgroundColor: genderChoice === 'MALE' ? palette.primary : palette.gray }]}>
                                                                <Text style={[styles.text, postRideStyles.genderText]}>{t('male_only')}</Text>
                                                            </TouchableOpacity>
                                                        }
                                                    </View>


                                                    <Text style={[styles.text, styles.inputText]}>{t('post_to_community')}</Text>
                                                    <CustomTextInput
                                                        placeholder={t('select_community')}
                                                        value={communitySelectorText}
                                                        onPressIn={function () {
                                                            setFieldTouched('communityInput', true)
                                                            setCommunitySelectorOpen(true);
                                                        }}
                                                        role="button"
                                                        iconLeft="chat"
                                                        editable={false}
                                                        error={touched.communityInput && errors.communityInput}
                                                    />
                                                </>
                                            }

                                            <BottomModal onHide={() => setCommunitySelectorOpen(false)} modalVisible={communitySelectorOpen}>
                                                {communities && communities.map((data, index) => {
                                                    return (
                                                        <CommunityCard
                                                            key={"community" + index}
                                                            name={data.name}
                                                            picture={data.picture}
                                                            minified={true}
                                                            onPress={function () {
                                                                setFieldValue('communityInput', data);
                                                                handleBlur('communityInput');
                                                                selectCommunity(data);
                                                            }}
                                                            style={[styles.mv5]}
                                                        />
                                                    );
                                                })}
                                            </BottomModal>

                                            <BottomModal onHide={function () { setRidePosted(false); navigation.goBack(); }} modalVisible={ridePosted}>
                                                <View style={[styles.flexOne, styles.w100, styles.fullCenter]}>
                                                    <SuccessCheck width={100} height={100} />
                                                    <Text style={[styles.text, styles.headerText3, styles.primary, styles.freeSans]}>{t('ride_posted')}</Text>
                                                    <Text style={[styles.text, styles.smallText, styles.primary]}>{t('ride_post_thanks')}</Text>
                                                    <Button onPress={onShare} bgColor={palette.secondary} textColor={palette.white} text={t('share_ride_link')} />
                                                </View>
                                            </BottomModal>

                                            <BottomModal onHide={() => setCarSelectorOpen(false)} modalVisible={carSelectorOpen}>

                                                {usableCars && usableCars.map((data, index) => {
                                                    return (
                                                        <CarCard
                                                            approved={data.status}
                                                            brand={data.brand}
                                                            model={data.model}
                                                            year={data.year}
                                                            color={data.color}
                                                            licensePlateLetters={data.licensePlateLetters}
                                                            licensePlateNumbers={data.licensePlateNumbers}
                                                            onPress={function () {
                                                                setCarInput(data);
                                                                handleBlur('carInput');
                                                                selectCar(data);
                                                            }}
                                                            key={"car" + index} />
                                                    );
                                                })}

                                                <TouchableOpacity onPress={navigateNewCar} style={[styles.w100, styles.p16, styles.flexRow, styles.alignCenter, { height: 60 * rem }]}>
                                                    <MaterialIcons name="add" size={18} color={palette.black} />
                                                    <Text style={[styles.text, { fontSize: 14, fontWeight: '600' }]}>{t('add_new_car')}</Text>
                                                </TouchableOpacity>
                                            </BottomModal>




                                            <Button text={t('post_ride')} bgColor={palette.primary} textColor={palette.white} disabled={submitDisabled} onPress={handleSubmit} />
                                        </>)}
                                </Formik>
                            </View>
                        </>
                    }
                    {!loading && usableCars && usableCars.length === 0 && userStore.driver &&
                        <>
                            <View style={[styles.defaultContainer, styles.bgLightGray, styles.w100, styles.alignCenter, styles.justifyCenter, { zIndex: 5 }]}>
                                <Text style={[styles.text, styles.textCenter]}>
                                    {t('disclaimer_car')}
                                </Text>
                                <Button onPress={navigateNewCar} bgColor={palette.primary} textColor={palette.white} text={t('add_new_car')} />
                            </View>
                        </>
                    }
                    {loading &&
                        <>
                            <View style={styles.w100}>
                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={20 * rem} marginTop={15 * rem} marginBottom={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginTop={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={20 * rem} marginTop={15 * rem} marginBottom={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginTop={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={20 * rem} marginTop={15 * rem} marginBottom={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginTop={5 * rem} />
                                </SkeletonPlaceholder>


                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={20 * rem} marginTop={15 * rem} marginBottom={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginTop={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={20 * rem} marginTop={15 * rem} marginBottom={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginTop={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={20 * rem} marginTop={15 * rem} marginBottom={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginTop={5 * rem} />
                                </SkeletonPlaceholder>
                            </View>
                        </>
                    }

                </View>
            </ScrollView>
        </ScreenWrapper>

    );
};

const postRideStyles = StyleSheet.create({
    genderButton: {
        ...styles.flexOne,
        ...styles.fullCenter,
        height: 48 * rem,
    },

    genderText: {
        ...styles.white,
        ...styles.bold
    }
});

export default memo(PostRide);
import { useFocusEffect } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import DatePicker from 'react-native-date-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Yup from 'yup';
import useUserStore from '../../api/accountAPI';
import * as communitiesAPI from '../../api/communitiesAPI';
import * as carsAPI from '../../api/carsAPI';
import * as ridesAPI from '../../api/ridesAPI';
import AutoComplete from '../../components/AutoComplete';
import BottomModal from '../../components/BottomModal';
import Button from '../../components/Button';
import CarCard from '../../components/CarCard';
import CustomTextInput from '../../components/CustomTextInput';
import { palette, rem, styles } from '../../helper';
import PiggyBank from '../../svgs/piggybank';
import ScreenWrapper from '../ScreenWrapper';
import CommunityCard from '../../components/CommunityCard';
import { useTranslation } from 'react-i18next';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PostRide = ({ route, navigation }) => {
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const [pricePerSeat, setPricePerSeat] = useState('');
    const [timePickerOpen, setTimePickerOpen] = useState(false);
    const [datePickerOpen, setDatePickerOpen] = useState(false);

    const [mainTextFrom, setMainTextFrom] = useState('');
    const [mainTextTo, setMainTextTo] = useState('');

    const [carSelectorOpen, setCarSelectorOpen] = useState(false);
    const [carSelectorText, setCarSelectorText] = useState('Choose a car..');

    const [communitySelectorOpen, setCommunitySelectorOpen] = useState(false);
    const [communitySelectorText, setCommunitySelectorText] = useState('Choose a community..');

    const [usableCars, setUsableCars] = useState(null);
    const [communities, setCommunities] = useState(null);

    const [fromTouched, setFromTouched] = useState(false);
    const [toTouched, setToTouched] = useState(false);

    const [genderChoice, setGenderChoice] = useState('ANY');

    const userStore = useUserStore();


    const mapViewRef = useRef(null);
    const carPicker = useRef(null);

    const loadCars = () => {
        return carsAPI.getUsableCars();
    };

    const loadCommunities = () => {
        return communitiesAPI.myCommunities();
    };

    const loadData = () => {
        if (!userStore.driver) {
            setLoading(false);
            return;
        }
        setLoading(true);
        Promise.all([loadCars(), loadCommunities()])
            .then(([usableCars, communityData]) => {
                setUsableCars(usableCars);
                setCommunities(communityData);
                setLoading(false);
            })
            .catch(error => {
                // Handle error here
            });
    }

    if (Platform.OS === 'ios') {
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


    useEffect(() => {
        loadData();
    }, []);



    const setLocationFrom = (loc, mainTextFrom) => {
        setFromTouched(true);
        setMarkerFrom({ latitude: loc.lat, longitude: loc.lng });
        setMainTextFrom(mainTextFrom);
    }

    const setLocationTo = (loc, mainTextTo) => {
        setToTouched(true);
        setMarkerTo({ latitude: loc.lat, longitude: loc.lng });
        setMainTextTo(mainTextTo);
    }

    const selectCar = (data) => {
        // setSelectedCar(data);
        const carSelectorText = `${data.color} ${data.brand} ${data.model} (${data.licensePlateNumbers})`;
        setCarSelectorText(carSelectorText);
        setCarSelectorOpen(false);
    };

    const selectCommunity = (data) => {
        const communitySelectorText = data.name;
        setCommunitySelectorText(communitySelectorText);
        setCommunitySelectorOpen(false);
    }

    const postRide = (pricePerSeat, date, time, selectedCar, selectedCommunity, seatsAvailable) => {
        setSubmitDisabled(true);
        if (markerFrom && markerTo) {
            let newDate = date;
            newDate.setHours(time.getHours());
            newDate.setMinutes(time.getMinutes());

            console.log(newDate);

            ridesAPI.postRide(markerFrom.latitude, markerFrom.longitude, markerTo.latitude, markerTo.longitude,
                mainTextFrom, mainTextTo, pricePerSeat, newDate, selectedCar.id, selectedCommunity ? selectedCommunity : null, genderChoice, seatsAvailable).then(() => {
                    navigation.goBack();
                }).catch(console.error).finally(() => {
                    setSubmitDisabled(false);
                });
        }
        setSubmitDisabled(false);
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

    const postRideSchema = Yup.object().shape({
        dateInput: Yup.date().required('This field is required'),
        timeInput: Yup.date().required('This field is required'),
        carInput: Yup.object().required('This field is required'),
        seatsInput: Yup.number().integer().max(7, 'Too many seats available').required('This field is required'),
        priceInput: Yup.number().required('This field is required').min(20, "Price should be at least 20 EGP"),
        communityInput: Yup.object()
    });

    const isDarkMode = useColorScheme === 'dark';

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('post_ride')} navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={styles.wrapper} contentContainerStyle={styles.flexGrow}>
                <View style={[styles.bgLightGray, styles.w100, styles.flexGrow, styles.defaultPadding]}>
                    {!loading &&
                        <>
                            {userStore.driver &&
                                <View style={[styles.defaultContainer, styles.bgLightGray, styles.w100, styles.alignStart, styles.justifyCenter, { zIndex: 5 }]}>
                                    <Formik
                                        initialValues={{
                                            dateInput: new Date(),
                                            timeInput: new Date(),
                                            carInput: '',
                                            seatsInput: '',
                                            priceInput: '',
                                            communityInput: ''
                                        }}
                                        validationSchema={postRideSchema}
                                        onSubmit={(values) => {
                                            postRide(values.priceInput, values.dateInput, values.timeInput, values.carInput, values.communityInput, values.seatsInput);
                                        }}
                                    >
                                        {({ handleChange, handleBlur, handleSubmit, setFieldValue, setFieldTouched, values, errors, isValid, touched }) => (
                                            <>
                                                <Text style={styles.inputText}>{t('pickup_point')}</Text>
                                                <AutoComplete
                                                    key="autoCompleteFrom"
                                                    type="my-location"
                                                    placeholder={t('from')}
                                                    handleLocationSelect={setLocationFrom}
                                                    inputStyles={styles.bgWhite}
                                                    error={!markerFrom && fromTouched && "This field is required"}
                                                />

                                                <Text style={styles.inputText}>{t('destination')}</Text>
                                                <AutoComplete
                                                    key="autoCompleteTo"
                                                    type="place"
                                                    placeholder={t('to')}
                                                    handleLocationSelect={setLocationTo}
                                                    inputStyles={styles.bgWhite}
                                                    error={!markerTo && toTouched && "This field is required"}
                                                />

                                                <DatePicker
                                                    modal
                                                    mode="date"
                                                    open={datePickerOpen}
                                                    date={values.dateInput ? new Date(values.dateInput) : new Date()}
                                                    onConfirm={(date) => {
                                                        setDatePickerOpen(false);
                                                        setFieldValue('dateInput', date);
                                                    }}
                                                    onCancel={() => {
                                                        setDatePickerOpen(false)
                                                    }}
                                                />

                                                <Text style={styles.inputText}>{t('date')}</Text>

                                                <CustomTextInput
                                                    placeholder={t('date')}
                                                    value={values.dateInput ? values.dateInput.toDateString() : new Date().toDateString()}
                                                    onBlur={handleBlur('dateInput')}
                                                    textColor={palette.black}
                                                    onPressIn={() => {
                                                        setFieldTouched('dateInput', true);
                                                        setDatePickerOpen(true);
                                                    }}
                                                    iconRight="date-range"
                                                    editable={false}
                                                    error={touched.dateInput && errors.dateInput}
                                                />

                                                <Text style={styles.inputText}>{t('time')}</Text>

                                                <CustomTextInput
                                                    placeholder={t('time')}
                                                    value={values.timeInput.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    textColor={palette.black}
                                                    onPressIn={() => {
                                                        setFieldTouched('timeInput', true);
                                                        setTimePickerOpen(true)
                                                    }}
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
                                                    onCancel={() => {
                                                        setTimePickerOpen(false)
                                                    }}
                                                />

                                                <Text style={styles.inputText}>{t('select_car')}</Text>

                                                <CustomTextInput
                                                    placeholder={t('select_car')}
                                                    value={carSelectorText}
                                                    onPressIn={() => {
                                                        setFieldTouched('carInput', true)
                                                        setCarSelectorOpen(true);
                                                    }}
                                                    iconLeft="directions-car"
                                                    editable={false}
                                                    error={touched.carInput && errors.carInput}
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
                                                                onPress={() => {
                                                                    setFieldValue('carInput', data);
                                                                    handleBlur('carInput');
                                                                    selectCar(data);
                                                                }}
                                                                key={"car" + index} />
                                                        );
                                                    })}

                                                    <TouchableOpacity onPress={() => { setCarSelectorOpen(false); navigation.navigate("New Car") }} style={{ width: '100%', height: 60 * rem, padding: 16 * rem, ...styles.flexRow, alignItems: 'center' }}>
                                                        <MaterialIcons name="add" size={18} color={palette.black} />
                                                        <Text style={{ fontSize: 14, fontWeight: '600' }}>{t('add_new_car')}</Text>
                                                    </TouchableOpacity>
                                                </BottomModal>

                                                <Text style={styles.inputText}>{t('seats_available')}</Text>

                                                <CustomTextInput
                                                    placeholder={t('num_empty_seats')}
                                                    value={values.seatsInput}
                                                    onChangeText={handleChange('seatsInput')}
                                                    onBlur={handleBlur('seatsInput')}
                                                    error={touched.seatsInput && errors.seatsInput}
                                                    iconLeft="groups"
                                                />

                                                <Text style={styles.inputText}>{t('price_per_seat')}</Text>

                                                <CustomTextInput
                                                    placeholder={t('price_one_seat')}
                                                    value={values.priceInput}
                                                    onChangeText={handleChange('priceInput')}
                                                    onBlur={handleBlur('priceInput')}
                                                    error={touched.priceInput && errors.priceInput}
                                                    iconLeft="attach-money"
                                                />

                                                <Text style={[styles.dark, styles.bold]}>{t('your_share')} {Math.ceil(0.9 * values.priceInput)} EGP</Text>
                                                <Text style={[styles.dark, styles.bold]}>{t('service_fees')}{Math.floor(0.1 * values.priceInput)} EGP (10%)</Text>


                                                <Text style={styles.inputText}>{t('gender_to_carpool')}</Text>

                                                <View style={[styles.flexRow, styles.w100, styles.mv10]}>
                                                    {
                                                        userStore.gender === "FEMALE" &&
                                                        <TouchableOpacity onPress={() => { setGenderChoice('FEMALE') }} activeOpacity={0.9} style={[postRideStyles.genderButton, { backgroundColor: genderChoice === 'FEMALE' ? palette.primary : palette.dark }]}>
                                                            <Text style={postRideStyles.genderText}>{t('female_only')}</Text>
                                                        </TouchableOpacity>
                                                    }
                                                    <TouchableOpacity onPress={() => { setGenderChoice('ANY') }} activeOpacity={0.9} style={[postRideStyles.genderButton, { backgroundColor: genderChoice === 'ANY' ? palette.primary : palette.dark }]}>
                                                        <Text style={postRideStyles.genderText}>{t('any')}</Text>
                                                    </TouchableOpacity>
                                                    {
                                                        userStore.gender === "MALE" &&
                                                        <TouchableOpacity onPress={() => { setGenderChoice('MALE') }} activeOpacity={0.9} style={[postRideStyles.genderButton, { backgroundColor: genderChoice === 'MALE' ? palette.primary : palette.dark }]}>
                                                            <Text style={postRideStyles.genderText}>{t('male_only')}</Text>
                                                        </TouchableOpacity>
                                                    }
                                                </View>


                                                <Text style={styles.inputText}>{t('post_to_community')}</Text>
                                                <CustomTextInput
                                                    placeholder={t('select_community')}
                                                    value={communitySelectorText}
                                                    onPressIn={() => {
                                                        setFieldTouched('communityInput', true)
                                                        setCommunitySelectorOpen(true);
                                                    }}
                                                    iconLeft="chat"
                                                    editable={false}
                                                    error={touched.communityInput && errors.communityInput}
                                                />

                                                <BottomModal onHide={() => setCommunitySelectorOpen(false)} modalVisible={communitySelectorOpen}>
                                                    {communities && communities.map((data, index) => {
                                                        console.log(data);
                                                        return (
                                                            <CommunityCard
                                                                key={"community" + index}
                                                                name={data.name}
                                                                picture={data.picture}
                                                                minified={true}
                                                                onPress={() => {
                                                                    setFieldValue('communityInput', data);
                                                                    handleBlur('communityInput');
                                                                    selectCommunity(data);
                                                                }}
                                                            />
                                                        );
                                                    })}
                                                </BottomModal>



                                                <Button text={t('post_ride')} bgColor={palette.primary} textColor={palette.white} disabled={submitDisabled} onPress={handleSubmit} />
                                            </>
                                        )}


                                    </Formik>
                                </View>
                            }
                            {!userStore.driver &&
                                <View style={[styles.defaultContainer, styles.bgLightGray, styles.w100, styles.fullCenter, { zIndex: 5 }]}>
                                    <PiggyBank width={300} height={300} />
                                    <Text style={[styles.headerText, styles.textCenter]}>{t('get_paid')}</Text>
                                    <Text style={[styles.textCenter, styles.font18, styles.mt10]}>{t('submit_license')}</Text>
                                    <Button bgColor={palette.primary} textColor={palette.white} text={t('cta_submit_driver')} onPress={() => navigation.navigate("Driver Documents")} />
                                </View>
                            }

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

export default PostRide;
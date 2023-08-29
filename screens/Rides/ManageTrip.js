import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ridesAPI from '../../api/ridesAPI';
import Passenger from '../../components/Passenger';
import { containerStyle, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


const ManageTrip = ({ route, navigation }) => {
    const { tripId } = route.params;

    const isDarkMode = useColorScheme === 'dark';
    const [tripDetails, setTripDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    useEffect(() => {
        setLoading(true);
        ridesAPI.tripDetails(tripId).then(data => {
            if (data.isDriver === 1) {
                setTripDetails(data);
            }
            setLoading(false);
        });
    }, []);

    const checkIn = (passengerId) => {
        Alert.alert('Check In', 'By clicking CONFIRM, you confirm that the passenger has gotten in the car and is ready for the trip.',
            [
                {
                    text: 'Cancel',
                    style: 'Cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => checkInConfirmed(passengerId)
                }
            ]);
    };

    const checkInConfirmed = (passengerId) => {
        setSubmitDisabled(true);
        ridesAPI.checkPassengerIn(passengerId, tripId).then(data => {
            navigation.goBack();
        }).catch(console.error).finally(() => {
            setSubmitDisabled(false);
        });
    }

    const checkOut = (passengerId) => {
        navigation.navigate("Checkout", { tripId: tripId, passengerId: passengerId });
    };

    const noShow = (passengerId) => {
        Alert.alert('No Show', 'By clicking CONFIRM, you confirm that the passenger has not showed up on time for the ride, and you are going to leave without them.',
            [
                {
                    text: 'Cancel',
                    style: 'Cancel'
                },
                {
                    text: 'Confirm',
                    onPress: () => noShowConfirmed(passengerId)
                }
            ]);
    };

    const noShowConfirmed = (passengerId) => {
        ridesAPI.noShow(passengerId, tripId).then(data => {
            if (data) {
                // set no show
            }
        });
    };

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('manage_trip')} navType={"back"} navAction={() => navigation.goBack()}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    !loading &&
                    <>
                        <View style={[styles.w100, styles.border1, styles.borderLight, styles.br8]}>
                            {tripDetails &&
                                tripDetails.passengers.map((data, index) => {
                                    let borderTopWidth = 1;
                                    if (index == 0) {
                                        borderTopWidth = 0;
                                    }
                                    return (
                                        <Passenger key={"passenger" + index} borderTopWidth={borderTopWidth} data={data}>
                                            {
                                                data.status === 'CONFIRMED' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={() => { console.log(data.UserId); checkIn(data.UserId) }} style={[manageTripStyles.manageBtn, styles.bgSecondary]} activeOpacity={0.9}>
                                                    <Text style={manageTripStyles.manageBtnText}>{t('check_in')}</Text>
                                                </TouchableOpacity>
                                            }
                                            {
                                                data.status === 'CONFIRMED' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={() => { noShow(data.UserId) }} style={[manageTripStyles.manageBtn, styles.ml5, styles.bgRed]} activeOpacity={0.9}>
                                                    <MaterialIcons name="close" size={14} color={palette.white} />
                                                </TouchableOpacity>
                                            }
                                            {
                                                data.status === 'ENROUTE' &&
                                                <TouchableOpacity disabled={submitDisabled} onPress={() => { checkOut(data.UserId) }} style={[manageTripStyles.manageBtn, styles.bgSuccess]} activeOpacity={0.9}>
                                                    <Text style={manageTripStyles.manageBtnText}>{t('check_out')}</Text>
                                                </TouchableOpacity>
                                            }
                                        </Passenger>
                                    );
                                })
                            }
                        </View>

                    </>
                }

                {
                    loading &&
                    <>
                        <View style={styles.w100}>
                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>

                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>


                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>


                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>


                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>


                            <SkeletonPlaceholder>
                                <SkeletonPlaceholder.Item height={70 * rem} marginVertical={8 * rem} />
                            </SkeletonPlaceholder>

                        </View>
                    </>
                }
            </ScrollView>
        </ScreenWrapper >
    );
};

const manageTripStyles = StyleSheet.create({
    manageBtn: {
        ...styles.fullCenter,
        ...styles.p8,
        ...styles.br8,
    },

    manageBtnText: {
        ...styles.bold,
        ...styles.white
    }
});


export default ManageTrip;
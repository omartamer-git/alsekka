import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';


import { ScrollView, TouchableOpacity } from 'react-native';


import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { View } from 'react-native';
import { palette, rem, styles, translatedFormat } from '../helper';

import { Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import BottomModal from './BottomModal';
import '../locale/translate';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import { dismissPassengerPendingRatings, submitPassengerRatings } from '../api/ridesAPI';


export default function PendingRatingsModal({ pendingRatings }) {
    const { driver, passengers, ride } = pendingRatings;
    const [ratings, setRatings] = useState([]);
    const [modalVisible, setModalVisible] = useState(true);

    const { t } = useTranslation();

    useEffect(() => {
        console.log(pendingRatings);
        let ratingsArray = passengers.map((passenger, index) => {
            return {
                id: passenger.id,
                stars: 5
            }
        });

        let driverRating = {
            id: driver.id,
            stars: 5
        };


        ratingsArray = [driverRating].concat(ratingsArray);
        ratingsArray.find(r => r.id == 5);
        setRatings(ratingsArray);
    }, []);

    function setRating(UserId, stars) {
        const newRatings = ratings.filter((r) => r.id !== UserId);
        newRatings.push({
            id: UserId,
            stars: stars
        });
        setRatings(newRatings);
    }


    function dismissPendingRatings() {
        setModalVisible(false);
        dismissPassengerPendingRatings();
    }

    function submitRatings() {
        submitPassengerRatings(ride.id, ratings);
        setModalVisible(false);
    }

    if (ratings.length == 0) return <></>

    return (
        <>
            <BottomModal extended={passengers.length > 1} modalVisible={modalVisible} onHide={dismissPendingRatings} contentContainerStyle={[styles.fullCenter, styles.gap5, styles.p8]}>
                <Text style={[styles.headerText3, styles.alignStart]}>
                    {t('ratings')}
                </Text>
                <Text style={[styles.text, styles.textCenter]}>
                    {translatedFormat(t('ratings_passengers'), [ride.mainTextTo.split(',')[0]])}
                </Text>


                <View key={`reviewsdriver}`} style={[styles.flexRow, styles.alignCenter, styles.justifyCenter, styles.w100, styles.borderLight, styles.pv8, { borderTopWidth: 0 }]}>
                    <View style={[styles.border2, styles.fullCenter, { height: 75 * rem, width: 75 * rem, borderRadius: 75 * rem / 2 }]}>
                        <FastImage source={{ uri: driver.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
                    </View>
                    <View style={[styles.ml10]}>
                        <Text style={[styles.boldText, styles.font18]}>
                            {
                                driver.firstName
                            }
                            &nbsp;
                            {
                                driver.lastName
                            }
                        </Text>

                        <View style={[styles.flexRow]}>
                            {
                                Array.from({ length: ratings.find(r => r.id === driver.id).stars }, (_, index2) => (
                                    <TouchableOpacity onPress={() => setRating(driver.id, index2 + 1)} key={"ratingStarPassenger" + index2 + "_" + driver.id}>
                                        <MaterialIcons name="star" size={30} color={palette.accent} />
                                    </TouchableOpacity>
                                ))
                            }

                            {
                                Array.from({ length: (5 - (ratings.find(r => r.id === driver.id).stars)) }, (_, index2) => (
                                    <TouchableOpacity onPress={() => setRating(driver.id, ratings.find(r => r.id === driver.id).stars + index2 + 1)} key={"ratingStarPassenger" + (ratings.find(r => r.id === driver.id).stars + index2) + "_" + driver.id}>
                                        <MaterialIcons name="star" size={30} color={palette.light} />
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                    </View>
                </View>

                {
                    pendingRatings.passengers.map((passenger, index) => {
                        return (
                            <View key={`reviews${index}`} style={[styles.flexRow, styles.alignCenter, styles.justifyCenter, styles.w100, styles.borderLight, styles.pv8, { borderTopWidth: 0 }]}>
                                <View style={[styles.border2, styles.fullCenter, { height: 75 * rem, width: 75 * rem, borderRadius: 75 * rem / 2 }]}>
                                    <FastImage source={{ uri: passenger.profilePicture }} style={[styles.border2, styles.borderWhite, { height: 70, width: 70, resizeMode: 'cover', borderRadius: 70 / 2 }]} />
                                </View>
                                <View style={[styles.ml10]}>
                                    <Text style={[styles.boldText, styles.font18]}>
                                        {
                                            passenger.firstName
                                        }
                                        &nbsp;
                                        {
                                            passenger.lastName
                                        }
                                    </Text>

                                    <View style={[styles.flexRow]}>
                                        {
                                            Array.from({ length: ratings.find(r => r.id === passenger.id).stars }, (_, index2) => (
                                                <TouchableOpacity onPress={() => setRating(passenger.id, index2 + 1)} key={"ratingStarPassenger" + index2 + "_" + passenger.id}>
                                                    <MaterialIcons name="star" size={30} color={palette.accent} />
                                                </TouchableOpacity>
                                            ))
                                        }

                                        {
                                            Array.from({ length: (5 - (ratings.find(r => r.id === passenger.id).stars)) }, (_, index2) => (
                                                <TouchableOpacity onPress={() => setRating(passenger.id, ratings.find(r => r.id === passenger.id).stars + index2 + 1)} key={"ratingStarPassenger" + (ratings.find(r => r.id === passenger.id).stars + index2) + "_" + passenger.id}>
                                                    <MaterialIcons name="star" size={30} color={palette.light} />
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }

                <View style={[styles.flexOne]}>

                </View>

                <Button onPress={submitRatings} text={t('submit')} bgColor={palette.primary} textColor={palette.white} />
            </BottomModal>
        </>
    )
}
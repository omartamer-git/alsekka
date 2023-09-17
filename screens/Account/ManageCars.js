import React, { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as carsAPI from '../../api/carsAPI';
import Button from '../../components/Button';
import CarCard from '../../components/CarCard';
import { containerStyle, palette, rem, styles } from '../../helper';
import CarImage from '../../svgs/car';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ManageCars = ({ route, navigation }) => {
    const [cars, setCars] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        carsAPI.getUsableCars(0).then((newCars) => {
            setCars(newCars);
            setLoading(false);
        }).catch((error) => console.log(error));
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('manage_cars')} navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {
                    !loading &&
                    <>
                        {cars && cars.length > 0 &&
                            <View style={[styles.flexOne, styles.w100]}>
                                <View style={[styles.alignEnd, styles.w100, styles.mt10]}>
                                    <TouchableOpacity onPress={() => navigation.navigate('New Car')} style={[styles.bgLightGray, styles.borderSecondary, styles.border2, styles.p24, styles.pv8, styles.br24, styles.flexRow, styles.fullCenter]}>
                                        <MaterialIcons name="add" size={22} color={palette.black} />
                                        <Text style={[styles.black, styles.bold]}>{t('add_car')}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={[styles.w100, styles.mt10]}>
                                    {
                                        cars.map((data, index) => {
                                            return (
                                                <CarCard
                                                    approved={data.status}
                                                    brand={data.brand}
                                                    model={data.model}
                                                    year={data.year}
                                                    color={data.color}
                                                    licensePlateLetters={data.licensePlateLetters}
                                                    licensePlateNumbers={data.licensePlateNumbers}
                                                    key={"car" + index} />
                                            );
                                        })
                                    }
                                </View>
                            </View>
                        }
                        {cars && cars.length === 0 &&
                            <View style={[styles.flexOne, styles.w100, styles.fullCenter]}>
                                <CarImage width={300} height={300} />
                                <Text style={[styles.textCenter, styles.font28, styles.bold]}>{t('cta_add_car')}</Text>
                                <Text style={[styles.font14, styles.mt5]}>{t('cta_add_car2')}</Text>
                                <Button onPress={() => navigation.navigate('New Car')} bgColor={palette.primary} textColor={palette.white} text={t('add_car')} />
                            </View>
                        }

                    </>
                }
                {
                    loading &&
                    <View style={styles.w100}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={40 * rem} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={70 * rem} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={70 * rem} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={70 * rem} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={70 * rem} />
                        </SkeletonPlaceholder>
                    </View>
                }

            </ScrollView>

        </ScreenWrapper>
    );
}

export default ManageCars;
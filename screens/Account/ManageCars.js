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
import { containerStyle, palette, styles } from '../../helper';
import CarImage from '../../svgs/car';
import ScreenWrapper from '../ScreenWrapper';

const ManageCars = ({ route, navigation }) => {
    const [cars, setCars] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        carsAPI.getUsableCars(0).then((newCars) => {
            setCars(newCars);
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

    return (
        <ScreenWrapper screenName="Manage Cars" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {cars && cars.length > 0 &&
                    <View style={[styles.flexOne, styles.w100]}>
                        <View style={[styles.alignEnd, styles.w100, styles.mt10]}>
                            <TouchableOpacity onPress={() => navigation.navigate('New Car')} style={[styles.bgLightGray, styles.borderSecondary, styles.border2, styles.p24, styles.pv8, styles.br24, styles.flexRow, styles.fullCenter]}>
                                <MaterialIcons name="add" size={22} color={palette.black} />
                                <Text style={[styles.black, styles.bold]}>Add Car</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.w100, styles.mt10]}>
                            {
                                cars.map((data, index) => {
                                    return (
                                        <CarCard
                                            approved={data.approved}
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
                        <Text style={[styles.textCenter, styles.font28, styles.bold]}>Let's get you on the road!</Text>
                        <Text style={[styles.font14, styles.mt5]}>Register your car details now.</Text>
                        <Button onPress={() => navigation.navigate('New Car')} bgColor={palette.primary} textColor={palette.white} text="Add Car" />
                    </View>
                }
            </ScrollView>

        </ScreenWrapper>
    );
}

export default ManageCars;
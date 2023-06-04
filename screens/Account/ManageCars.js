import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, translateEnglishNumbers, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HeaderView from '../../components/HeaderView';
import * as globalVars from '../../globalVars';
import DatePicker from 'react-native-date-picker';
import CarCard from '../../components/CarCard';
import * as carsAPI from '../../api/carsAPI';
import ScreenWrapper from '../ScreenWrapper';

const ManageCars = ({ route, navigation }) => {
    const [cars, setCars] = useState(null);

    useEffect(() => {
        carsAPI.getUsableCars(0).then((newCars) => {
            setCars(newCars);
        }).catch((error) => console.log(error));
    }, []);

    return (
        <ScreenWrapper screenName="Manage Cars" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
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
                        <Text style={[styles.textCenter, styles.font28, styles.bold, styles.ph24]}>Let's get you on the road!</Text>
                        <Text style={styles.font18}>Register your car details now.</Text>
                        <Button onPress={() => navigation.navigate('New Car')} bgColor={palette.primary} textColor={palette.white} text="Add Car" />
                    </View>
                }
            </ScrollView>

        </ScreenWrapper>
    );
}

export default ManageCars;
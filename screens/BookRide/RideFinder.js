import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, palette, customMapStyle, getDateShort, getTime, containerStyle, rem } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import * as ridesAPI from '../../api/ridesAPI';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import ScreenWrapper from '../ScreenWrapper';


const RideFinder = ({ route, navigation }) => {
    const { fromLat, fromLng, toLat, toLng, date, textFrom, textTo, genderChoice } = route.params;
    const [availableRides, setAvailableRides] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const loc = route.params?.loc;

    const [location, setLocation] = useState(null);
    const [markerFrom, setMarkerFrom] = useState(null);
    const [markerTo, setMarkerTo] = useState(null);
    const mapViewRef = useRef(null);

    useEffect(() => {
        ridesAPI.nearbyRides(fromLng, fromLat, toLng, toLat, date, genderChoice).then
            (
                data => {
                    setAvailableRides(data);
                }
            );
    }, []);

    const onClickRide = (rid) => {
        navigation.navigate('Book Ride', { rideId: rid });
    }

    const isDarkMode = useColorScheme === 'dark';


    return (
        <ScreenWrapper>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <View style={rideFinderStyles.autoCompletePair}>
                    <CustomTextInput key="fromText" iconLeft="my-location" value={textFrom} style={[rideFinderStyles.autoCompleteStyles, rideFinderStyles.autoCompleteTop]} />
                    <CustomTextInput key="toText" iconLeft="place" value={textTo} style={[rideFinderStyles.autoCompleteStyles, rideFinderStyles.autoCompleteBottom]} />
                </View>

                <Text style={[styles.headerText3, styles.black, styles.mt20]}>Available Rides</Text>
                {
                    availableRides.map((data, index) => {
                        const objDate = new Date(data.datetime);
                        return (<AvailableRide key={"ar" + index} rid={data.id} fromAddress={data.mainTextFrom} toAddress={data.mainTextTo} seatsOccupied={data.seatsOccupied} pricePerSeat={data.pricePerSeat} date={getDateShort(objDate)} time={getTime(objDate)} onPress={onClickRide} style={rideFinderStyles.availableRide} />);
                    }
                    )
                }
                <View style={styles.flexOne} />
            </ScrollView>

        </ScreenWrapper>

    );
}

const rideFinderStyles = StyleSheet.create({
    autoCompletePair: {
        ...styles.w100,
        shadowColor: palette.black,
        shadowOffset: { width: 0, height: 1 * rem },
        shadowOpacity: 0.2, shadowRadius: 4,
      },
    
      autoCompleteStyles: {
        marginTop: 0,
        marginBottom: 0,
        borderColor: palette.light,
        backgroundColor: palette.white
      },
    
      autoCompleteTop: {
        borderBottomWidth: 0.5,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
    
      autoCompleteBottom: {
        borderTopWidth: 0.5,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
      },

      availableRide: {
        ...styles.mt10,
        height: 140 * rem,
      }
});

export default RideFinder;
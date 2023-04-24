import React, { useState, useRef, useEffect } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView
} from 'react-native';
import { styles, loggedInStyles, SERVER_URL, getDateTime, getDateSQL, getDateShort, getTime, palette, customMapStyle, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderView from '../../components/HeaderView';
import AutoComplete from '../../components/AutoComplete';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as globalVars from '../../globalVars';
import DatePicker from 'react-native-date-picker';
import Geolocation from '@react-native-community/geolocation';
import FromToIndicator from '../../components/FromToIndicator';
import AvailableRide from '../../components/AvailableRide';
import { Notifications } from 'react-native-notifications';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
import LinearGradient from 'react-native-linear-gradient';
import Visa from '../../svgs/visa';
import Mastercard from '../../svgs/mastercard';
import ScreenWrapper from '../ScreenWrapper';

const AddBank = ({ navigation, route }) => {
    const [fullName, setFullName] = useState('');
    const [bankName, setBankName] = useState('');
    const [accNumber, setAccountNumber] = useState('');
    const [swiftCode, setSwiftCode] = useState('');
    const [branch, setBranch] = useState('');

    return (
        <ScreenWrapper screenName="Add Account" navType="back" navAction={() => navigation.goBack()}>
            <ScrollView style={{ flex: 1 }} contentContainerStyle={containerStyle}>
                <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Account Holder Full Name</Text>

                <CustomTextInput
                    placeholder="Account Holder Full Name"
                    value={fullName}
                    onChangeText={data => setFullName(data)}
                    iconLeft="badge"
                    style={{ backgroundColor: palette.white }}
                />


                <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>Bank Name</Text>

                <CustomTextInput
                    placeholder="Bank Name"
                    value={bankName}
                    onChangeText={data => setBankName(data)}
                    iconLeft="account-balance"
                    style={{ backgroundColor: palette.white }}
                />


                <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>IBAN/Account Number</Text>

                <CustomTextInput
                    placeholder="IBAN/Account Number"
                    value={accNumber}
                    onChangeText={data => setAccountNumber(data)}
                    iconLeft="tag"
                    style={{ backgroundColor: palette.white }}
                />


                <Text style={{ color: palette.black, marginTop: 20, fontSize: 15, fontWeight: '600' }}>SWIFT Code</Text>

                <CustomTextInput
                    placeholder="SWIFT Code"
                    value={swiftCode}
                    onChangeText={data => setSwiftCode(data)}
                    iconLeft="next-week"
                    style={{ backgroundColor: palette.white }}
                />

                <View style={{ flex: 1 }} />
                <Button text="Add Account" bgColor={palette.accent} textColor={palette.white} />
            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddBank;
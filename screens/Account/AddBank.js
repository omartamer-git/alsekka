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
    ScrollView,
    StyleSheet
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
            <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle, {alignItems: 'flex-start'}]}>
                <Text style={styles.inputText}>Account Holder Full Name</Text>

                <CustomTextInput
                    placeholder="Account Holder Full Name"
                    value={fullName}
                    onChangeText={data => setFullName(data)}
                    iconLeft="badge"
                />


                <Text style={styles.inputText}>Bank Name</Text>

                <CustomTextInput
                    placeholder="Bank Name"
                    value={bankName}
                    onChangeText={data => setBankName(data)}
                    iconLeft="account-balance"
                />


                <Text style={styles.inputText}>IBAN/Account Number</Text>

                <CustomTextInput
                    placeholder="IBAN/Account Number"
                    value={accNumber}
                    onChangeText={data => setAccountNumber(data)}
                    iconLeft="tag"
                />


                <Text style={styles.inputText}>SWIFT Code</Text>

                <CustomTextInput
                    placeholder="SWIFT Code"
                    value={swiftCode}
                    onChangeText={data => setSwiftCode(data)}
                    iconLeft="next-week"
                />

                <View style={styles.flexOne} />
                <Button text="Add Account" bgColor={palette.accent} textColor={palette.white} />
            </ScrollView>
        </ScreenWrapper>
    );
};

export default AddBank;
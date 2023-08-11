import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import Button from '../../components/Button';
import { abbreviate, containerStyle, getPhoneCarrier, palette, rem, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import BankCard from '../../components/BankCard';




const WithdrawalMethod = ({ type, number }) => {
    return (
        <TouchableOpacity activeOpacity={0.75} style={{ flexDirection: 'row', width: '100%', height: 48 * rem, alignItems: 'center', borderBottomWidth: 1, borderColor: palette.light }}>
            <Text style={[styles.ml15, styles.bold]}>{type}</Text>
            <Text style={[styles.ml15, styles.semiBold]}>{number}</Text>
            <View style={[styles.flexOne, styles.alignEnd]}>
                <FontsAwesome5 name="chevron-right" size={18 * rem} color={palette.dark}/>
            </View>
        </TouchableOpacity>
    );
};

const Wallet = ({ navigation, route }) => {
    const {availableCards, bankAccounts, mobileWallets, balance} = useUserStore();


    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const isDarkMode = useColorScheme === 'dark';

    return (
        <ScreenWrapper screenName="Wallet" navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Text style={styles.headerText}>Wallet</Text>
                <LinearGradient colors={[palette.primary, palette.secondary]} style={walletStyles.card}>
                    <Text style={[styles.white, styles.bold]}>Balance</Text>
                    <Text style={[styles.headerText, styles.white]}>EGP {balance}</Text>
                    <View style={[styles.justifyEnd, styles.mb5, styles.flexOne]}>
                        <Button text="Withdraw" bgColor={palette.white} style={{width: '50%'}} />
                    </View>
                </LinearGradient>

                <Text style={[styles.headerText3, styles.mt15]}>Payment Methods</Text>
                {
                    availableCards.map((data, index) => {
                        return (
                            <BankCard type={data.type} number={data.number} key={"card" + index} />
                        );
                    })
                }
                <TouchableOpacity onPress={() => { navigation.navigate('Add Card') }} activeOpacity={0.9} style={walletStyles.paymentMethodButton}>
                    <MaterialIcons name="add" size={18} color={palette.dark} />
                    <Text style={walletStyles.paymentMethodButtonText}>Add Payment Method</Text>
                </TouchableOpacity>

                <Text style={[styles.headerText3, styles.mt15]}>Withdrawal Options</Text>

                {
                    bankAccounts.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"bankacc" + index} type={abbreviate(data.bankName)} number={data.accNumber} />
                        );
                    })
                }

                <TouchableOpacity onPress={() => { navigation.navigate('Add Bank') }} activeOpacity={0.9} style={walletStyles.paymentMethodButton}>
                    <MaterialIcons name="account-balance" size={18} color={palette.dark} />
                    <Text style={walletStyles.paymentMethodButtonText}>Add Bank Account</Text>
                </TouchableOpacity>

                {
                    mobileWallets.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"bankacc" + index} type={getPhoneCarrier(data.phone)} number={data.phone} />
                        );
                    })
                }

                <TouchableOpacity activeOpacity={0.9} onPress={() => { navigation.navigate('Add Mobile Wallet') }} style={walletStyles.paymentMethodButton}>
                    <MaterialIcons name="wallet-travel" size={18} color={palette.dark} />
                    <Text style={walletStyles.paymentMethodButtonText}>Add Mobile Wallet</Text>
                </TouchableOpacity>
            </ScrollView>
        </ScreenWrapper>
    );
};

const walletStyles = StyleSheet.create({
    card: {
        ...styles.w100,
        height: 200 * rem,
        ...styles.br16,
        ...styles.p24,
        ...styles.mt10
    },

    paymentMethodButtonText: {
        ...styles.dark,
        ...styles.bold,
        ...styles.ml15,
    },

    paymentMethodButton: {
        height: 44 * rem,
        ...styles.w100,
        ...styles.justifyStart,
        ...styles.alignCenter,
        ...styles.flexRow,
        ...styles.bgLight,
        ...styles.br8,
        ...styles.ph16,
        ...styles.mt15,
    }
});

export default Wallet;
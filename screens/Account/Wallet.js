import React, { useEffect, useState } from 'react';
import {
    I18nManager,
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
import { abbreviate, containerStyle, getPhoneCarrier, palette, rem, styles, translateEnglishNumbers } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import BankCard from '../../components/BankCard';
import WithdrawalMethod from '../../components/WithdrawalMethod';
import { useTranslation } from 'react-i18next';

const Wallet = ({ navigation, route }) => {
    const {availableCards, bankAccounts, mobileWallets, balance} = useUserStore();


    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const isDarkMode = useColorScheme === 'dark';
    const {t} = useTranslation();

    return (
        <ScreenWrapper screenName={t('wallet')} navType="back" navAction={() => { navigation.goBack() }}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Text style={styles.headerText}>{t('wallet')}</Text>
                <LinearGradient colors={[palette.primary, palette.secondary]} style={walletStyles.card}>
                    <Text style={[styles.white, styles.bold]}>{t('balance')}</Text>
                    <Text style={[styles.headerText, styles.white]}>{t('EGP')} {I18nManager.isRTL ? translateEnglishNumbers(balance) : balance}</Text>
                    <View style={[styles.justifyEnd, styles.mb5, styles.flexOne]}>
                        <Button text={t('withdraw')} bgColor={palette.white} style={{width: '50%'}} onPress={() => navigation.navigate('Withdraw')} disabled={balance <= 0} />
                    </View>
                </LinearGradient>

                <Text style={[styles.headerText3, styles.mt15]}>{t('payment_methods')}</Text>
                {
                    availableCards.map((data, index) => {
                        return (
                            <BankCard type={data.type} number={data.number} key={"card" + index} />
                        );
                    })
                }
                <TouchableOpacity onPress={() => { navigation.navigate('Add Card') }} activeOpacity={0.9} style={walletStyles.paymentMethodButton}>
                    <MaterialIcons name="add" size={18} color={palette.dark} />
                    <Text style={walletStyles.paymentMethodButtonText}>{t('add_payment_method')}</Text>
                </TouchableOpacity>

                <Text style={[styles.headerText3, styles.mt15]}>{t('withdrawal_options')}</Text>

                {
                    bankAccounts.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"bankacc" + index} type={abbreviate(data.bankName)} number={data.accNumber} />
                        );
                    })
                }

                <TouchableOpacity onPress={() => { navigation.navigate('Add Bank') }} activeOpacity={0.9} style={walletStyles.paymentMethodButton}>
                    <MaterialIcons name="account-balance" size={18} color={palette.dark} />
                    <Text style={walletStyles.paymentMethodButtonText}>{t('add_bank_account')}</Text>
                </TouchableOpacity>

                {
                    mobileWallets.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"wallet" + index} type={getPhoneCarrier(data.phone)} number={data.phone} />
                        );
                    })
                }

                <TouchableOpacity activeOpacity={0.9} onPress={() => { navigation.navigate('Add Mobile Wallet') }} style={walletStyles.paymentMethodButton}>
                    <MaterialIcons name="wallet-travel" size={18} color={palette.dark} />
                    <Text style={walletStyles.paymentMethodButtonText}>{t('add_mobile_wallet')}</Text>
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
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    I18nManager,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useUserStore from '../../api/accountAPI';
import BankCard from '../../components/BankCard';
import Button from '../../components/Button';
import WithdrawalMethod from '../../components/WithdrawalMethod';
import { abbreviate, containerStyle, getPhoneCarrier, palette, rem, styles, translateEnglishNumbers } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import useAppManager from '../../context/appManager';

const Wallet = ({ navigation, route }) => {
    const { availableCards, bankAccounts, mobileWallets, balance } = useUserStore();


    const viewTrip = (id) => {
        navigation.navigate('View Trip', { tripId: id });
    };

    const { t } = useTranslation();
    const { cardsEnabled } = useAppManager();

    return (
        <ScreenWrapper screenName={t('wallet')} navType="back" navAction={ function () { navigation.goBack() }}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Text style={[styles.text, styles.headerText]}>{t('wallet')}</Text>
                <LinearGradient colors={[palette.primary, palette.secondary]} style={walletStyles.card}>
                    <Text style={[styles.text, styles.white, styles.bold]}>{t('balance')}</Text>
                    <Text style={[styles.text, styles.headerText, styles.white]}>{t('EGP')} {I18nManager.isRTL ? translateEnglishNumbers(balance) : balance}</Text>
                    <View style={[styles.justifyEnd, styles.mb5, styles.flexOne]}>
                        <Button text={t('withdraw')} bgColor={palette.white} style={{ width: '50%' }} onPress={() => navigation.navigate('Withdraw')} disabled={balance <= 0} />
                    </View>
                </LinearGradient>

                { cardsEnabled &&
                    <>
                        <Text style={[styles.text, styles.headerText3, styles.mt15]}>{t('payment_methods')}</Text>
                        {
                            availableCards.map((data, index) => {
                                return (
                                    <BankCard type={data.type} number={data.number} key={"card" + index} />
                                );
                            })
                        }
                        <TouchableOpacity onPress={ function () { navigation.navigate('Add Card') }} activeOpacity={0.9} style={walletStyles.paymentMethodButton}>
                            <MaterialIcons name="add" size={18} color={palette.dark} />
                            <Text style={[styles.text, walletStyles.paymentMethodButtonText]}>{t('add_payment_method')}</Text>
                        </TouchableOpacity>
                    </>
                }


                <Text style={[styles.text, styles.headerText3, styles.mt15]}>{t('withdrawal_options')}</Text>

                {
                    bankAccounts.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"bankacc" + index} type={abbreviate(data.bankName)} number={data.accNumber} />
                        );
                    })
                }

                <TouchableOpacity onPress={ function () { navigation.navigate('Add Bank') }} activeOpacity={0.9} style={walletStyles.paymentMethodButton}>
                    <MaterialIcons name="account-balance" size={18} color={palette.dark} />
                    <Text style={[styles.text, walletStyles.paymentMethodButtonText]}>{t('add_bank_account')}</Text>
                </TouchableOpacity>

                {
                    mobileWallets.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"wallet" + index} type={getPhoneCarrier(data.phone)} number={data.phone} />
                        );
                    })
                }

                <TouchableOpacity activeOpacity={0.9} onPress={ function () { navigation.navigate('Add Mobile Wallet') }} style={walletStyles.paymentMethodButton}>
                    <MaterialIcons name="wallet-travel" size={18} color={palette.dark} />
                    <Text style={[styles.text, walletStyles.paymentMethodButtonText]}>{t('add_mobile_wallet')}</Text>
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
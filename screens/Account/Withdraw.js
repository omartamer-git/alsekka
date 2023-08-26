import { ScrollView, Text } from "react-native";
import ScreenWrapper from "../ScreenWrapper";
import { abbreviate, containerStyle, getPhoneCarrier, palette, styles } from "../../helper";
import WithdrawalMethod from "../../components/WithdrawalMethod";
import useUserStore from "../../api/accountAPI";
import BottomModal from "../../components/BottomModal";
import { useRef, useState } from "react";
import ArrowButton from "../../components/ArrowButton";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";

const Withdraw = ({ route, navigation }) => {
    const { bankAccounts, mobileWallets, balance, sendWithdrawalRequest } = useUserStore();
    const [modalVisible, setModalVisible] = useState(false);
    
    const withdrawalType = useRef("BANK");
    const withdrawalId = useRef(null);
    const [withdrawalMethodChosen, setWithdrawalMethodChosen] = useState("Choose Withdrawal Method");

    const changeMethod = (data, type) => {
        withdrawalType.current = type;
        console.log(data.id);
        withdrawalId.current = data.id;
        if(type === "BANK") {
            setWithdrawalMethodChosen(`BANK - ${data.accNumber} (${abbreviate(data.bankName)})`);
        } else {
            setWithdrawalMethodChosen(`WALLET - ${data.phone} (${getPhoneCarrier(data.phone)})`);
        }

        setModalVisible(false);
    }

    const sendRequest = () => {
        if(withdrawalId.current !== null) {
            sendWithdrawalRequest(withdrawalType.current, withdrawalId.current).then(() => navigation.goBack());
        }
    };

    const {t} = useTranslation();

    return (
        <>
            <ScreenWrapper screenName={t('withdraw') + " " + t('balance')} navType="back" navAction={navigation.goBack}>
                <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                    <Text style={[styles.headerText3]}>{t('you_have')}</Text>
                    <Text style={[styles.headerText]}>{balance} {t('EGP')}</Text>
                    <Text style={[styles.headerText3]}>{t('available_to_withdraw')}</Text>

                    <ArrowButton
                        text={withdrawalMethodChosen}
                        bgColor={palette.lightGray}
                        textColor={palette.primary}
                        iconColor={palette.primary}
                        borderColor={palette.primary}
                        onPress={() => setModalVisible(true)}
                    />


                    <Button text={t('send_withdrawal_request')} bgColor={palette.primary} textColor={palette.white} onPress={sendRequest} />
                    <Text style={[styles.smallText, styles.dark]}>{t('withdraw_disclaimer')}</Text>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setModalVisible(false)} modalVisible={modalVisible}>
                {bankAccounts.length > 0 && <Text style={[styles.headerText3, styles.mt10]}>{t('bank_accounts')}</Text>}
                {
                    bankAccounts.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"bankacc" + index} type={abbreviate(data.bankName)} number={data.accNumber} onPress={() => changeMethod(data, "BANK")} />
                        );
                    })
                }

                {mobileWallets.length > 0 && <Text style={[styles.headerText3, styles.mt10]}>{t('mobile_wallets')}</Text>}

                {
                    mobileWallets.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"wallet" + index} type={getPhoneCarrier(data.phone)} number={data.phone} onPress={() => changeMethod(data, "WALLET")} />
                        );
                    })
                }
            </BottomModal>
        </>
    );
};

export default Withdraw;
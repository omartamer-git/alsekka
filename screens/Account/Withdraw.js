import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text } from "react-native";
import * as StoreReview from 'react-native-store-review';
import useUserStore from "../../api/accountAPI";
import ArrowButton from "../../components/ArrowButton";
import BottomModal from "../../components/BottomModal";
import Button from "../../components/Button";
import WithdrawalMethod from "../../components/WithdrawalMethod";
import { abbreviate, containerStyle, getPhoneCarrier, palette, styles } from "../../helper";
import ScreenWrapper from "../ScreenWrapper";

function Withdraw({ route, navigation }) {
    const { t } = useTranslation();
    const { bankAccounts, mobileWallets, balance, sendWithdrawalRequest } = useUserStore();
    const [modalVisible, setModalVisible] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const withdrawalType = useRef("BANK");
    const withdrawalId = useRef(null);
    const [withdrawalMethodChosen, setWithdrawalMethodChosen] = useState(t("choose_withdrawal_method"));

    function changeMethod(data, type) {
        withdrawalType.current = type;
        withdrawalId.current = data.id;
        if (type === "BANK") {
            setWithdrawalMethodChosen(`BANK - ${data.accNumber} (${abbreviate(data.bankName)})`);
        } else {
            setWithdrawalMethodChosen(`WALLET - ${data.phone} (${getPhoneCarrier(data.phone)})`);
        }

        setModalVisible(false);
    }

    const sendRequest = function () {
        setSubmitDisabled(true);
        if (withdrawalId.current !== null) {
            sendWithdrawalRequest(withdrawalType.current, withdrawalId.current).then(() => navigation.goBack()).catch(console.error).finally(function () { setSubmitDisabled(false); });
            StoreReview.requestReview();
        }
        setSubmitDisabled(false);
    };


    return (
        <>
            <ScreenWrapper screenName={t('withdraw') + " " + t('balance')} navType="back" navAction={navigation.goBack}>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                    <Text style={[styles.text, styles.headerText3]}>{t('you_have')}</Text>
                    <Text style={[styles.text, styles.headerText]}>{Math.ceil(balance / 100)} {t('EGP')}</Text>
                    <Text style={[styles.text, styles.headerText3]}>{t('available_to_withdraw')}</Text>

                    <ArrowButton
                        text={withdrawalMethodChosen}
                        bgColor={palette.light}
                        icon="money-bill-wave"
                        textColor={palette.dark}
                        iconColor={palette.dark}
                        onPress={() => setModalVisible(true)}
                    />


                    <Button text={t('send_withdrawal_request')} bgColor={palette.primary} textColor={palette.white} onPress={sendRequest} />
                    <Text style={[styles.text, styles.smallText, styles.dark]}>{t('withdraw_disclaimer')}</Text>
                </ScrollView>
            </ScreenWrapper>

            <BottomModal onHide={() => setModalVisible(false)} modalVisible={modalVisible}>
                {bankAccounts.length > 0 && <Text style={[styles.text, styles.headerText3, styles.mt10]}>{t('bank_accounts')}</Text>}
                {
                    bankAccounts.map((data, index) => {
                        return (
                            <WithdrawalMethod key={"bankacc" + index} type={abbreviate(data.bankName)} number={data.accNumber} onPress={() => changeMethod(data, "BANK")} />
                        );
                    })
                }

                {mobileWallets.length > 0 && <Text style={[styles.text, styles.headerText3, styles.mt10]}>{t('mobile_wallets')}</Text>}

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
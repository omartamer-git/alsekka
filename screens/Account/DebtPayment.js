import { I18nManager, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';
import { forceCancelRide } from '../../api/ridesAPI';
import { useEffect, useState } from 'react';
import useUserStore from '../../api/accountAPI';

function DebtPayment({ route, navigation }) {

    const user = useUserStore();
    const [url, setUrl] = useState(null);

    useEffect(() => {
        user.getSettlementId().then(id => {
            user.getHash(id).then((hash) => {
                setUrl(
                    `https://checkout.kashier.io/?merchantId=MID-23738-353&orderId=${id}&amount=${Math.ceil(user.balance / -100)}&currency=EGP&hash=${hash}&mode=live&merchantRedirect=https://seaats.app/paymentsuccess&serverWebhook=https://api.seaats.app/api/v1/payment/settlewebhook&metaData=${JSON.stringify({ userId: user.id.toString() })}&failureRedirect=FALSE&display=${I18nManager.isRTL ? 'ar' : 'en'}&manualCapture=FALSE&customer=${JSON.stringify({ reference: user.id.toString() })}&saveCard=forced&interactionSource=Ecommerce&enable3DS=true`
                )
            })
        });
    }, [])

    function handleNavigationStateChange(state) {
        // console.log(state.url);
        if (state.url.includes("paymentStatus=SUCCESS")) {
            user.setBalance(0);
        }
        if (state.url.includes("paymentStatus=SUCCESS") || state.url.includes("paymentStatus=CANCELLED")) {
            navigation.popToTop();
            navigation.navigate("Wallet");
        }
    }

    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('payment')}>
            {
                !url &&
                <>
                    <Text style={[styles.text]}>Loading...</Text>
                </>
            }
            {url &&
                <WebView
                    style={[styles.flexOne, styles.w100]}
                    source={{
                        uri: url
                    }}
                    onNavigationStateChange={handleNavigationStateChange}
                />
            }
        </ScreenWrapper>
    )
}

export default DebtPayment;
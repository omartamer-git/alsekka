import { I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';
import { forceCancelRide } from '../../api/ridesAPI';
import { useEffect, useState } from 'react';

function Payment({ route, navigation }) {

    const { data } = route.params;

    const invoice = data.invoice;
    const passengerDetails = data.passenger;
    const [cancelInitiated, setCancelInitiated] = useState(false); // Flag to prevent multiple cancellations

    function forceCancel() {
        return forceCancelRide(passengerDetails.id, invoice.id);
    }

    function handleNavigationStateChange(state) {
        // console.log(state.url);
        if (state.url.includes("paymentStatus=SUCCESS")) {
            navigation.popToTop();
            navigation.replace("Find a Ride");
            navigation.navigate("Ride Booked");
        } else if (state.url.includes("paymentStatus=CANCELLED")) {
            forceCancel().then(() => {
                setCancelInitiated(true);
                navigation.goBack();
            });
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            if(!cancelInitiated) {
                forceCancel();
            }
        });      
    }, [])

    const url = `https://checkout.kashier.io/?merchantId=MID-23738-353&orderId=${passengerDetails.id}&amount=${Math.ceil(invoice.grandTotal/100)}&currency=EGP&hash=${passengerDetails.hash}&mode=test&merchantRedirect=https://seaats.app/paymentsuccess&serverWebhook=https://api.seaats.app/api/v1/payment/webhook&metaData=${JSON.stringify({ passengerId: passengerDetails.id, userId: passengerDetails.UserId, rideId: passengerDetails.RideId })}&failureRedirect=FALSE&display=${I18nManager.isRTL ? 'ar' : 'en'}&manualCapture=FALSE&customer=${JSON.stringify({ reference: passengerDetails.UserId.toString() })}&saveCard=forced&interactionSource=Ecommerce&enable3DS=true`
    const { t } = useTranslation();

    return (
        <ScreenWrapper screenName={t('payment')}>
            <WebView
                style={[styles.flexOne, styles.w100]}
                source={{
                    uri: url
                }}
                onNavigationStateChange={handleNavigationStateChange}
            />
        </ScreenWrapper>
    )
}

export default Payment;
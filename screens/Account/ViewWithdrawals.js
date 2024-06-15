import { useTranslation } from "react-i18next";
import ScreenWrapper from "../ScreenWrapper";
import React, { useEffect, useState } from "react";
import useUserStore from "../../api/accountAPI";
import { ScrollView, Text, View } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { containerStyle, rem, styles } from "../../helper";

function ViewWithdrawals({ route, navigation }) {
    const { t } = useTranslation();
    const { getWithdrawalRequests } = useUserStore();
    const [loading, setLoading] = useState(true);
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        setLoading(true);
        getWithdrawalRequests().then(withdrawals => {
            setWithdrawals(withdrawals);
            setLoading(false);
        })
    }, []);
    return (
        <ScreenWrapper screenName={t('my_withdrawals')} navType={'back'} navAction={() => navigation.goBack()}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={[containerStyle, styles.alignCenter]}>
                {
                    !loading &&
                    <>
                        {
                            withdrawals.map((withdrawal, index) => {
                                return (
                                    <View key={`with-${index}`} style={[styles.w100, styles.p16, styles.bgLight, styles.mv5]}>
                                        <Text style={[styles.boldText, styles.dark, styles.font12]}>{t('withdrawal_ref')}{withdrawal.id}</Text>

                                        <View style={[styles.w100, styles.spaceBetween, styles.flexRow, styles.alignCenter]}>
                                            <Text style={[styles.boldText, styles.black, styles.font14]}>{(withdrawal.amount / 100).toFixed(2)} {t('EGP')}</Text>
                                            <View style={[
                                                styles.pv8,
                                                styles.ph16,
                                                styles.br24,
                                                withdrawal.status === 'PROCESSING' ? styles.bgPrimary : styles.bgSuccess
                                            ]}>
                                                <Text style={[styles.boldText, styles.font10, styles.white]}>{withdrawal.status}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </>
                }

                {
                    loading &&
                    <View style={styles.w100}>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={40 * rem} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={110 * rem} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={110 * rem} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={110 * rem} />
                        </SkeletonPlaceholder>
                        <SkeletonPlaceholder>
                            <SkeletonPlaceholder.Item marginTop={10 * rem} width={'100%'} height={110 * rem} />
                        </SkeletonPlaceholder>
                    </View>
                }
            </ScrollView>
        </ScreenWrapper >
    )
}

export default ViewWithdrawals;
import { Image, ScrollView, Text, View } from "react-native";
import ScreenWrapper from "../ScreenWrapper";
import { containerStyle, palette, rem, styles } from "../../helper";
import { useEffect, useState } from "react";
import { acceptCommunityMember, getCommunityMemberRequests, rejectCommunityMember } from "../../api/communitiesAPI";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const CommunityMembers = ({ route, navigation }) => {
    const { communityId } = route.params;
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    useEffect(() => {
        setLoading(true);
        getCommunityMemberRequests(communityId).then(members => {
            setMembers(members);
            setLoading(false);
        });
    }, []);

    const acceptMember = (id) => {
        setSubmitDisabled(true);
        acceptCommunityMember(id).then(() => setMembers(members.filter(m => m.id !== id))).catch(console.error).finally(() => {
            setSubmitDisabled(false);
        });
    };

    const rejectMember = (id) => {
        setSubmitDisabled(true);
        rejectCommunityMember(id).then(() => setMembers(members.filter(m => m.id !== id))).catch(console.error).finally(() => {
            setSubmitDisabled(false);
        });
    };

    const { t } = useTranslation();

    return (
        <>
            <ScreenWrapper screenName={t('manage_members')} navType="back" navAction={navigation.goBack}>
                <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                    {
                        !loading &&
                        <>
                            {
                                members.length === 0 &&
                                (
                                    <View style={[styles.w100, styles.flexOne, styles.fullCenter]}>
                                        <Text style={[styles.text, styles.headerText, styles.dark]}>{t('done')}</Text>
                                        <Text style={[styles.text, styles.dark]}>{t('no_new')}</Text>
                                    </View>
                                )
                            }
                            {
                                members.map((member, index) => {
                                    return (
                                        <View key={`mem${index}`} style={[styles.w100, styles.flexRow, styles.fullCenter, { borderBottomWidth: 1 }, styles.borderLight]}>
                                            <Image
                                                source={{ uri: member.User.profilePicture }}
                                                style={[{ width: 60 * rem, height: 60 * rem, borderRadius: (60 / 2) * rem }]} />
                                            <View style={[styles.ml10, styles.flexOne]}>
                                                <Text style={[styles.text, styles.headerText2]}>{member.User.firstName} {member.User.lastName}</Text>
                                                <Text style={[styles.text, styles.smallText, styles.dark]}>{member.joinAnswer}</Text>
                                                <View style={[styles.w100, styles.flexRow]}>
                                                    <Button disabled={submitDisabled} onPress={() => acceptMember(member.id)} style={[styles.flexOne, styles.mr5]} bgColor={palette.green} text={t('accept')} textColor={palette.white} />
                                                    <Button disabled={submitDisabled} onPress={() => rejectMember(member.id)} style={[styles.flexOne, styles.ml5]} bgColor={palette.red} text={t('reject')} textColor={palette.white} />
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
                        <>
                            <View style={styles.w100}>
                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginVertical={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginVertical={5 * rem} />
                                </SkeletonPlaceholder>


                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginVertical={5 * rem} />
                                </SkeletonPlaceholder>


                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginVertical={5 * rem} />
                                </SkeletonPlaceholder>


                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginVertical={5 * rem} />
                                </SkeletonPlaceholder>

                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginVertical={5 * rem} />
                                </SkeletonPlaceholder>


                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginVertical={5 * rem} />
                                </SkeletonPlaceholder>


                                <SkeletonPlaceholder>
                                    <SkeletonPlaceholder.Item width={'100%'} height={60 * rem} marginVertical={5 * rem} />
                                </SkeletonPlaceholder>
                            </View>
                        </>
                    }
                </ScrollView>
            </ScreenWrapper>
        </>
    );
};

export default CommunityMembers;
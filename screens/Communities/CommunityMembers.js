import { Image, ScrollView, Text, View } from "react-native";
import ScreenWrapper from "../ScreenWrapper";
import { containerStyle, palette, rem, styles } from "../../helper";
import { useEffect, useState } from "react";
import { acceptCommunityMember, getCommunityMemberRequests, rejectCommunityMember } from "../../api/communitiesAPI";
import Button from "../../components/Button";
import { useTranslation } from "react-i18next";

const CommunityMembers = ({ route, navigation }) => {
    const { communityId } = route.params;
    const [members, setMembers] = useState([]);

    useEffect(() => {
        getCommunityMemberRequests(communityId).then(members => {
            setMembers(members);
        })
    }, []);

    const acceptMember = (id) => {
        acceptCommunityMember(id).then(() => setMembers(members.filter(m => m.id !== id)));
    };

    const rejectMember = (id) => {
        rejectCommunityMember(id).then(() => setMembers(members.filter(m => m.id !== id)))
    };

    const {t} = useTranslation();

    return (
        <>
            <ScreenWrapper screenName={t('manage_members')} navType="back" navAction={navigation.goBack}>
                <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                    {
                        members.length === 0 && 
                        (
                            <View style={[styles.w100, styles.flexOne, styles.fullCenter]}>
                                <Text style={[styles.headerText, styles.dark]}>{t('done')}</Text>
                                <Text style={[styles.dark]}>{t('no_new')}</Text>
                            </View>
                        )
                    }
                    {
                        members.map((member, index) => {
                            return (
                                <>
                                    <View style={[styles.w100, styles.flexRow, styles.fullCenter, { borderBottomWidth: 1 }, styles.borderLight]}>
                                        <Image
                                            source={{ uri: member.User.profilePicture }}
                                            style={[{ width: 60 * rem, height: 60 * rem, borderRadius: (60 / 2) * rem }]} />
                                        <View style={[styles.ml10, styles.flexOne]}>
                                            <Text style={[styles.headerText2]}>{member.User.firstName} {member.User.lastName}</Text>
                                            <Text style={[styles.smallText, styles.dark]}>{member.joinAnswer}</Text>
                                            <View style={[styles.w100, styles.flexRow]}>
                                                <Button onPress={() => acceptMember(member.id)} style={[styles.flexOne, styles.mr5]} bgColor={palette.green} text={t('accept')} textColor={palette.white} />
                                                <Button onPress={() => rejectMember(member.id)} style={[styles.flexOne, styles.ml5]} bgColor={palette.red} text={t('reject')} textColor={palette.white} />
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )
                        })
                    }
                </ScrollView>
            </ScreenWrapper>
        </>
    );
};

export default CommunityMembers;
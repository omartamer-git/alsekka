import { useFocusEffect } from '@react-navigation/native';
import _debounce from 'lodash/debounce';
import React, { useCallback, useState } from 'react';
import {
    Platform,
    ScrollView,
    View
} from 'react-native';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import * as communitiesAPI from '../../api/communitiesAPI';
import CommunityCard from '../../components/CommunityCard';
import CustomTextInput from '../../components/CustomTextInput';
import { containerStyle, styles } from '../../helper';
import ScreenWrapper from '../ScreenWrapper';
import { useTranslation } from 'react-i18next';


const SearchCommunities = ({ navigation, route }) => {
    const [searchText, setSearchText] = useState('');
    const [communities, setCommunities] = useState([]);
    const handleTextChange = (text) => {
        if (text === '') {
            setCommunities([]);
            return;
        }
        communitiesAPI.searchCommunities(text.trim()).then(
            data => {
                setCommunities(data);
            }
        ).catch(err => {
            console.log(err);
        }
        );
    };
    const debounceFn = useCallback(_debounce(handleTextChange, 300), []);

    const onChangeText = (data) => {
        setSearchText(data);
        debounceFn(data);
    };


    if (Platform.OS === 'ios') {
        const onFocusEffect = useCallback( function () {
            // This should be run when screen gains focus - enable the module where it's needed
            AvoidSoftInput.setShouldMimicIOSBehavior(true);
            AvoidSoftInput.setEnabled(true);
            return  function () {
                // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
                AvoidSoftInput.setEnabled(false);
                AvoidSoftInput.setShouldMimicIOSBehavior(false);
            };
        }, []);

        useFocusEffect(onFocusEffect); // register callback to focus events    
    }

    const { t } = useTranslation();


    return (
        <ScreenWrapper screenName={t('search')} navType="back" navAction={() => navigation.goBack()}>
            <View style={[styles.defaultPadding]}>
                <CustomTextInput placeholder={t('search_for_community')} iconLeft="search" value={searchText} onChangeText={onChangeText} keyboardType="web-search" />
            </View>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    communities && communities.map((data, index) => {
                        return (
                            <CommunityCard
                                key={"communitycard" + index}
                                name={data.name} picture={data.picture}
                                description={data.description}
                                style={styles.mt10}
                                onPress={
                                    () => navigation.navigate('View Community', {
                                        communityId: data.id,
                                        communityName: data.name,
                                        communityPicture: data.picture,
                                        communityDescription: data.description,
                                        communityPrivacy: data.private
                                    })
                                }
                            />
                        );
                    })
                }
            </ScrollView>
        </ScreenWrapper>
    );
};

export default SearchCommunities;
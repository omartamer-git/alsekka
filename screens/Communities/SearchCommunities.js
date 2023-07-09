import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    StatusBar,
    useColorScheme,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Platform,
    ScrollView,
    Dimensions,
    RefreshControl
} from 'react-native';
import { styles, palette, containerStyle } from '../../helper';
import Button from '../../components/Button';
import Separator from '../../components/Separator';
import CustomTextInput from '../../components/CustomTextInput';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import _debounce from 'lodash/debounce';
import HeaderView from '../../components/HeaderView';
import * as communitiesAPI from '../../api/communitiesAPI';
import ScreenWrapper from '../ScreenWrapper';
import CommunityCard from '../../components/CommunityCard';
import { AvoidSoftInput } from 'react-native-avoid-softinput';
import { useFocusEffect } from '@react-navigation/native';


const SearchCommunities = ({ navigation, route }) => {
    const [searchText, setSearchText] = useState('');
    const [communities, setCommunities] = useState([]);
    const handleTextChange = (text) => {
        if(text === '') {
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


    const onFocusEffect = useCallback(() => {
        // This should be run when screen gains focus - enable the module where it's needed
        AvoidSoftInput.setShouldMimicIOSBehavior(true);
        AvoidSoftInput.setEnabled(true);
        return () => {
            // This should be run when screen loses focus - disable the module where it's not needed, to make a cleanup
            AvoidSoftInput.setEnabled(false);
            AvoidSoftInput.setShouldMimicIOSBehavior(false);
        };
    }, []);

    useFocusEffect(onFocusEffect); // register callback to focus events


    return (
        <ScreenWrapper screenName={"Search"} navType="back" navAction={() => navigation.goBack()}>
            <View style={[styles.defaultPadding]}>
                <CustomTextInput placeholder="Search for a Community" iconLeft="search" value={searchText} onChangeText={onChangeText} />
            </View>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                {
                    communities && communities.map((data, index) => {
                        return (<CommunityCard key={"communitycard" + index} name={data.name} picture={data.picture} description={data.description} style={styles.mt10} />);
                    })
                }
            </ScrollView>
        </ScreenWrapper>
    );
};

export default SearchCommunities;
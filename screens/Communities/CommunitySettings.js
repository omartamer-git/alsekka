import { launchImageLibrary } from 'react-native-image-picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomTextInput from '../../components/CustomTextInput';
import TextArea from '../../components/TextArea';
import Selector from '../../components/Selector';
import { Formik } from 'formik';
import Button from '../../components/Button';
import { leaveCommunity, updateCommunity } from '../../api/communitiesAPI';
import { useState } from 'react';
const { ScrollView, Text, Image, TouchableOpacity, View } = require("react-native");
const { styles, containerStyle, rem, palette } = require("../../helper");
const { default: ScreenWrapper } = require("../ScreenWrapper");

const CommunitySettings = ({ route, navigation }) => {
    const {
        communityId,
        communityName,
        communityPicture,
        communityDescription,
        communityPrivacy,
        owner,
        joinQuestion
    } = route.params;

    const [communityPhoto, setCommunityPhoto] = useState(null);

    const imagePickerOptions = {
        title: 'Community Photo',
        multiple: false,
        mediaType: 'photo',
        quality: 0.75,
        maxWidth: 500 * rem,
        maxHeight: 500 * rem,
        storageOptions: { skipBackup: true, path: 'images' }
    };

    const openImagePicker = async (e) => {
        const response = await launchImageLibrary(imagePickerOptions);
        if (!response.didCancel && !response.error) {
            setCommunityPhoto(response);
        }
    }

    const handleSubmit = (description, privacy, joinQuestion) => {
        updateCommunity(communityId, description, privacy, communityPhoto, joinQuestion).then(() => navigation.goBack());
    };

    return (
        <>
            <ScreenWrapper screenName="Community Settings" navType="back" navAction={navigation.goBack}>
                <ScrollView style={styles.flexOne} contentContainerStyle={[containerStyle, styles.alignCenter]}>
                    {
                        owner &&
                        <>
                            <Formik
                                initialValues={{ communityDescriptionInput: communityDescription, communityPrivacyInput: communityPrivacy ? 1 : 0, joinQuestionInput: joinQuestion }}
                                onSubmit={(values) => { handleSubmit(values.communityDescriptionInput, values.communityPrivacyInput, values.joinQuestionInput) }}
                                style={[styles.justifyStart, styles.alignStart]}
                            >
                                {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
                                    <>
                                        <TouchableOpacity onPress={openImagePicker} style={[styles.fullCenter, styles.bgLight, { width: 110 * rem, height: 110 * rem, borderRadius: 110 / 2 * rem, borderWidth: 2 * rem, alignSelf: 'center' }]}>
                                            <Image source={{ uri: communityPicture }} width={100 * rem} height={100 * rem} style={{ borderRadius: 50 * rem }} />
                                            <View style={[styles.positionAbsolute, styles.fullCenter, { height: 100 * rem, width: 100 * rem, borderRadius: 50 * rem, backgroundColor: 'rgba(125, 125, 125, 0.5)' }]}>
                                                <MaterialIcons name="photo-camera" size={50} color={palette.light} />
                                            </View>
                                        </TouchableOpacity>

                                        <Text style={[styles.headerText3, styles.mt5]}>{communityName}</Text>

                                        <Text style={styles.inputText}>Community Description</Text>
                                        <TextArea
                                            placeholder="Description"
                                            value={values.communityDescriptionInput}
                                            onBlur={handleBlur('communityDescriptionInput')}
                                            onChangeText={handleChange('communityDescriptionInput')}
                                            error={touched.communityDescriptionInput && errors.communityDescriptionInput}
                                        />

                                        <Text style={styles.inputText}>Community Privacy</Text>
                                        <Selector
                                            options={[{ value: 0, text: "Public" }, { value: 1, text: "Private" }]}
                                            value={values.communityPrivacyInput}
                                            setValue={(value) => setFieldValue('communityPrivacyInput', value)}
                                        />

                                        {
                                            values.communityPrivacyInput === 1 && (
                                                <>
                                                    <Text style={styles.inputText}>Privacy question</Text>
                                                    <CustomTextInput
                                                        placeholder="Example: What is your university ID number?"
                                                        value={values.joinQuestionInput}
                                                        onBlur={handleBlur('joinQuestionInput')}
                                                        onChangeText={handleChange('joinQuestionInput')}
                                                        error={touched.joinQuestionInput && errors.joinQuestionInput}
                                                    />
                                                </>
                                            )
                                        }

                                        <Button
                                            bgColor={palette.primary}
                                            textColor={palette.white}
                                            text="Update"
                                            onPress={handleSubmit}
                                            disabled={!isValid}
                                        />
                                    </>
                                )}
                            </Formik>


                        </>
                    }

                    {
                        !owner &&
                        <View style={[styles.flexOne, styles.fullCenter]}>
                            <Image source={{ uri: communityPicture }} width={100 * rem} height={100 * rem} style={{ borderRadius: 50 * rem }} />

                            <Text style={[styles.headerText3, styles.mt5]}>{communityName}</Text>

                            <Button bgColor={palette.red} textColor={palette.white} text="Leave Community" onPress={() => leaveCommunity(communityId)} />
                        </View>
                    }
                </ScrollView>
            </ScreenWrapper>
        </>
    );
};

export default CommunitySettings;
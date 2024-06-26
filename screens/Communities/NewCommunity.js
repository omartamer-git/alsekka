import { I18nManager, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "../ScreenWrapper";
import { containerStyle, palette, rem, styles } from "../../helper";
import CustomTextInput from "../../components/CustomTextInput";
import { Formik } from "formik";
import Button from "../../components/Button";
import TextArea from "../../components/TextArea";
import Selector from "../../components/Selector";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from "react-native-image-picker";
import { createCommunity } from "../../api/communitiesAPI";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from 'yup';
import FastImage from "react-native-fast-image";
import useErrorManager from "../../context/errorManager";


function NewCommunity({ navigation, route }) {
    const imagePickerOptions = {
        title: 'Community Photo',
        multiple: false,
        mediaType: 'photo',
        quality: 0.75,
        maxWidth: 500 * rem,
        maxHeight: 500 * rem,
        storageOptions: { skipBackup: true, path: 'images' }
    };

    const [communityPhoto, setCommunityPhoto] = useState(null);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    async function openImagePicker(e) {
        const response = await launchImageLibrary(imagePickerOptions);
        if (!response.didCancel && !response.error) {
            setCommunityPhoto(response);
        }
    }

    // const [error, setError] = useState(null);
    const setError = useErrorManager((state) => state.setError);

    async function handleSubmit(name, description, privacy, joinQuestion) {
        setSubmitDisabled(true);
        try {
            if (!communityPhoto) {
                const errorMessage = I18nManager.isRTL ? "مطلوب صورة المجتمع" : "Community picture is required";
                setError(errorMessage);
                return;
            }
            await createCommunity(name, description, privacy, communityPhoto, joinQuestion);
            navigation.goBack();
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitDisabled(false);
        }
    }

    const { t } = useTranslation();

    const communitySchema = Yup.object().shape({
        communityNameInput: Yup.string().min(3, t('error_short')).max(20, t('error_long')).required(t('error_required')),
        communityDescriptionInput: Yup.string().required(t('error_required')),
    });


    return (
        <ScreenWrapper screenName={t('new_community')} navType='back' navAction={navigation.goBack}>
            <ScrollView keyboardShouldPersistTaps={'handled'} style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Formik
                    initialValues={{ communityNameInput: '', communityDescriptionInput: '', communityPrivacyInput: 0, joinQuestionInput: '' }}
                    onSubmit={(values) => { handleSubmit(values.communityNameInput, values.communityDescriptionInput, values.communityPrivacyInput, values.joinQuestionInput) }}
                    validationSchema={communitySchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
                        <>
                            <View style={[styles.mt10, styles.fullCenter, { alignSelf: 'center' }]}>
                                <TouchableOpacity activeOpacity={0.9} onPress={openImagePicker} style={[styles.borderPrimary, styles.fullCenter, styles.border3, { width: 110 * rem, height: 110 * rem, borderRadius: 110 / 2 * rem }]}>
                                    {communityPhoto && <FastImage source={{ uri: communityPhoto.assets[0].uri }} style={[{ height: 100 * rem, width: 100 * rem, borderRadius: 100 / 2 * rem }, styles.border2, styles.borderWhite]} />}

                                    <View style={[styles.positionAbsolute, styles.fullCenter, { backgroundColor: 'rgba(125,125,125,0.5)', height: 100 * rem, width: 100 * rem, borderRadius: 100 / 2 * rem }]}>
                                        <MaterialIcons name="photo-camera" size={50} style={[styles.positionAbsolute, { borderRadius: 50 * rem }]} color={palette.light} />
                                    </View>
                                </TouchableOpacity>

                                {/* <Text style={[styles.text, styles.error, styles.boldText, styles.font14, styles.mt10]}>{error}</Text> */}
                            </View>

                            <Text style={[styles.text, styles.inputText]}>{t('community_name')}</Text>
                            <CustomTextInput
                                placeholder={t('community_name')}
                                value={values.communityNameInput}
                                onBlur={handleBlur('communityNameInput')}
                                onChangeText={handleChange('communityNameInput')}
                                error={touched.communityNameInput && errors.communityNameInput}
                            />

                            <Text style={[styles.text, styles.inputText]}>{t('community_description')}</Text>
                            <TextArea
                                placeholder={t('community_description')}
                                value={values.communityDescriptionInput}
                                onBlur={handleBlur('communityDescriptionInput')}
                                onChangeText={handleChange('communityDescriptionInput')}
                                error={touched.communityDescriptionInput && errors.communityDescriptionInput}
                            />

                            <Text style={[styles.text, styles.inputText]}>{t('community_privacy')}</Text>
                            <Selector
                                options={[{ value: 0, text: t('public') }, { value: 1, text: t('private') }]}
                                value={values.communityPrivacyInput}
                                setValue={(value) => setFieldValue('communityPrivacyInput', value)}
                            />

                            {
                                values.communityPrivacyInput === 1 && (
                                    <>
                                        <Text style={[styles.text, styles.inputText]}>{t('privacy_question')}</Text>
                                        <CustomTextInput
                                            placeholder={t('privacy_question_example')}
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
                                text={t('create_community')}
                                onPress={handleSubmit}
                                disabled={!isValid || submitDisabled}
                            />
                        </>
                    )}
                </Formik>


            </ScrollView>
        </ScreenWrapper>
    );
}

export default memo(NewCommunity);
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
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
import { useState } from "react";
import { useTranslation } from "react-i18next";


export default function NewCommunity({ navigation, route }) {
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

    const openImagePicker = async (e) => {
        const response = await launchImageLibrary(imagePickerOptions);
        if (!response.didCancel && !response.error) {
            setCommunityPhoto(response);
        }
    }

    const handleSubmit = async (name, description, privacy, joinQuestion) => {
        setSubmitDisabled(true);
        try {
            await createCommunity(name, description, privacy, communityPhoto, joinQuestion);
            navigation.goBack();    
        } catch(e) {
            console.error(e);
        } finally {
            setSubmitDisabled(false);
        }
    }

    const {t} = useTranslation();

    return (
        <ScreenWrapper screenName={t('new_community')}>
            <ScrollView style={styles.flexOne} contentContainerStyle={containerStyle}>
                <Formik
                    initialValues={{ communityNameInput: '', communityDescriptionInput: '', communityPrivacyInput: 0, joinQuestionInput: '' }}
                    onSubmit={(values) => { handleSubmit(values.communityNameInput, values.communityDescriptionInput, values.communityPrivacyInput, values.joinQuestionInput) }}
                >
                    {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, isValid, touched }) => (
                        <>
                            <TouchableOpacity onPress={openImagePicker} style={[styles.fullCenter, styles.bgLight, { width: 100 * rem, height: 100 * rem, borderRadius: 50 * rem, borderWidth: 2 * rem, alignSelf: 'center' }]}>
                                <MaterialIcons name="photo-camera" size={50} style={[styles.positionAbsolute, { borderRadius: 50 * rem }]} color={palette.dark} />
                            </TouchableOpacity>
                            <Text style={styles.inputText}>{t('community_name')}</Text>
                            <CustomTextInput
                                placeholder={t('community_name')}
                                value={values.communityNameInput}
                                onBlur={handleBlur('communityNameInput')}
                                onChangeText={handleChange('communityNameInput')}
                                error={touched.communityNameInput && errors.communityNameInput}
                            />

                            <Text style={styles.inputText}>{t('community_description')}</Text>
                            <TextArea
                                placeholder={t('community_description')}
                                value={values.communityDescriptionInput}
                                onBlur={handleBlur('communityDescriptionInput')}
                                onChangeText={handleChange('communityDescriptionInput')}
                                error={touched.communityDescriptionInput && errors.communityDescriptionInput}
                            />

                            <Text style={styles.inputText}>{t('community_privacy')}</Text>
                            <Selector
                                options={[{ value: 0, text: t('public') }, { value: 1, text: t('private') }]}
                                value={values.communityPrivacyInput}
                                setValue={(value) => setFieldValue('communityPrivacyInput', value)}
                            />

                            {
                                values.communityPrivacyInput === 1 && (
                                    <>
                                        <Text style={styles.inputText}>{t('privacy_question')}</Text>
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
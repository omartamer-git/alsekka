import { View } from "react-native";
import BottomModal from "./BottomModal";
import { palette, styles } from "../helper";
import Button from "./Button";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from "react-i18next";


export default function ImagePicker({ onChoose, visible, onHide }) {
    async function getImageFromCamera() {
        const response = await launchCamera();
        onChoose(response);
        onHide();
    }

    async function getImageFromGallery() {
        const response = await launchImageLibrary();
        onChoose(response);
        onHide();
    }

    const {t} = useTranslation();


    return (
        <BottomModal modalVisible={visible} onHide={onHide}>
            <View style={[styles.w100, styles.flexOne, styles.fullCenter]}>
                <Button
                    onPress={getImageFromGallery}
                    bgColor={palette.primary} textColor={palette.white} iconColor={palette.white} icon={'image'} text={t('choose_from_photos')} />
                <Button
                    onPress={getImageFromCamera}
                    bgColor={palette.primary} textColor={palette.white} iconColor={palette.white} icon={'camera'} text={t('choose_from_camera')} />
            </View>
        </BottomModal>
    )
}
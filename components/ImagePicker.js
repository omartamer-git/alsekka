import { View } from "react-native";
import BottomModal from "./BottomModal";
import { palette, styles } from "../helper";
import Button from "./Button";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from "react-i18next";
import BottomModalSheet from "./ModalSheet";
import { useBottomSheetModal } from "@gorhom/bottom-sheet";


export default function ImagePicker({ onChoose, visible, setVisible }) {
    const { dismiss } = useBottomSheetModal();

    async function getImageFromCamera() {
        const response = await launchCamera();
        onChoose(response);
        dismiss();
    }

    async function getImageFromGallery() {
        const response = await launchImageLibrary();
        onChoose(response);
        dismiss();
    }

    const { t } = useTranslation();


    return (
        <BottomModalSheet modalVisible={visible} setModalVisible={setVisible} snapPoints={['30%']}>
            <View style={[styles.w100, styles.flexOne, styles.fullCenter, styles.p24]}>
                <Button
                    onPress={getImageFromGallery}
                    bgColor={palette.primary} textColor={palette.white} iconColor={palette.white} icon={'image'} text={t('choose_from_photos')} />
                <Button
                    onPress={getImageFromCamera}
                    bgColor={palette.primary} textColor={palette.white} iconColor={palette.white} icon={'camera'} text={t('choose_from_camera')} />
            </View>
        </BottomModalSheet>
    )
}
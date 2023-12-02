const { View, Modal, Text, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback } = require("react-native");
const { styles, palette } = require("../helper");
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from './Button';
import { t } from 'i18next';

function DriverPopUp({ modalVisible, onHide, navigateToDriver }) {
    return (
        <Modal
            transparent
            visible={modalVisible}
            animationType="fade"
        >
            <TouchableOpacity
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // translucent background
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                activeOpacity={1}
                onPress={onHide}
            >

                <TouchableWithoutFeedback>
                    <View
                        style={[styles.bgWhite, styles.p24, styles.br16, {
                            width: '80%',
                            // height: '60%',
                        }]}
                    >
                        <TouchableOpacity style={[styles.w100, styles.alignEnd]} onPress={onHide}>
                            <MaterialIcons name="close" size={20} color={palette.accent} />
                        </TouchableOpacity>

                        <View style={[styles.w100, styles.mt20]}>
                            <Text style={[styles.text, styles.font28, styles.textCenter, styles.bold]}>
                                {t('driver_popup_title')}
                            </Text>

                            <Text style={[styles.text, styles.textCenter, styles.mt5]}>
                                {t('driver_popup_text')}
                            </Text>


                            <Button onPress={ function () {
                                onHide();
                                navigateToDriver();
                            }} bgColor={palette.primary} textColor={palette.white} text={t('driver_popup_cta')}/>
                            <Text style={[styles.bold, styles.text, styles.textCenter, styles.dark, styles.font12]}>{t('driver_popup_d1')}{"\n"}{t('driver_popup_d2')}</Text>
                        </View>


                    </View>
                </TouchableWithoutFeedback>

            </TouchableOpacity>
        </Modal>
    );
}

module.exports = {
    DriverPopUp
}
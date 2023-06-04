import React from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";
import { styles } from "../helper";
const BottomModal = ({onHide, modalVisible, children}) => {
    return (
        <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={onHide}
        >
            <TouchableOpacity style={styles.flexOne} onPress={onHide} />
            <View style={[styles.bottomModal, styles.bgLightGray, { height: '50%' }]}>
                <ScrollView style={[styles.flexOne, styles.w100, styles.bgLightGray]}>
                    {children}
                </ScrollView>
            </View>
        </Modal>
    );
};

export default BottomModal;
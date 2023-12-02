import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { palette, styles } from "../helper";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
                <TouchableOpacity style={[styles.w100]} onPress={onHide}><MaterialIcons name="close" size={25} color={palette.accent} /></TouchableOpacity>
                <ScrollView keyboardShouldPersistTaps={'handled'} style={[styles.flexOne, styles.w100, styles.bgLightGray]}>
                    {children}
                </ScrollView>
            </View>
        </Modal>
    );
};

export default BottomModal;
import React, { useState, useCallback } from 'react';
import CustomTextInput from './CustomTextInput';
import HeaderView from './HeaderView';
import _debounce from 'lodash/debounce';
import {
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    TouchableOpacity,
    View,
    Modal,
    SafeAreaView
} from 'react-native';
import { palette } from '../helper';

const googleKey = "AIzaSyDUNz5SYhR1nrdfk9TW4gh3CDpLcDMKwuw";

const AutoComplete = ({ style={}, type, placeholder, handleLocationSelect, inputStyles={} }) => {
    const [text, setText] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    let placeIds = [];

    const handleTextChange = (data) => {
        if (data !== "") {
            let pred = [];
            placeIds = [];
            let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${data}&key=${googleKey}&region=eg&language=en&locationbias=ipbias`;
            fetch(url).then
                (response => response.json()).then(
                    data => {
                        for (let i = 0; i < data.predictions.length; i++) {
                            pred.push([data.predictions[i].description, data.predictions[i].place_id]);
                        }
                        setPredictions(pred);
                    }
                )
        } else {
            setPredictions([]);
            placeIds = [];
        }
    }

    const debounceFn = useCallback(_debounce(handleTextChange, 300), []);

    const onChangeText = (data) => {
        setText(data);
        debounceFn(data);
    }

    const getLocationFromPlaceId = async (place_id) => {
        let url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${googleKey}`;
        const response = (await fetch(url));
        const data = (await response.json());
        const loc = data.result.geometry.location;
        return loc;
    }

    const moveInput = async (pred) => {
        setModalVisible(false);
        setText(pred[0]);
        const loc = (await getLocationFromPlaceId(pred[1]));
        handleLocationSelect(
            loc, pred[0]
        );
        setPredictions([]);
    }

    return (
        <View style={{ width: '100%' }}>
            <CustomTextInput onFocus={() => { setModalVisible(true); }} placeholder={placeholder} value={text} style={inputStyles} iconLeft={type} />
            <Modal animationType="slide" visible={modalVisible}>
                <SafeAreaView style={styles.modalStyle}>
                    <HeaderView colorMode="dark" navType="close" action={() => { setModalVisible(false) }} />
                    <CustomTextInput onChangeText={onChangeText} placeholder={placeholder} value={text} />
                    {
                        predictions.map((prediction, index) => (
                            <TouchableOpacity key={index} style={styles.predictionBox} onPress={() => moveInput(prediction)}><Text>{prediction[0]}</Text></TouchableOpacity>
                        ))
                    }
                </SafeAreaView>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalStyle: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: palette.white,
        width: '100%'
    },
    predictionBox: {
        width: 374,
        height: 48,
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    }

});


export default AutoComplete;
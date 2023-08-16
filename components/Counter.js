import { Text, TouchableOpacity, View } from "react-native";
import { rem, styles, translateEnglishNumbers } from "../helper";
import FontsAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useState } from "react";
import useLocale from "../locale/localeContext";

export default function Counter({ counter, setCounter, text, textPlural, min=0, max=4 }) {
    const {language} = useLocale();

    return (
        <>

            <View style={[styles.flexRow, styles.flexOne, { height: 44 * rem, marginTop: 8 * rem, marginBottom: 8 * rem }]}>
                <TouchableOpacity style={[styles.flexOne, styles.bgLight, styles.alignCenter, styles.justifyCenter, styles.br8]} onPress={() => setCounter(c => c>min ? c - 1 : min)}>
                    <Text>
                        <FontsAwesome5 name="minus" size={14} />
                    </Text>
                </TouchableOpacity>


                <View style={[styles.flexOne, styles.justifyCenter, styles.alignCenter]}>
                    <Text>{language === 'ar' ? translateEnglishNumbers(counter) : counter}</Text>
                    <Text>{counter <= 1 ? text : textPlural}</Text>
                </View>

                <TouchableOpacity style={[styles.flexOne, styles.bgLight, styles.alignCenter, styles.justifyCenter, styles.br8]} onPress={() => setCounter(c => c<max ? c + 1 : max)}>
                    <Text>
                        <FontsAwesome5 name="plus" size={14} />
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
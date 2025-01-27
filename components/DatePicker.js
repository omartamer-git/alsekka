import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { rem, styles, translateDate } from "../helper";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import useRenderCounter from "./useRenderCounter";



function CustomDatePicker({ date, setDate, style }) {
    const { t } = useTranslation();
    const counter = useRenderCounter();

    const dates = useRef(Array.from({ length: 6 }));
    const dateStrings = useRef(Array.from({ length: 6 }));
    const [chosenDate, setChosenDate] = useState(0);

    const dateStringsMemoized = useMemo(() => {
        return dateStrings.current.map((_, i) => {
            const dayOffset = i;
            let newDate = new Date();
            newDate.setDate(newDate.getDate() + i);
            return translateDate(newDate, t)[0];
        });
    }, [t]);

    dateStrings.current = dateStringsMemoized;


    function populateDates() {
        dates.current = dates.current.map(
            (a, i) => {
                const dayOffset = i;
                let newDate = new Date();
                newDate.setDate(newDate.getDate() + i);
                dateStrings.current[i] = translateDate(newDate, t)[0];
                return newDate;
            }
        );
    }

    useEffect(() => {
        populateDates();
    }, [])

    function DateInstance({ i }) {
        const chosen = chosenDate === i;
        const styleBorder = i === 0 ?
            { borderTopLeftRadius: 8 * rem } :
            i === 2 ?
                { borderTopRightRadius: 8 * rem } :
                i === 3 ?
                    { borderBottomLeftRadius: 8 * rem } :
                    i === 5 ?
                        { borderBottomRightRadius: 8 * rem } :
                        {};
        return (
            <View style={{ width: '33.3%', height: 48 * rem, padding: 1 }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={function () {
                        setChosenDate(i);
                        setDate(dates.current[i]);
                    }}
                    style={[chosen ? styles.bgPrimary : styles.bgGray, styles.justifyCenter, styles.alignCenter, styles.w100, styles.h100, styleBorder]}>
                    <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.white, styles.bold, styles.text]}>{dateStrings.current[i]}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[styles.fullCenter, styles.flexRow, styles.w100, styles.wrap, style]}>
            {counter}
            {
                dates.current.map((a, i) => {
                    return (
                        <DateInstance key={`date${i}`} i={i} />
                    )
                })
            }
        </View>
    )
}

export default memo(CustomDatePicker)
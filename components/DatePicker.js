import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { rem, styles } from "../helper";

export default function CustomDatePicker({ date, setDate }) {
    const { t } = useTranslation();

    return (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {
                (Array.from({ length: 6 })).map((a, i) => {
                    const dayOffset = i;
                    let newDate = new Date();
                    newDate.setDate(newDate.getDate() + i);

                    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
                    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

                    const dateString = `${t(days[newDate.getDay()])} ${newDate.getDate()} ${t(months[newDate.getMonth()])}`;
                    const chosen = date.getDate() === newDate.getDate() && date.getMonth() === newDate.getMonth();

                    return (
                        <View key={`date${i}`} style={{ width: '33.3%', height: 48 * rem, padding: 1 }}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={ function () {
                                    setDate(newDate);
                                }}
                                style={[chosen ? styles.bgPrimary : styles.bgDark, styles.justifyCenter, styles.alignCenter, styles.w100, styles.h100]} key={`day${dayOffset}`}>
                                <Text numberOfLines={1} adjustsFontSizeToFit style={[styles.white, styles.bold, styles.text]}>{dateString}</Text>
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
        </View>
    )
}
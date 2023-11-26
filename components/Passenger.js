import { Image, Text, View } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { palette, rem, styles } from '../helper';
import { useTranslation } from "react-i18next";

const Passenger = ({ borderTopWidth, data, children }) => {
    const {t} = useTranslation();
    return (
        <View style={[styles.w100, styles.borderLight, styles.flexRow, styles.alignCenter, styles.ph16, styles.pv8, { borderTopWidth: borderTopWidth }]}>
            <View style={[styles.border2, styles.fullCenter, { height: 55 * rem, width: 55 * rem, borderRadius: 55 * rem / 2 }]}>
                <Image source={{ uri: data.User.profilePicture }} style={[ styles.border2, styles.borderWhite, { height: 50, width: 50, resizeMode: 'center', borderRadius: 55 / 2 }]} />
            </View>
            <View style={[styles.ml10, styles.flexRow, styles.flexOne, { paddingEnd: 5 }]}>
                <View style={[styles.justifyCenter, styles.flexOne ]}>
                    <Text style={[styles.text, styles.semiBold]}>{data.User.firstName} {data.User.lastName}</Text>
                    <Text style={[styles.text, styles.font12, styles.semiBold, styles.dark]}>{data.paymentMethod == "CASH" ? t('cash') : t('card')}</Text>
                    <Text style={[styles.text]}>
                        {
                            Array.from({ length: Math.floor(data.User.rating) }, (_, i) => { return (<MaterialIcons key={"fullStarPassenger" + i} name="star" color={palette.secondary} />); })
                        }
                        {
                            Math.floor(data.User.rating) != data.User.rating &&
                            <MaterialIcons key={"halfStarPassenger5"} name="star-half" color={palette.secondary} />
                        }
                    </Text>
                </View>
                {children}
            </View>
        </View>
    );
}

export default Passenger;
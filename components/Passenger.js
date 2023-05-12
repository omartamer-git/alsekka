import { View, Text, Image } from "react-native";
import { palette, rem, styles } from '../helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Passenger = ({ borderTopWidth, data, children }) => {
    return (
        <View style={[styles.w100, styles.borderLight, styles.flexRow, styles.alignCenter, styles.ph16, styles.pv8, { borderTopWidth: borderTopWidth }]}>
            <View style={[styles.border2, styles.fullCenter, { height: 55 * rem, width: 55 * rem, borderRadius: 55 * rem / 2 }]}>
                <Image source={{ uri: data.profilePicture }} style={[ styles.border2, styles.borderWhite, { height: 50, width: 50, resizeMode: 'center', borderRadius: 55 / 2 }]} />
            </View>
            <View style={[styles.ml10, styles.flexRow, styles.flexOne, { paddingRight: 5 }]}>
                <View style={[styles.justifyCenter, styles.flexOne ]}>
                    <Text style={styles.semiBold}>{data.firstName} {data.lastName}</Text>
                    <Text style={[styles.font12, styles.semiBold, styles.dark]}>{data.paymentMethod == 0 ? "Cash" : "Card"}</Text>
                    <Text>
                        {
                            Array.from({ length: Math.floor(data.rating) }, (_, i) => { return (<MaterialIcons key={"fullStarPassenger" + i} name="star" color={palette.secondary} />); })
                        }
                        {
                            Math.floor(data.rating) != data.rating &&
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
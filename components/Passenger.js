import { View, Text, Image } from "react-native";
import { palette } from '../helper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Passenger = ({ borderTopWidth, data, children }) => {
    return (
        <View style={{ width: '100%', borderTopWidth: borderTopWidth, borderColor: palette.light, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}>
            <View style={{ height: 55, width: 55, borderRadius: 55 / 2, borderWidth: 2, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={{ uri: data.profilePicture }} style={{ height: 50, width: 50, resizeMode: 'center', borderRadius: 55 / 2, borderWidth: 2, borderColor: palette.white }} />
            </View>
            <View style={{ marginLeft: 10, flexDirection: 'row', flex: 1, paddingRight: 5 }}>
                <View style={{ justifyContent: 'center', flex:1 }}>
                    <Text style={{ fontWeight: '500' }}>{data.firstName} {data.lastName} ({data.id})</Text>
                    <Text style={{ fontSize: 12, fontWeight: '500', color: palette.dark }}>{data.paymentMethod == 0 ? "Cash" : "Card"}</Text>
                    <Text>
                        {
                            Array.from({ length: Math.floor(data.rating) }, (_, i) => { return (<MaterialIcons key={"fullStarPassenger" + i} name="star" color={palette.secondary} />); })
                        }
                        {
                            Math.floor(data.rating) != data.rating &&
                            <MaterialIcons key={"halfStarPassenger" + index + "5"} name="star-half" color={palette.secondary} />
                        }
                    </Text>
                </View>
                {children}
            </View>
        </View>
    );
}

export default Passenger;
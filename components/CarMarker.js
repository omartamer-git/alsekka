import { useEffect, useState } from "react";
import { Image, Text } from "react-native";
import { Animated, AnimatedRegion, Marker } from "react-native-maps";
import { styles } from "../helper";

export default function CarMarker({ car }) {
  const [marker, setMarker] = useState(null);
  const [coordinate, setCoordinate] = useState(
    new AnimatedRegion({
      latitude: car.latitude || 0,
      longitude: car.longitude || 0,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }),
  );

  useEffect(() => {
    // console.log("CAR");
    // console.log(car);
    animateMarker();
  }, [car]);

  const animateMarker = () => {
    const newCoordinate = {
      latitude: car.latitude || 0,
      longitude: car.longitude || 0,
      latitudeDelta: 0.04,
      longitudeDelta: 0.05,
    };

    if (Platform.OS === 'android') {
      if (marker) {
        marker.animateMarkerToCoordinate(newCoordinate, 15000);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  return (
    <Marker.Animated
      key={car.DeviceID}
      ref={marker => {
        setMarker(marker);
      }}
      coordinate={coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
      pinColor="#ff00ff"
    >
      {/* <Animated.View style={styles.markerWrap}>
          <Text style={styles.numberPlate} numberOfLines={1}>
            {car.NumberPlate}
          </Text>
          <Animated.Image source={Car} style={styles.marker} resizeMode="cover" />
        </Animated.View> */}
      <Image source={require('../assets/DriverMarker.png')} style={{ width: 35, height: 35 }} />
    </Marker.Animated>
  );
}

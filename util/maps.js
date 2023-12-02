const { decode } = require("@googlemaps/polyline-codec");
const { default: Geolocation } = require("@react-native-community/geolocation");
const { Platform, PermissionsAndroid } = require("react-native");

async function requestLocationPermission() {
    if (Platform.OS === 'ios') {
      const auth = Geolocation.requestAuthorization();
      return true;
    }

    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
    }

    return false;
  };


function decodePolyline(polyline) {
    return decode(polyline, 5).map(
        entry =>
            ({ latitude: entry[0], longitude: entry[1] })
    );
}

module.exports = {
    decodePolyline,
    requestLocationPermission
}
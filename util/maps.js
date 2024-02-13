const { decode } = require("@googlemaps/polyline-codec");
const { default: Geolocation } = require("@react-native-community/geolocation");
const { Platform, PermissionsAndroid } = require("react-native");

function decodePolyline(polyline) {
  return decode(polyline, 5).map(
    entry =>
      ({ latitude: entry[0], longitude: entry[1] })
  );
}

module.exports = {
  decodePolyline,
}
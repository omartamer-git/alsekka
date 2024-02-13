const { default: Geolocation } = require("@react-native-community/geolocation");
const { Platform, PermissionsAndroid } = require("react-native");

async function requestLocationPermission() {
    if (Platform.OS === 'ios') {
        // Await the authorization request and check its result
        return new Promise((resolve, reject) => {
            Geolocation.requestAuthorization(
                success => {
                    resolve(true);
                },
                error => {
                    resolve(false);
                }
            );
        });    }

    if (Platform.OS === 'android') {
        // Store the result of the permission request in a variable
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return false;
};

exports.getDeviceLocation = async () => {
    const perms = await requestLocationPermission();

    if (perms) {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                error => reject(error), // Proper error handling
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });
    } else {
        return false;
    }
};
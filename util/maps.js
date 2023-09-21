const { decode } = require("@googlemaps/polyline-codec")

function decodePolyline(polyline) {
    return decode(polyline, 5).map(
        entry =>
            ({ latitude: entry[0], longitude: entry[1] })
    );
}

module.exports = {
    decodePolyline
}
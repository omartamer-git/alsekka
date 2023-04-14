

import {
    StyleSheet,
} from 'react-native';



export const getDateSQL = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();

    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    return `${year}-${month}-${day} ${hour}:${minute}:00`;
};

export const translateEnglishNumbers = ( text ) => {
    text = String(text);
    const x = text.length;
    let resultText = "";
    for (let i = 0; i < x; i++) {
        const letter = text.charAt(i);
        // ٠١٢٣٤٥٦٧٨٩
        switch (letter) {
            case '0':
                resultText += "٠";
                break;
            case '1':
                resultText += "١";
                break;
            case '2':
                resultText += "٢";
                break;
            case '3':
                resultText += "٣";
                break;
            case '4':
                resultText += "٤";
                break;
            case '5':
                resultText += "٥";
                break;
            case '6':
                resultText += "٦";
                break;
            case '7':
                resultText += "٧";
                break;
            case '8':
                resultText += "٨";
                break;
            case '9':
                resultText += "٩";
                break;
            default:
                resultText += letter;
                break;
        }
    }
    return resultText;
}
// f8483b RED
// f7b844 GOLD
export const palette = {
    primary: '#2E1760',
    secondary: '#5e08c4',
    light: '#d4d7db',
    dark: '#6d7483',
    accent: '#0b182d',
    white: '#fff',
    inputbg: '#f6f7f9',
    red: '#f8483b',
    success: '#198754',
};

export const getDateShort = (date) => {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear().toString().substr(-2);

    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    return `${day}/${month}/${year}`;
}

export const getTime = (date) => {
    let hour = date.getHours();
    let minute = date.getMinutes();

    if (hour < 10) {
        hour = '0' + hour;
    }

    if (minute < 10) {
        minute = '0' + minute;
    }

    return `${hour}:${minute}`;
}

export const getDateTime = (date, viweing = true) => {
    let dateString = getDateSQL(date);
    let hour = date.getHours();
    let minute = date.getMinutes();

    if (hour < 10) {
        hour = '0' + hour;
    }

    if (minute < 10) {
        minute = '0' + minute;
    }

    let dateStringFinal = `${dateString} ${hour}:${minute}`;
    if (!viweing) {
        dateStringFinal = dateStringFinal + ':00';
    }

    return dateString;
}

export const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: palette.primary,
        flex: 1
    },
    loginScreenWrapper: {
        flex: 1,
        marginTop: 24,
        backgroundColor: palette.white,
        borderRadius: 30
    },

    defaultPadding: {
        paddingLeft: 24,
        paddingRight: 24,
    },

    defaultPaddingVertical: {
        paddingTop: 16,
        paddingBottom: 16
    },

    headerTextMargins: {
        marginTop: 30,
        marginBottom: 30
    },

    defaultContainer: {
        alignItems: 'center',
        flex: 1,
        paddingBottom: 16,
        paddingTop: 16,
    },

    leftAlignedHeaderText: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginTop: 72,
        marginBottom: 8,
        flex: 1,
    },

    leftAlignedHeaderText2: {
        flex: 1,
        alignItems: 'flex-start',
    },

    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    headerText3: {
        fontSize: 21,
        fontWeight: '600',
        textAlign: 'left',
    },

    headerText2: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'left',
    },

    white: {
        color: palette.white
    },

    black: {
        color: palette.black
    },

    homeScreenHeaderTextMargin: {
        marginBottom: 32
    },


    footer: {
        paddingTop: 32
    },

    smallText: {
        color: palette.white,
    },

    subText: {
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'left',
        color: palette.white,
        marginTop: 2,
        marginBottom: 2,
    },

    wrapper: {
        flex: 1,
    },

    logo: {
        width: 350,
        height: 267.97,
    },

    locale: {
        color: palette.white,
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 25,
        textAlignVertical: 'center'
    },

    localeWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
    },

    icon: {
        marginRight: 6,
    },

    phoneInput: {
        color: palette.dark,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 30,
        marginTop: 13
    },

    container: {
        height: 300,
        width: 300
    },

    map: {
        flex: 1,
    },

    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    rideView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderColor: palette.light,
        borderWidth: 1,
        backgroundColor: '#F6F5F5',
    },

    bottomModal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
        shadowColor: palette.dark,
        elevation: 5,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: -3}
    }
});

export const loggedInStyles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: palette.white,
        alignItems: 'center',
        flex: 1,
    },
    popUpAutoComplete: {
        width: '100%',
        flex: 1,
        backgroundColor: palette.white,
        alignItems: 'center',
        justifyContent: 'top'
    }
});

export const customMapStyle = [
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "2.00"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#9c9c9c"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#7b7b7b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c8d7d4"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#070707"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
]

export const SERVER_URL = "http://192.168.1.19:3000";
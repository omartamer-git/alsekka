

import {
    Dimensions,
    StyleSheet,
} from 'react-native';

function validateCardNumber(cardNumber) {
    // Remove any spaces or dashes from the card number
    cardNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');

    // Convert the card number into an array of digits
    var cardDigits = cardNumber.split('').map(Number);

    // Double every second digit starting from the right
    for (var i = cardDigits.length - 2; i >= 0; i -= 2) {
        cardDigits[i] *= 2;

        // If the doubled value is greater than 9, subtract 9
        if (cardDigits[i] > 9) {
            cardDigits[i] -= 9;
        }
    }

    // Calculate the sum of all digits
    var sum = cardDigits.reduce(function (acc, digit) {
        return acc + digit;
    }, 0);

    // The card number is valid if the sum is divisible by 10
    return sum % 10 === 0;
}

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

export const translateEnglishNumbers = (text) => {
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

export const abbreviate = (string) => {
    const words = string.split(' ');
    if (words.length > 1 && string.length > 6) {
        let abbreviation = words.map(function (word) {
            return word.charAt(0);
        }).join("");

        return abbreviation.toUpperCase(); // Convert the abbreviation to uppercase
    }
    return string;
};

export const getPhoneCarrier = (phone) => {
    const carrierCode = phone.substring(0, 3);
    if(carrierCode === '010') {
        return "VODA"
    } else if(carrierCode === '011') {
        return "ETI"
    } else if(carrierCode === '012') {
        return "ORG"
    } else if(carrierCode === '015') {
        return "WE"
    } else {
        return "UNK"
    }
}


export const palette = {
    primary: '#2E1760',
    secondary: '#5e08c4',
    light: '#d4d7db',
    dark: '#6d7483',
    accent: '#0b182d',
    white: '#fff',
    lightGray: '#f6f7f9',
    red: '#f8483b',
    success: '#198754',
    green: '#198754',
    red: '#dc3545',
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

export const rem = Dimensions.get('window').width / 380;

export const styles = StyleSheet.create({
    backgroundStyle: {
        backgroundColor: palette.primary,
        flex: 1
    },
    loginScreenWrapper: {
        flex: 1,
        marginTop: 24 * rem,
        backgroundColor: palette.white,
        borderRadius: 30 * rem
    },

    defaultPadding: {
        paddingLeft: 24 * rem,
        paddingRight: 24 * rem,
    },

    defaultPaddingVertical: {
        paddingTop: 16 * rem,
        paddingBottom: 16 * rem
    },

    headerTextMargins: {
        marginTop: 30 * rem,
        marginBottom: 30 * rem
    },

    defaultContainer: {
        alignItems: 'center',
        flex: 1,
        paddingBottom: 16 * rem,
        paddingTop: 16 * rem,
    },

    headerText: {
        fontSize: 32 * rem,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    headerText3: {
        fontSize: 21 * rem,
        fontWeight: '600',
        textAlign: 'left',
    },

    headerText2: {
        fontSize: 28 * rem,
        fontWeight: '600',
        textAlign: 'left',
    },

    primary: {
        color: palette.primary
    },

    white: {
        color: palette.white
    },

    black: {
        color: palette.black
    },

    dark: {
        color: palette.dark
    },

    error: {
        color: palette.red,
    },

    success: {
        color: palette.success,
    },

    light: {
        color: palette.light
    },

    accent: {
        color: palette.accent
    },

    homeScreenHeaderTextMargin: {
        marginBottom: 32 * rem
    },


    footer: {
        paddingTop: 32 * rem
    },

    smallText: {
        color: palette.white,
    },

    subText: {
        fontSize: 20 * rem,
        fontWeight: '400',
        textAlign: 'left',
        color: palette.white,
        marginTop: 2 * rem,
        marginBottom: 2 * rem,
    },

    wrapper: {
        flex: 1,
    },

    logo: {
        width: 350 * rem,
        height: 267.97 * rem,
    },

    locale: {
        color: palette.white,
        fontWeight: 'bold',
        fontSize: 15 * rem,
        lineHeight: 25 * rem,
        textAlignVertical: 'center'
    },

    localeWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
    },

    icon: {
        marginRight: 6 * rem,
    },

    phoneInput: {
        color: palette.dark,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 30 * rem,
        marginTop: 13 * rem
    },

    container: {
        height: 300 * rem,
        width: 300 * rem
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
        borderRadius: 8 * rem,
        borderColor: palette.light,
        borderWidth: 1,
        backgroundColor: '#F6F5F5',
    },

    bottomModal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 16 * rem,
        borderTopRightRadius: 16 * rem,
        backgroundColor: '#fff',
        shadowColor: palette.dark,
        elevation: 5,
        shadowOpacity: 0.3,
        shadowRadius: 5 * rem,
        shadowOffset: { width: 0, height: -3 * rem },
        padding: 16 * rem
    },

    flexOne: {
        flex: 1,
    },

    flexGrow: {
        flexGrow: 1
    },

    fullCenter: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    m5: {
        margin: 5 * rem
    },

    mt5: {
        marginTop: 5 * rem,
    },

    mb5: {
        marginBottom: 5 * rem,
    },

    ml5: {
        marginLeft: 5 * rem,
    },

    mr5: {
        marginRight: 5 * rem,
    },

    m10: {
        margin: 10 * rem
    },

    mt10: {
        marginTop: 10 * rem,
    },

    mb10: {
        marginBottom: 10 * rem,
    },

    ml10: {
        marginLeft: 10 * rem,
    },

    mr10: {
        marginRight: 10 * rem,
    },

    m15: {
        margin: 15 * rem
    },

    mt15: {
        marginTop: 15 * rem,
    },

    mb15: {
        marginBottom: 15 * rem,
    },

    ml15: {
        marginLeft: 15 * rem,
    },

    mr15: {
        marginRight: 15 * rem,
    },

    m20: {
        margin: 20 * rem
    },

    mt20: {
        marginTop: 20 * rem,
    },

    mb20: {
        marginBottom: 20 * rem,
    },

    ml20: {
        marginLeft: 20 * rem,
    },

    mr20: {
        marginRight: 20 * rem,
    },

    p8: {
        padding: 8 * rem
    },

    pt8: {
        paddingTop: 8 * rem,
    },

    pb8: {
        paddingBottom: 8 * rem,
    },

    pl8: {
        paddingLeft: 8 * rem,
    },

    pr8: {
        paddingRight: 8 * rem,
    },

    p16: {
        padding: 16 * rem
    },

    pt16: {
        paddingTop: 16 * rem,
    },

    pb16: {
        paddingBottom: 16 * rem,
    },

    pl16: {
        paddingLeft: 16 * rem,
    },

    pr16: {
        paddingRight: 16 * rem,
    },

    p24: {
        padding: 24 * rem,
    },

    pt24: {
        paddingTop: 24 * rem,
    },

    pb24: {
        paddingBottom: 24 * rem,
    },

    pl24: {
        paddingLeft: 24 * rem,
    },

    pr24: {
        paddingRight: 24 * rem,
    },

    w100: {
        width: '100%',
    },

    h100: {
        height: '100%',
    },

    flexRow: {
        flexDirection: 'row',
    },

    flexCol: {
        flexDirection: 'column'
    },

    mh5: {
        marginHorizontal: 5 * rem,
    },

    mv5: {
        marginVertical: 5 * rem,
    },

    ph8: {
        paddingHorizontal: 8 * rem,
    },

    pv8: {
        paddingVertical: 8 * rem,
    },

    mh10: {
        marginHorizontal: 10 * rem,
    },

    mv10: {
        marginVertical: 10 * rem,
    },

    ph16: {
        paddingHorizontal: 16 * rem,
    },

    pv16: {
        paddingVertical: 16 * rem,
    },

    mh15: {
        marginHorizontal: 15 * rem,
    },

    mv15: {
        marginVertical: 15 * rem,
    },

    mh20: {
        marginHorizontal: 20 * rem,
    },

    mv20: {
        marginVertical: 20 * rem,
    },

    ph24: {
        paddingHorizontal: 24 * rem,
    },

    pv24: {
        paddingVertical: 24 * rem,
    },

    br0: {
        borderRadius: 0,
    },

    br8: {
        borderRadius: 8 * rem,
    },

    br16: {
        borderRadius: 16 * rem
    },

    br24: {
        borderRadius: 24 * rem,
    },

    bgPrimary: {
        backgroundColor: palette.primary,
    },

    bgSecondary: {
        backgroundColor: palette.secondary,
    },

    bgSuccess: {
        backgroundColor: palette.success
    },

    bgWhite: {
        backgroundColor: palette.white,
    },

    bgLightGray: {
        backgroundColor: palette.lightGray
    },

    bgLight: {
        backgroundColor: palette.light,
    },

    bgAccent: {
        backgroundColor: palette.accent,
    },

    bgRed: {
        backgroundColor: palette.red,
    },

    bgTransparent: {
        backgroundColor: 'rgba(255,255,255,0)'
    },

    borderPrimary: {
        borderColor: palette.primary,
    },

    borderLight: {
        borderColor: palette.light,
    },

    borderWhite: {
        borderColor: palette.white,
    },

    borderSecondary: {
        borderColor: palette.secondary,
    },

    borderDark: {
        borderColor: palette.dark
    },

    borderAccent: {
        borderColor: palette.accent
    },

    border1: {
        borderWidth: 1,
    },

    border2: {
        borderWidth: 2,
    },

    border3: {
        borderWidth: 3,
    },

    bold: {
        fontWeight: '600',
    },

    semiBold: {
        fontWeight: '500',
    },

    normal: {
        fontWeight: '400',
    },

    positionAbsolute: {
        position: 'absolute',
    },

    font12: {
        fontSize: 12 * rem,
    },

    font14: {
        fontSize: 14 * rem,
        lineHeight: 14 * rem,
    },

    font18: {
        fontSize: 18 * rem,
        lineHeight: 18 * rem,
    },

    font28: {
        fontSize: 28 * rem,
        lineHeight: 28 * rem,
    },

    inputText: {
        color: palette.black,
        marginTop: 20 * rem,
        fontSize: 14 * rem,
        fontWeight: '600'
    },

    spaceBetween: {
        justifyContent: 'space-between'
    },

    alignSelfCenter: {
        alignSelf: 'center',
    },

    alignStart: {
        alignItems: 'flex-start'
    },

    alignCenter: {
        alignItems: 'center',
    },

    alignEnd: {
        alignItems: 'flex-end'
    },

    justifyStart: {
        justifyContent: 'flex-start'
    },

    justifyCenter: {
        justifyContent: 'center',
    },

    justifyEnd: {
        justifyContent: 'flex-end'
    },

    textStart: {
        textAlign: 'left',
    },
    textCenter: {
        textAlign: 'center',
    },
    textEnd: {
        textAlign: 'right',
    },
    mapStyle: {
        height: 300 * rem,
        width: '100%',
        zIndex: 3,
        elevation: 3,
        position: 'relative',
        marginTop: -20 * rem,
        borderBottomColor: palette.light,
        borderBottomWidth: 1 * rem,
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
];
export const mapPadding = { bottom: 48 * rem, top: 0, left: 16 * rem, right: 0 };

export const containerStyle = [styles.defaultContainer, styles.defaultPadding, styles.alignStart, { backgroundColor: palette.lightGray, width: '100%', zIndex: 5, flex: 0, flexGrow: 1, }];
export const mapContainerStyle = [styles.flexOne, { zIndex: 3, elevation: 3, position: 'relative', marginTop: -20 * rem }];
export const SERVER_URL = "http://127.0.0.1:3000";
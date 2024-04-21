const { View } = require("react-native");
const { StyleSheet } = require("react-native");
const { palette } = require("../helper");


const Triangle = (props) => {
    const styles = StyleSheet.create({
        triangle: {
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderLeftWidth: 7.5,
            borderRightWidth: 7.5,
            borderBottomWidth: 15,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderBottomColor: props.color || palette.secondary,
            transform: [{ rotate: "180deg" }]
        },
    });

    return <View style={[styles.triangle, props.style]} />;
};


module.exports = { Triangle }
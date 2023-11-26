const { Text } = require("react-native");
const { styles } = require("../helper");
import React from 'react';


const ErrorMessage = ({message, condition, style}) => {
    if(condition) {
        return (
            <Text style={[styles.text, styles.error, styles.mt10, styles.font14, styles.normal, style]}>{message}</Text>
        );
    } else {
        return <></>
    }

}

export default ErrorMessage;
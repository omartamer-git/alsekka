const { Text } = require("react-native");
const { styles } = require("../helper");
import React from 'react';


const ErrorMessage = ({message, condition}) => {
    if(condition) {
        return (
            <Text style={[styles.error, styles.mt10, styles.font14, styles.normal]}>{message}</Text>
        );
    } else {
        return <></>
    }

}

export default ErrorMessage;
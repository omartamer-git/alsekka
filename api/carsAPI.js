import { Text } from 'react-native';
import { SERVER_URL } from '../helper';
import * as globalVars from '../globalVars';


const getUsableCars = async () => {
    return await fetch(SERVER_URL + `/cars?uid=${globalVars.getUserId()}&approved=1`)
    .then(response => { return response.json() })
    .then(data => { return data });
}

module.exports = {
    getUsableCars
}
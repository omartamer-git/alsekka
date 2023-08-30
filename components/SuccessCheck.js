import LottieView from "lottie-react-native";
import { rem } from "../helper";

const SuccessCheck = () => {
    return (
        <>
            <LottieView style={{width: 125 * rem, height: 125 * rem, alignSelf: 'center'}} source={require("../assets/success_checkmark.json")} autoPlay loop={false} />
        </>
    );
}

export default SuccessCheck;
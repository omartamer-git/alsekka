import LottieView from "lottie-react-native";
import { rem } from "../helper";

function SuccessCheck ({width=125, height=125}) {
    return (
        <>
            <LottieView style={{width: width * rem, height: height * rem, alignSelf: 'center'}} source={require("../assets/success_checkmark.json")} autoPlay loop={false} />
        </>
    );
}

export default SuccessCheck;
import LottieView from "lottie-react-native";
import { rem } from "../helper";

function LiveAnimation({ width = 125, height = 125 }) {
    return (
        <>
            <LottieView style={{ width: width * rem, height: height * rem, alignSelf: 'center' }} source={require("../assets/live_animation.json")} autoPlay loop={true} />
        </>
    );
}

export default LiveAnimation;
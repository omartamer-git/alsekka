import LottieView from "lottie-react-native";
import { rem } from "../helper";

const Loading = () => {
    return (
        <>
            <LottieView style={{width: 250 * rem, height: 250 * rem, alignSelf: 'center'}} source={require("../assets/loading_animation.json")} autoPlay loop />
        </>
    );
}

export default Loading;
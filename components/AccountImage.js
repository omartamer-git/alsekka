import { StyleSheet, TouchableOpacity, View } from "react-native";
import FastImage from 'react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DEFAULT_BASE_IMAGE } from "../helper";
import { palette, rem, styles } from "../helper";

function AccountImage({source, onPress, containerStyle, iconSize, innerStyle, imageStyle, iconStyle}) {
  const profilePictureSizing = {
    height: containerStyle.height - 10 * rem,
    width: containerStyle.height - 10 * rem,
    borderRadius: (containerStyle.height - 10 * rem) / 2,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[localStyles.profilePictureView, containerStyle]}>
      {source && (
        <FastImage
          source={{uri: source}}
          style={[localStyles.profilePicture, profilePictureSizing, imageStyle]}
        />
      )}

      {(!source || source.includes(DEFAULT_BASE_IMAGE)) && (
        <View style={[localStyles.profilePictureOverlay, profilePictureSizing, innerStyle]}>
          <MaterialIcons
            name="photo-camera"
            size={iconSize || 50}
            style={[localStyles.cameraOverlay, iconStyle]}
            color={palette.light}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default AccountImage;


const localStyles = StyleSheet.create({
  profilePictureView: {
    width: 107 * rem,
    height: 107 * rem,
    borderRadius: 107 * rem / 2,
    ...styles.borderPrimary,
    ...styles.fullCenter,
    borderWidth: 3 * rem,
},

  profilePicture: {
      borderWidth: 2 * rem,
      ...styles.borderWhite,
  },

  profilePictureOverlay: {
      ...styles.positionAbsolute,
      ...styles.fullCenter,
      backgroundColor: 'rgba(125,125,125,0.5)'
  },

  cameraOverlay: {
      borderRadius: 50 * rem,
      ...styles.positionAbsolute,
  },

})
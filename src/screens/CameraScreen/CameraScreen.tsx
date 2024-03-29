import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraPictureOptions,
  CameraRecordingOptions,
  FlashMode,
} from "expo-camera";
import colors from "../../theme/colors";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/core";
import { CreateNavigationProp } from "../../types/navigation";
import { launchImageLibrary } from "react-native-image-picker";

const flashModes = [
  FlashMode.off,
  FlashMode.on,
  FlashMode.auto,
  FlashMode.torch,
];
const flashModeToIcon = {
  [FlashMode.off]: "flash-off",
  [FlashMode.on]: "flash-on",
  [FlashMode.auto]: "flash-auto",
  [FlashMode.torch]: "highlight",
};
const CameraScreen = () => {
  const [hasPermissions, setHasPermissions] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const camera = useRef<Camera>(null);
  const navigation = useNavigation<CreateNavigationProp>();

  useEffect(() => {
    const getPermissions = async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      setHasPermissions(
        cameraPermission.status === "granted" &&
          microphonePermission.status === "granted"
      );
    };
    getPermissions();
  }, []);

  const flipCamera = () => {
    setCameraType((currentCameraType) =>
      currentCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const flipFlash = () => {
    const currentIndex = flashModes.indexOf(flash);
    const nextIndex =
      currentIndex === flashModes.length - 1 ? 0 : currentIndex + 1;
    setFlash(flashModes[nextIndex]);
  };

  const takePicture = async () => {
    if (!isCameraReady || !camera.current || isRecording) {
      return;
    }

    const options: CameraPictureOptions = {
      quality: 0.1,
      base64: false,
      skipProcessing: true,
    };
    setIsRecording(true);
    const result = await camera.current.takePictureAsync(options);
    navigation.navigate("Create", {
      image: result.uri,
    });
  };

  const startRecording = async () => {
    if (!isCameraReady || !camera.current || isRecording) {
      return;
    }
    const options: CameraRecordingOptions = {
      quality: Camera.Constants.VideoQuality["640:480"],
      maxDuration: 60,
      maxFileSize: 10 * 1024 * 1024,
      mute: false,
    };
    try {
      const result = await camera.current.recordAsync(options);
      navigation.navigate("Create", {
        video: result.uri,
      });
    } catch (e) {
      console.log(e);
    }
    setIsRecording(false);
  };
  const stopRecording = () => {
    if (isRecording) {
      camera.current?.stopRecording();
      setIsRecording(false);
    }
  };

  const openGallery = () => {
    launchImageLibrary(
      { mediaType: "mixed", selectionLimit: 3 },
      ({ didCancel, errorCode, errorMessage, assets }) => {
        if (!didCancel && !errorCode && assets && assets.length > 0) {
          const params: {
            image?: string;
            images?: string[];
            video?: string;
          } = {};
          if (assets.length === 1) {
            const field = assets[0].type?.startsWith("video")
              ? "video"
              : "image";
            params[field] = assets[0].uri;
          } else if (assets.length > 1) {
            params.images = assets.map((asset) => asset.uri) as string[];
          }
          navigation.navigate("Create", params);
        }
      }
    );
  };

  if (hasPermissions === null) {
    return <Text>Loading ...</Text>;
  }

  if (hasPermissions === false) {
    return <Text>No access to the Camera</Text>;
  }

  return (
    <View style={[styles.page, Platform.OS === "ios" && { marginTop: 50 }]}>
      <Camera
        ref={camera}
        style={styles.camera}
        type={cameraType}
        ratio="4:3"
        flashMode={flash}
        onCameraReady={() => setIsCameraReady(true)}
      />

      <View style={[styles.buttonsContainer, { top: 10 }]}>
        <MaterialIcons name="close" size={30} color={colors.white} />
        <Pressable onPress={flipFlash}>
          <MaterialIcons
            name={flashModeToIcon[flash]}
            size={30}
            color={colors.white}
          />
        </Pressable>
        <MaterialIcons name="settings" size={30} color={colors.white} />
      </View>
      <View style={[styles.buttonsContainer, { bottom: 20 }]}>
        <Pressable onPress={openGallery}>
          <MaterialIcons name="photo-library" size={30} color={colors.white} />
        </Pressable>
        {isCameraReady && (
          <Pressable
            onPress={takePicture}
            onLongPress={startRecording}
            onPressOut={stopRecording}
          >
            <View
              style={[
                styles.circle,
                { backgroundColor: isRecording ? colors.accent : colors.white },
              ]}
            />
          </Pressable>
        )}
        <Pressable onPress={flipCamera}>
          <MaterialIcons
            name="flip-camera-ios"
            size={30}
            color={colors.white}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.black,
  },
  camera: {
    width: "100%",
    aspectRatio: 3 / 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    position: "absolute",
  },
  circle: {
    width: 75,
    aspectRatio: 1,
    borderRadius: 75,
    backgroundColor: colors.white,
  },
});

export default CameraScreen;

import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import ModalSelector from "react-native-modal-selector";

const opitons = [
  { key: "camera", label: "Chụp ảnh" },
  { key: "library", label: "Chọn ảnh từ thư viện" },
];

export default function ModalUploadImage({
  children,
  onConfirm,
  imagePickerProps,
  ...others
}) {
  const pickImageFromLibrary = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          // toast.goToSetting("media");
        } else {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.1,
            ...imagePickerProps,
          });
          if (!result.cancelled) {
            onConfirm(result.uri);
          }
          if (result.cancelled) return;
        }
      }
    } catch (error) {}
  };

  return (
    <ModalSelector
      backdropPressToClose
      data={opitons}
      onChange={async (option) => {
        if (option.key === "library") {
          // ko hieu =)))
          // if (Platform.OS === "ios") {
          //   setTimeout(() => {
          //     pickImageFromLibrary();
          //   }, 1000);
          // } else {
          pickImageFromLibrary();
          // }
        } else if (option.key === "camera") {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            // toast.goToSetting("camera");
          } else {
            const result = await ImagePicker.launchCameraAsync({
              quality: 0.1,
            });
            !result.cancelled && onConfirm(result.uri);
          }
        }
      }}
      {...others}
    >
      {children}
    </ModalSelector>
  );
}

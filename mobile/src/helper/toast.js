import { Alert, Platform, Linking } from "react-native";
import Toast from "react-native-toast-message";

const permissonType = {
  media: "truy cập thư viện ảnh",
  camera: "truy camera",
  location: "truy cập vị trí",
  writeFile: "đọc file",
};

export default {
  success: (text) => {
    Toast.show({
      type: "success",
      text2: text ? text : "Thành công",
    });
  },

  error: (text) => {
    Toast.show({
      type: "error",
      text2: text ? text : "Có lỗi xảy ra",
    });
  },

  warning: (text = "") => {
    Toast.show({
      type: "info",
      text2: text ? text : "Warning",
    });
  },

  goToSetting: (type, onCancel, onConfirm) => {
    Alert.alert(
      "Thông báo",
      `Bạn cần cấp quyền ${permissonType[type]} để sử dụng chức năng này`,
      [
        {
          text: "Hủy",
          onPress: onCancel,
        },
        {
          text: "Đi đến cài đặt",
          onPress: () => {
            Platform.OS === "ios"
              ? Linking.openURL("app-settings:")
              : Linking.openSettings();
            onConfirm && onConfirm();
          },
        },
      ]
    );
  },
};

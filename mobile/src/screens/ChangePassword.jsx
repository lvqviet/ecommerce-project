import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { userApi } from "../api";
import { Button, Header, Input, Loader } from "../components";
import Color from "../constants/Color";

const ChangePassword = ({ navigation }) => {
  const [inputs, setInputs] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.currentPassword) {
      handleError("Không được để trống", "currentPassword");
      isValid = false;
    } else if (inputs.currentPassword.length < 5) {
      handleError("Mật khẩu tối thiểu có 5 ký tự", "currentPassword");
      isValid = false;
    }

    if (!inputs.newPassword) {
      handleError("Không được để trống", "newPassword");
      isValid = false;
    } else if (inputs.newPassword.length < 5) {
      handleError("Mật khẩu tối thiểu có 5 ký tự", "newPassword");
      isValid = false;
    }

    if (inputs.newPassword !== inputs.confirmPassword) {
      handleError("Mật khẩu xác nhận không chính xác", "confirmPassword");
      isValid = false;
    }

    if (isValid) {
      changePassword();
    }
  };

  const changePassword = async (avatarUrl) => {
    try {
      setLoading(true);
      const response = await userApi.changePassword(inputs);
      setLoading(false);
      if (response.ok) {
        Alert.alert("Cập nhật thành công");
      } else {
        Alert.alert("Mật khẩu không chính xác");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Loader visible={loading} />
      <Header
        showBackButton={true}
        navigation={navigation}
        title='Đổi mật khẩu'
        showCartIcon={false}
      />

      <ScrollView style={styles.container}>
        <View
          style={{
            marginVertical: 20,
            paddingHorizontal: 15,
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Input
              onChangeText={(text) => handleOnchange(text, "currentPassword")}
              onFocus={() => handleError(null, "currentPassword")}
              iconName='lock-outline'
              label='Mật khẩu hiện tại'
              error={errors.currentPassword}
              password
            />

            <Input
              onChangeText={(text) => handleOnchange(text, "newPassword")}
              onFocus={() => handleError(null, "newPassword")}
              iconName='lock-outline'
              label='Mật khẩu mới'
              error={errors.newPassword}
              password
            />

            <Input
              onChangeText={(text) => handleOnchange(text, "confirmPassword")}
              onFocus={() => handleError(null, "confirmPassword")}
              iconName='lock-outline'
              label='Xác nhận mật khẩu'
              error={errors.confirmPassword}
              password
            />
          </View>
          <Button title='Lưu' onPress={validate} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    marginTop: 45,
    flex: 1,
  },
  changePassword: {
    color: Color.black,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "right",
    fontSize: 16,
    marginBottom: 30,
  },
  containerAvatar: {
    alignSelf: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  editIcon: {
    bottom: 0,
    position: "absolute",
    right: 0,
  },
});

import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Keyboard, SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { authApi, userApi } from "../api";
import { setNewToken } from "../api/api";
import { Button, CustomText, Input, Loader } from "../components";
import Color from "../constants/Color";
import Regex from "../constants/Regex";
import { storage } from "../helper";
import { actions } from "../redux";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    if (!inputs.email) {
      handleError("Không được để trống", "email");
      isValid = false;
    } else if (!inputs.email.match(Regex.email)) {
      handleError("Email không hợp lệ", "email");
      isValid = false;
    }

    if (!inputs.password) {
      handleError("Không được để trống", "password");
      isValid = false;
    }
    if (isValid) {
      login();
    }
  };

  const login = async () => {
    try {
      const email = inputs.email.trim().toLowerCase();
      if (email === "admin@gmail.com") {
        Alert.alert("Sai email hoặc mật khẩu");
        return;
      }

      setLoading(true);
      const response = await authApi.login({
        email,
        password: inputs.password,
      });
      setLoading(false);
      if (response.ok && response.data.token) {
        const { token } = response.data;

        if (token) {
          await storage.set("token", token);
          setNewToken(token);
          const userData = await userApi.getProfile();
          await storage.set("userId", userData.data._id);
          dispatch(actions.user.login({}));
          navigation.goBack();
        }
      } else if (response.status == 401) {
        Alert.alert("Sai email hoặc mật khẩu");
      } else {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };

  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const backToHome = () => {
    navigation.navigate("HOME");
  };
  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <View style={styles.header}>
        <CustomText style={styles.loginText} text='Đăng nhập' />
        <CustomText style={styles.description} text='Nhập thông tin của bạn' />
        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "email")}
            onFocus={() => handleError(null, "email")}
            iconName='email-outline'
            label='Email'
            placeholder='Nhập email'
            error={errors.email}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "password")}
            onFocus={() => handleError(null, "password")}
            iconName='lock-outline'
            label='Password'
            placeholder='Nhập password'
            error={errors.password}
            password
          />
          <Button title='Đăng nhập' onPress={validate} />
          <CustomText
            onPress={() => navigation.navigate("REGISTER")}
            style={styles.register}
            text='Chưa có tài khoản? Đăng ký'
          />

          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AntDesign
              name='back'
              size={24}
              color={Color.purple717fe0}
              style={{ marginRight: 10 }}
            />
            <CustomText
              onPress={backToHome}
              style={styles.register}
              text='Về trang chủ'
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginText: {
    fontFamily: "Poppins_600SemiBold",
    color: Color.black,
    fontSize: 40,
  },
  description: {
    color: Color.grey999999,
    fontSize: 18,
    marginVertical: 10,
  },
  register: {
    color: Color.black,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    fontSize: 16,
  },
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backToHome: {
    marginTop: 20,
  },
});

export default LoginScreen;

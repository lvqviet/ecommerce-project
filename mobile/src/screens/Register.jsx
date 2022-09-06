import React from "react";
import {
  Alert,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { authApi } from "../api";
import { Button, CustomText, Input, Loader } from "../components";
import Color from "../constants/Color";
import Regex from "../constants/Regex";

const Register = ({ navigation }) => {
  const [inputs, setInputs] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.email) {
      handleError("Không được để trống", "email");
      isValid = false;
    } else if (!inputs.email.match(Regex.email)) {
      handleError("Email không hợp lệ", "email");
      isValid = false;
    }

    if (!inputs.firstName) {
      handleError("Không được để trống", "firstName");
      isValid = false;
    }

    if (!inputs.lastName) {
      handleError("Không được để trống", "lastName");
      isValid = false;
    }

    if (!inputs.password) {
      handleError("Không được để trống", "password");
      isValid = false;
    } else if (inputs.password.length < 5) {
      handleError("Mật khẩu tối thiểu có 5 ký tự", "password");
      isValid = false;
    }

    if (isValid) {
      register();
    }
  };

  const register = async () => {
    try {
      setLoading(true);
      const response = await authApi.register({
        email: inputs.email.trim().toLowerCase(),
        firstName: inputs.firstName.replace(/\s/g, " ").trim(),
        lastName: inputs.lastName.replace(/\s/g, " ").trim(),
        password: inputs.password,
      });
      setLoading(false);
      if (response.ok) {
        Alert.alert("Đăng ký thành công");
        navigation.goBack();
      } else {
        Alert.alert(response.data.message);
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
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <ScrollView contentContainerStyle={styles.contentCtn}>
        <CustomText style={styles.register} text='Đăng ký' />

        <CustomText
          style={styles.title}
          text='Nhập thông tin của bạn để đăng ký'
        />

        <View style={{ marginVertical: 20 }}>
          <Input
            onChangeText={(text) => handleOnchange(text, "firstName")}
            onFocus={() => handleError(null, "firstName")}
            iconName='account-outline'
            label='Họ'
            placeholder='Nhập họ'
            error={errors.firstName}
          />

          <Input
            onChangeText={(text) => handleOnchange(text, "lastName")}
            onFocus={() => handleError(null, "lastName")}
            iconName='account-outline'
            label='Tên'
            placeholder='Nhập tên'
            error={errors.lastName}
          />

          <Input
            onChangeText={(text) => handleOnchange(text, "email")}
            onFocus={() => handleError(null, "email")}
            iconName='email-outline'
            label='Email'
            placeholder='Nhập email'
            error={errors.email}
          />

          {/* <Input
            keyboardType='numeric'
            onChangeText={(text) => handleOnchange(text, "phone")}
            onFocus={() => handleError(null, "phone")}
            iconName='phone-outline'
            label='Phone Number'
            placeholder='Enter your phone number'
            error={errors.phone}
          /> */}

          <Input
            onChangeText={(text) => handleOnchange(text, "password")}
            onFocus={() => handleError(null, "password")}
            iconName='lock-outline'
            label='Password'
            placeholder='Nhập password'
            error={errors.password}
            password
          />
          <Button title='Đăng ký' onPress={validate} />
          <CustomText
            text='Đã có tài khoản? Đăng nhập'
            onPress={() => navigation.goBack()}
            style={styles.login}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.white,
    flex: 1,
  },
  contentCtn: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  register: {
    color: Color.black,
    fontSize: 40,
    fontFamily: "Poppins_600SemiBold",
  },
  title: {
    color: Color.grey999999,
    fontSize: 18,
    marginVertical: 10,
  },
  login: {
    color: Color.black,
    fontFamily: "Poppins_600SemiBold",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Register;

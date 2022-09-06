import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setNewToken } from "../api/api";
import { CustomText } from "../components";
import Color from "../constants/Color";
import { storage } from "../helper";
import { actions } from "../redux";

const menuProfileAuth = [
  { title: "Tài khoản của tôi", screen: "ACCOUNT" },
  { title: "Đơn hàng của tôi", screen: "MY_ORDER" },
  { title: "Đổi mật khẩu", screen: "CHANGE_PASSWORD" },
  { title: "Đăng xuất", screen: "" },
];

const menuProfile = [
  { title: "Đăng nhập", screen: "LOGIN" },
  { title: "Thông tin", screen: "" },
];

const Profile = ({ navigation }) => {
  const { isLogin } = useSelector((state) => state.user);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Color.white }}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/logo-01.png")}
          resizeMode='contain'
          style={{ alignSelf: "center", marginBottom: 30 }}
        />
        {isLogin
          ? menuProfileAuth.map((item, index) => {
              return (
                <View key={index}>
                  <MenuItem
                    title={item.title}
                    screen={item.screen}
                    navigation={navigation}
                  />
                  {index < menuProfileAuth.length - 1 ? (
                    <View style={styles.divide} />
                  ) : null}
                </View>
              );
            })
          : menuProfile.map((item, index) => {
              return (
                <View key={index}>
                  <MenuItem
                    title={item.title}
                    screen={item.screen}
                    navigation={navigation}
                  />
                  {index < menuProfile.length - 1 ? (
                    <View style={styles.divide} />
                  ) : null}
                </View>
              );
            })}
      </View>
    </SafeAreaView>
  );
};

const MenuItem = ({ title, screen, navigation }) => {
  const dispatch = useDispatch();

  async function onPress() {
    if (screen != "") navigation.navigate(screen);
    else {
      dispatch(actions.user.logout());
      setNewToken();
      await storage.clear();
    }
  }
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <CustomText
        text={title}
        style={[
          styles.title,
          { color: title === "Đăng xuất" ? Color.error : Color.text },
        ]}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  menuItem: {
    paddingVertical: 20,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
    alignSelf: "flex-start",
  },
  divide: {
    height: 2,
    width: "100%",
    backgroundColor: Color.greye6e6e6,
  },
});

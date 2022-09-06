import React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { cartApi, orderApi, userApi } from "../api";
import { Button, CustomText, Header, Input, Loader } from "../components";
import Color from "../constants/Color";
import Regex from "../constants/Regex";
import { format } from "../helper";
import { actions } from "../redux";
import SelectDropdown from "react-native-select-dropdown";
import { Entypo } from "@expo/vector-icons";
import moment from "moment";

const width = Dimensions.get("screen").width;

const Checkout = ({ navigation, route }) => {
  const { cartItems } = route.params;
  const { items, totalPrice, totalQuantity } = useSelector(
    (state) => state.cart
  );

  const dispatch = useDispatch();

  const [inputs, setInputs] = React.useState({
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [voucherSelected, setVoucherSelected] = useState();

  const handleOnchange = (text, input) => {
    setInputs((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (error, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: error }));
  };

  const getProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfile();
      setLoading(false);
      if (response.ok) {
        setInputs({
          phoneNumber: response.data?.phoneNumber ?? "",
          address: response.data?.address ?? "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getCart() {
    try {
      const response = await cartApi.get();
      if (response.ok && response.data) {
        dispatch(actions.cart.get_cart({ items: response.data }));
      } else {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function checkout() {
    try {
      setLoading(true);

      const response = await orderApi.checkout({
        cartItems,
        phoneNumber: inputs.phoneNumber,
        address: inputs.address,
        voucherId: voucherSelected?._id ?? "",
      });
      setLoading(false);

      if (response.ok) {
        getCart();
        Alert.alert("Đặt hàng thành công", "", [
          {
            text: "OK",
            onPress: () => navigation.replace("MY_ORDER"),
          },
        ]);
      } else {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const validate = () => {
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.phoneNumber) {
      handleError("Please input phone number", "phoneNumber");
      isValid = false;
    } else if (!inputs.phoneNumber.match(Regex.vietnamesePhoneNumber)) {
      handleError("Please input a valid phone number", "phoneNumber");
      isValid = false;
    }

    if (!inputs.address) {
      handleError("Please input address", "address");
      isValid = false;
    }

    if (isValid) {
      checkout();
    }
  };

  async function getVouchers() {
    try {
      setLoading(true);
      const res = await orderApi.getVoucher();
      setLoading(false);
      if (res.ok && res.data) {
        const activeVoucher = res.data.filter(
          (e) =>
            moment(e.expiredAt).endOf("day").isAfter(Date.now()) &&
            e.quantity > 0
        );
        setVouchers(activeVoucher);
      }
    } catch (error) {
      Alert.alert("An error occurred");
    }
  }

  useEffect(() => {
    getVouchers();
    getProfile();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Loader visible={loading} />
      <Header
        title='Đặt hàng'
        navigation={navigation}
        showBackButton={true}
        showCartIcon={false}
      />
      <ScrollView style={{ marginTop: 45 }}>
        <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
          <Input
            keyboardType='numeric'
            onChangeText={(text) => handleOnchange(text, "phoneNumber")}
            onFocus={() => handleError(null, "phoneNumber")}
            label='Số điện thoại'
            placeholder='Nhập số điện thoại'
            error={errors.phoneNumber}
            value={inputs.phoneNumber}
          />
          <Input
            onChangeText={(text) => handleOnchange(text, "address")}
            onFocus={() => handleError(null, "address")}
            label='Địa chỉ'
            placeholder='Nhập địa chỉ'
            error={errors.address}
            value={inputs.address}
          />
        </View>

        {items.map((item, index) => {
          if (cartItems.includes(index))
            return <CartItem key={index} item={item} />;
        })}
      </ScrollView>
      <View style={{ paddingHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CustomText
            text={
              vouchers.length == 0
                ? "Không có voucher khả dụng"
                : "Chọn Voucher:"
            }
            style={[styles.totalPrice]}
          />
          {vouchers.length != 0 && (
            <SelectDropdown
              dropdownStyle={{ maxHeight: 180 }}
              buttonStyle={{ borderRadius: 10, height: 40 }}
              data={vouchers}
              onSelect={(item, index) => setVoucherSelected(item)}
              buttonTextAfterSelection={(item, index) => item.name}
              rowTextForSelection={(item, index) => item.name}
              dropdownIconPosition='right'
              renderDropdownIcon={(isOpened) => {
                return (
                  <Entypo
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    size={20}
                    color='black'
                  />
                );
              }}
              disabled={vouchers.length == 0}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <CustomText text='Tạm tính:' style={[styles.totalPrice]} />
          <CustomText
            text={format.currency(totalPrice)}
            style={styles.totalPrice}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <CustomText text='Phí ship:' style={[styles.totalPrice]} />
          <CustomText text={format.currency(23000)} style={styles.totalPrice} />
        </View>
        {voucherSelected && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <CustomText text='Giảm giá:' style={[styles.totalPrice]} />
            <CustomText
              text={`- ${format.currency(voucherSelected.value)}`}
              style={styles.totalPrice}
            />
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <CustomText text={`Tổng(${totalQuantity})`} style={styles.total} />
          <CustomText
            text={format.currency(
              voucherSelected?.value == null
                ? totalPrice + 23000
                : totalPrice + 23000 - voucherSelected.value < 0
                ? 0
                : totalPrice + 23000 - voucherSelected.value
            )}
            style={styles.total}
          />
        </View>
        <View>
          <Button title='Đặt hàng' onPress={validate} color={Color.black} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const CartItem = ({ item }) => {
  return (
    <View style={styles.cartItem}>
      <Image
        source={
          item.product.pictures[0].includes("https")
            ? {
                uri: item.product.pictures[0],
              }
            : require("../../assets/product.jpg")
        }
        style={styles.image}
        resizeMode='contain'
      />
      <View
        style={{
          maxWidth: width - 130,
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <CustomText
          text={item.product.name}
          style={styles.name}
          numberOfLines={1}
        />

        <View style={styles.priceCtn}>
          <CustomText
            text={format.currency(item.product.price)}
            style={styles.price}
          />
          <CustomText text={`x ${item.quantity}`} style={styles.price} />
        </View>
      </View>
    </View>
  );
};

export default Checkout;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  cartItem: {
    flexDirection: "row",
    marginHorizontal: 15,
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Color.greye6e6e6,
  },
  name: {
    fontSize: 18,
    fontFamily: "Poppins_500Medium",
    color: Color.grey555555,
  },
  priceCtn: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  price: {
    fontSize: 18,
    color: Color.grey555555,
  },
  total: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  totalPrice: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: Color.grey555555,
  },
});

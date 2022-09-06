import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { orderApi, productApi } from "../api";
import { Button, CustomText, Header, Input, Loader } from "../components";
import Color from "../constants/Color";
import { format, storage } from "../helper";
import { AntDesign } from "@expo/vector-icons";

const MyOrder = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState("created"); // created shipping delivered cancelled
  const [orders, setOrders] = useState([]);

  async function getOrders() {
    try {
      setIsLoading(true);
      const response = await orderApi.getAll();
      setIsLoading(false);
      if (response.ok && response.data) {
        setOrders(response.data);
      } else {
        Alert.alert("An error occurred");
      }
    } catch (error) {}
  }

  async function confirmReceived(id) {
    try {
      setIsLoading(true);
      const response = await orderApi.received(id);
      setIsLoading(false);
      if (response.ok) {
        Alert.alert("Nhận hàng thành công");
        getOrders();
      } else {
        Alert.alert("An error occurred");
      }
    } catch (error) {}
  }

  async function confirmCancel(id) {
    try {
      setIsLoading(true);
      const response = await orderApi.cancel(id);
      setIsLoading(false);
      if (response.ok) {
        Alert.alert("Huỷ đơn thành công");
        getOrders();
      } else {
        Alert.alert("An error occurred");
        console.log(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function showPopupConfirm(status, id) {
    Alert.alert(
      status === "shipping" ? "Xác nhận đã nhận hàng?" : "Xác nhận huỷ đơn?",
      "",
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "OK",
          onPress:
            status == "shipping"
              ? () => confirmReceived(id)
              : () => confirmCancel(id),
        },
      ]
    );
  }

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={isLoading} />
      <Header navigation={navigation} showBackButton={true} />

      <TabBar active={active} onChange={setActive} />

      <ScrollView style={styles.scrollCtn}>
        {orders
          ? orders
              .filter((item) => item.status == active)
              .map((item, index) => {
                return (
                  <OrderItem
                    item={item}
                    onPressButton={() =>
                      showPopupConfirm(item.status, item._id)
                    }
                    getOrders={getOrders}
                    key={index}
                  />
                );
              })
          : null}
      </ScrollView>
      <View style={{ paddingHorizontal: 20 }}>
        <Button
          title={"Về trang chủ"}
          onPress={() => navigation.navigate("HOME")}
        />
      </View>
    </SafeAreaView>
  );
};

const TabBar = ({ active, onChange }) => {
  return (
    <View style={styles.tabBarCtn}>
      <Pressable
        style={[styles.tab, { borderBottomWidth: active == "created" ? 3 : 0 }]}
        onPress={() => onChange("created")}
      >
        <CustomText
          onPress={() => onChange("created")}
          text='Pending'
          style={[
            styles.tabTitle,
            {
              fontFamily:
                active == 0 ? "Poppins_600SemiBold" : "Poppins_400Regular",
              color: active == 0 ? Color.purple717fe0 : Color.text,
            },
          ]}
        />
      </Pressable>

      <Pressable
        style={[
          styles.tab,
          { borderBottomWidth: active == "shipping" ? 3 : 0 },
        ]}
        onPress={() => onChange("shipping")}
      >
        <CustomText
          onPress={() => onChange("shipping")}
          text='Shipping'
          style={[
            styles.tabTitle,
            {
              fontFamily:
                active == 1 ? "Poppins_600SemiBold" : "Poppins_400Regular",
              color: active == 1 ? Color.purple717fe0 : Color.text,
            },
          ]}
        />
      </Pressable>

      <Pressable
        style={[
          styles.tab,
          { borderBottomWidth: active == "delivered" ? 3 : 0 },
        ]}
        onPress={() => onChange("delivered")}
      >
        <CustomText
          onPress={() => onChange("delivered")}
          text='Delivered'
          style={[
            styles.tabTitle,
            {
              fontFamily:
                active == 2 ? "Poppins_600SemiBold" : "Poppins_400Regular",
              color: active == 2 ? Color.purple717fe0 : Color.text,
            },
          ]}
        />
      </Pressable>

      <Pressable
        style={[
          styles.tab,
          { borderBottomWidth: active == "cancelled" ? 3 : 0 },
        ]}
        onPress={() => onChange("cancelled")}
      >
        <CustomText
          onPress={() => onChange("cancelled")}
          text='Cancelled'
          style={[
            styles.tabTitle,
            {
              fontFamily:
                active == 2 ? "Poppins_600SemiBold" : "Poppins_400Regular",
              color: active == 2 ? Color.purple717fe0 : Color.text,
            },
          ]}
        />
      </Pressable>
    </View>
  );
};

const OrderItem = ({ item, onPressButton, getOrders }) => {
  let totalQuantity = 0;
  item.items.forEach((e) => {
    totalQuantity += e.quantity;
  });

  return (
    <View style={styles.orderItem}>
      <CustomText
        text={`Ngày đặt: ${
          moment(item?.createdAt).format("HH:mm DD/MM/yyyy") ?? ""
        }`}
        style={styles.date}
      />

      {item.items.map((e, index) => {
        return (
          <CartItem
            key={index}
            item={e}
            status={item.status}
            getOrders={getOrders}
          />
        );
      })}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <CustomText text={`Tổng(${totalQuantity}): `} style={styles.total} />
        <CustomText
          text={format.currency(
            item.totalPayment + item.deliveryFee - item.discount
          )}
          style={styles.total}
        />
      </View>
      <CustomText
        text={`Số điện thoại: ${item.phoneNumber}`}
        style={[styles.name, { paddingHorizontal: 15, marginTop: 5 }]}
      />

      <CustomText
        text={`Địa chỉ: ${item.address}`}
        style={[styles.name, { paddingHorizontal: 15, marginTop: 5 }]}
      />

      {item.status == "shipping" || item.status == "created" ? (
        <View style={{ paddingHorizontal: 100 }}>
          <Button
            title={item.status == "shipping" ? "Đã nhận" : "Huỷ"}
            onPress={onPressButton}
          />
        </View>
      ) : null}
    </View>
  );
};

const CartItem = ({ item, status, getOrders }) => {
  const [showModal, setShowModal] = useState(false);
  const [star, setStar] = useState(0);
  const [comment, setComment] = useState("");
  const [isRated, setIsRated] = useState(false);
  const [ratingId, setRatingId] = useState();

  async function sendRating() {
    try {
      const params = {
        rate: star,
        comment,
      };
      let res;
      if (isRated) {
        res = await productApi.updateRating(item.product._id, ratingId, params);
      } else {
        res = await productApi.sendRating(item.product._id, params);
      }
      if (res.ok) {
        setShowModal(false);
        Alert.alert("Đánh giá thành công");
        getOrders();
      } else {
        Alert.alert(res.data.message);
        console.log(res.data);
      }
    } catch (error) {}
  }

  async function deleteRating() {
    try {
      const res = await productApi.deleteRating(item.product._id, ratingId);

      if (res.ok) {
        setShowModal(false);
        Alert.alert("Xoá đánh giá thành công");
        setTimeout(() => {
          getOrders();
        }, 1000);
      } else {
        Alert.alert(res.data.message);
        console.log(res.data);
      }
    } catch (error) {}
  }

  useEffect(() => {
    (async () => {
      const id = await storage.get("userId");
      const findIndex = item.product.ratings.findIndex((e) => e.user === id);
      if (findIndex != -1) {
        const rating = item.product.ratings[findIndex];
        setIsRated(true);
        setRatingId(rating._id);
        setStar(rating.rate);
        setComment(rating.comment);
      }
    })();
  }, []);

  return (
    <>
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
            width: "80%",
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
            <CustomText
              text={`x ${item?.quantity ?? 2}`}
              style={styles.price}
            />
          </View>
        </View>
      </View>
      {status === "delivered" && (
        <View style={{ paddingHorizontal: 100 }}>
          <Button
            title={isRated ? "Đánh giá lại" : "Đánh giá"}
            onPress={() => setShowModal(true)}
          />
        </View>
      )}
      <Modal visible={showModal} style={styles.modal} animationType='slide'>
        <SafeAreaView>
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
                width: "80%",
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
                <CustomText
                  text={`x ${item?.quantity ?? 2}`}
                  style={styles.price}
                />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {Array.from(Array(5)).map((value, index) => {
              if (index < star) {
                return (
                  <AntDesign
                    name='star'
                    size={30}
                    key={index}
                    onPress={() => setStar(index + 1)}
                    color='#FCBD21'
                  />
                );
              } else {
                return (
                  <AntDesign
                    name='staro'
                    size={30}
                    key={index}
                    onPress={() => setStar(index + 1)}
                    color='#FCBD21'
                  />
                );
              }
            })}
          </View>

          <View style={{ paddingHorizontal: 20 }}>
            <Input
              defaultValue={comment}
              numberOfLines={5}
              onChangeText={setComment}
              label='Đánh giá của bạn:'
              placeholder='Nhập đánh giá'
              maxLine={5}
              init
            />

            <Button
              title='Gửi đánh giá'
              onPress={sendRating}
              disabled={star == 0}
            />
            {isRated && (
              <CustomText
                text={"Xoá đánh giá này"}
                style={styles.deleteRating}
                onPress={deleteRating}
              />
            )}

            <View style={{ marginTop: "70%" }}>
              <Button title='Trở lại' onPress={() => setShowModal(false)} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

export default MyOrder;

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    height: 300,
    width: 200,
    borderRadius: 10,
    backgroundColor: Color.white,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollCtn: {
    flex: 1,
  },
  tabBarCtn: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    height: 50,
    marginTop: 45,
  },
  tab: {
    flex: 1,
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Color.purple717fe0,
  },
  tabTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  image: {
    width: 80,
    height: 80,
  },
  cartItem: {
    flexDirection: "row",
    marginHorizontal: 15,
    paddingBottom: 10,
    marginBottom: 10,
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
  orderItem: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Color.purple717fe0,
    marginHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  total: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  date: {
    paddingHorizontal: 15,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 10,
  },
  deleteRating: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: Color.error,
    alignSelf: "center",
  },
});

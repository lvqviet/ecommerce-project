import { Feather, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { cartApi } from "../api";
import { Button, CustomText, Header, Loader } from "../components";
import Color from "../constants/Color";
import { format } from "../helper";
import { actions } from "../redux";

const width = Dimensions.get("screen").width;
const Cart = ({ navigation }) => {
  const { items, totalPrice, totalQuantity } = useSelector(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [productsSelected, setProductsSelected] = useState([]);

  function showConfirmDelete(item) {
    Alert.alert("Xoá sản phẩm khỏi giỏ hàng?", "", [
      {
        text: "Huỷ",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => deleteItem(item),
      },
    ]);
  }

  async function deleteItem(item) {
    dispatch(actions.cart.delete_item({ item }));
  }

  function increaseAmount(item) {
    if (item.quantity >= item.product.quantity) return;
    dispatch(actions.cart.increase_amount({ item }));
  }

  function decreaseAmount(item) {
    if (item.quantity == 1) {
      showConfirmDelete(item);
      return;
    }
    dispatch(actions.cart.decrease_amount({ item }));
  }

  function onSelected(item) {
    if (item?.isSelected == null || item?.isSelected == false) {
      dispatch(actions.cart.select({ item }));
    } else {
      dispatch(actions.cart.unselect({ item }));
    }
  }

  async function checkout() {
    navigation.navigate("CHECKOUT", { cartItems: productsSelected });
  }

  async function updateCart() {
    try {
      setIsLoading(true);
      const genItems = items.map((item) => {
        return {
          productId: item.product._id,
          quantity: item.quantity,
        };
      });
      const params = { items: genItems };
      const response = await cartApi.update(params);
      setIsLoading(false);
      if (response.ok) {
        //
      } else {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    updateCart();
    const listIndexSelected = items
      .map((e, index) => {
        if (e?.isSelected == true) return index;
        return -1;
      })
      .filter((e) => e != -1);
    setProductsSelected(listIndexSelected);
  }, [items]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Loader visible={isLoading} />
      <Header
        title='Giỏ hàng'
        navigation={navigation}
        showBackButton={true}
        showCartIcon={false}
      />
      <ScrollView style={{ marginTop: 45, paddingTop: 10 }}>
        {items.map((item, index) => (
          <CartItem
            item={item}
            key={item.product._id}
            onDelete={() => showConfirmDelete(item)}
            increaseAmount={() => increaseAmount(item)}
            decreaseAmount={() => decreaseAmount(item)}
            onSelected={() => onSelected(item)}
          />
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: 15 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <CustomText text={`Tổng(${totalQuantity})`} style={styles.total} />
          <CustomText text={format.currency(totalPrice)} style={styles.total} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ width: "80%" }}>
            <Button
              title='Đặt hàng'
              disabled={totalQuantity == 0}
              onPress={checkout}
              color={totalQuantity > 0 ? Color.black : Color.grey999999}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const CartItem = ({
  item,
  onDelete,
  increaseAmount,
  decreaseAmount,
  onSelected,
}) => {
  const [isSelected, setIsSelected] = useState(item.isSelected);

  const onSelect = () => {
    onSelected();
    setIsSelected(!isSelected);
  };
  return (
    <View style={styles.cartItem}>
      <Ionicons
        name='close'
        size={24}
        color={Color.black}
        style={styles.close}
        onPress={onDelete}
      />

      <Ionicons
        onPress={onSelect}
        name={isSelected ? "checkbox" : "square-outline"}
        size={20}
        style={{ padding: 6, alignSelf: "center" }}
      />

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
          maxWidth: width - 140,
          paddingHorizontal: 10,
          justifyContent: "space-between",
        }}
      >
        <View style={{ maxWidth: "90%" }}>
          <CustomText
            text={item.product.name}
            style={styles.name}
            numberOfLines={1}
          />
        </View>

        <View style={styles.priceCtn}>
          <CustomText
            text={format.currency(item.product.price)}
            style={styles.price}
          />

          <View style={styles.quantityCtn}>
            <View style={styles.adjust}>
              <Feather
                name='minus'
                size={18}
                color='black'
                onPress={decreaseAmount}
              />
            </View>
            <View style={styles.amountCtn}>
              <CustomText text={item.quantity} style={styles.amount} />
            </View>
            <View style={styles.adjust}>
              <Feather
                name='plus'
                size={18}
                color='black'
                onPress={increaseAmount}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Cart;

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
  quantityCtn: {
    minWidth: 90,
    height: 30,
    borderRadius: 1,
    borderWidth: 1,
    borderColor: Color.greye6e6e6,
    flexDirection: "row",
  },
  adjust: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  amountCtn: {
    alignItems: "center",
    justifyContent: "center",
    borderStartWidth: 1,
    borderEndWidth: 1,
    borderStartColor: Color.greye6e6e6,
    borderEndColor: Color.greye6e6e6,
    paddingHorizontal: 12,
  },
  amount: {
    fontSize: 12,
  },
  total: {
    fontSize: 22,
    fontFamily: "Poppins_600SemiBold",
  },
  totalPrice: {
    fontSize: 20,
    fontFamily: "Poppins_500Medium",
    color: Color.grey555555,
  },
  close: {
    position: "absolute",
    top: -10,
    right: 0,
    zIndex: 1000,
  },
});

import Entypo from "@expo/vector-icons/Entypo";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Color from "../constants/Color";
import CustomText from "./CustomText";

export default function Cart({ navigation }) {
  const { isLogin } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(0);

  function onPress() {
    if (isLogin) navigation.navigate("CART");
    else navigation.navigate("LOGIN");
  }

  function calQuantity() {
    let total = 0;
    if (items?.length != 0) {
      for (let i = 0; i < items.length; i++) {
        total += items[i].quantity;
      }
    }
    return total;
  }

  useEffect(() => {
    setQuantity(calQuantity());
  }, [items]);

  return (
    <View style={styles.icon}>
      <Entypo name='shopping-cart' size={24} color='black' onPress={onPress} />
      <View style={styles.amountCtn}>
        <CustomText text={quantity} style={styles.amount} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 15,
  },
  amountCtn: {
    backgroundColor: Color.purple717fe0,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -10,
    right: -10,
  },
  amount: {
    color: Color.white,
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
  },
});

import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Color from "../constants/Color";
import { format } from "../helper";
import CustomText from "./CustomText";

const width = Dimensions.get("window").width;

const ProductItem = ({ title, price, image, onPress = () => {} }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={
          image.includes("https")
            ? { uri: image }
            : require("../../assets/product.jpg")
        }
        resizeMode='contain'
        style={styles.image}
      />
      <View style={styles.info}>
        <CustomText text={title} style={styles.title} />
        <CustomText text={format.currency(price)} style={styles.price} />
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 15,
    elevation: 5,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    color: Color.grey999999,
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
  },
});

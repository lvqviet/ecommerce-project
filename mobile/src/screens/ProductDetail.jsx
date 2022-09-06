import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { cartApi, productApi } from "../api";
import { Button, CustomText, Header, Loader } from "../components";
import Color from "../constants/Color";
import { format } from "../helper";
import { actions } from "../redux";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

const height = Dimensions.get("window").height;

const ProductDetail = ({ navigation, route }) => {
  let IMAGES = [];
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);
  const [showImage, setShowImage] = useState(IMAGES[0]);
  const [star, setStar] = useState(0);
  const [flag, setFlag] = useState(false);

  const { id } = route.params;
  const { isLogin } = useSelector((state) => state.user);
  const { items } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  function calculateAverageStar(ratings) {
    if (ratings.length == 0) return 0;
    else if (ratings.length == 1) return ratings[0].rate;
    let total = 0;
    ratings.forEach((e) => (total += e.rate));
    return total / ratings.length;
  }

  const increase = () => {
    if (quantity < product.quantity) setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCart = () => {
    if (!isLogin) {
      navigation.navigate("LOGIN");
      return;
    }

    const findIndex = items.findIndex((e) => e.product._id == product._id);
    if (findIndex == -1 && quantity > product.quantity) {
      Alert.alert("Không thể thêm vào giỏ vượt quá số lượng trong kho");
      return;
    } else if (
      findIndex != -1 &&
      quantity + items[findIndex].quantity > product.quantity
    ) {
      Alert.alert("Không thể thêm vào giỏ vượt quá số lượng trong kho");
      return;
    }
    dispatch(actions.cart.add_to_cart({ product, quantity }));
    setFlag(true);
  };

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
        Alert.alert("Đã thêm vào giỏ hàng");
      } else {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (flag) {
      setFlag(false);
      updateCart();
    }
  }, [items]);

  useEffect(() => {
    async function getProduct() {
      try {
        setIsLoading(true);
        const response = await productApi.getById(id);
        setIsLoading(false);
        if (response.ok && response.data) {
          setProduct(response.data);
          setStar(calculateAverageStar(response.data.ratings));
          if (response.data?.pictures[0].includes("https")) {
            IMAGES.unshift(response.data.pictures[0]);
            setShowImage(IMAGES[0]);
            setImages(IMAGES);
          }
        } else {
          Alert.alert(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getProduct();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={isLoading} />
      <Header navigation={navigation} showBackButton={true} />
      <ScrollView style={styles.scrollCtn}>
        <View style={styles.preview}>
          <ScrollView
            style={styles.listImages}
            showsVerticalScrollIndicator={false}
          >
            {images.map((item, index) => (
              <Pressable onPress={() => setShowImage(item)} key={index}>
                <Image
                  source={{ uri: item }}
                  style={styles.imageItem}
                  resizeMode='contain'
                />
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.imageCtn}>
            {product ? (
              <Image
                source={{
                  uri: showImage,
                }}
                style={styles.image}
                resizeMode='contain'
              />
            ) : null}
          </View>
        </View>

        {product ? (
          <View style={styles.content}>
            <View
              style={{
                flexDirection: "row",

                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {Array.from(Array(5)).map((value, index) => {
                if (index < star) {
                  return (
                    <AntDesign
                      name='star'
                      size={30}
                      key={index}
                      color='#FCBD21'
                    />
                  );
                } else {
                  return (
                    <AntDesign
                      name='staro'
                      size={30}
                      key={index}
                      color='#FCBD21'
                    />
                  );
                }
              })}
              <CustomText
                text={`(${product.ratings.length} đánh giá)`}
                style={[styles.description, { marginBottom: 0 }]}
              />
            </View>
            <CustomText text={product.name} style={styles.name} />
            <CustomText
              text={format.currency(product.price)}
              style={styles.price}
            />
            <CustomText text={"Mô tả:"} style={styles.description} />
            <CustomText text={product.description} style={styles.description} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <CustomText
                text={`Kho: ${
                  product?.quantity == 0 ? "Hết hàng" : product?.quantity
                }`}
                style={{ marginTop: 10, fontSize: 14 }}
              />

              <View style={styles.quantityCtn}>
                <TouchableOpacity style={styles.adjust} onPress={decrease}>
                  <Feather name='minus' size={18} color='black' />
                </TouchableOpacity>
                <View style={styles.amountCtn}>
                  <CustomText text={quantity} style={styles.amount} />
                </View>
                <TouchableOpacity style={styles.adjust} onPress={increase}>
                  <Feather name='plus' size={18} color='black' />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.button}>
              <Button
                title={"Thêm vào giỏ hàng".toUpperCase()}
                onPress={addToCart}
                disabled={product?.quantity == 0}
                color={
                  product?.quantity == 0 ? Color.grey999999 : Color.purple717fe0
                }
              />
            </View>

            {product.ratings.length != 0 && (
              <View>
                <CustomText
                  text={"Đánh giá của khách hàng:"}
                  style={[styles.description, { marginBottom: 10 }]}
                />
                {product.ratings.map((e) => (
                  <RateItem key={e._id} item={e} />
                ))}
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const RateItem = ({ item }) => {
  return (
    <View style={{ marginBottom: 15 }}>
      <CustomText
        text={moment(item.createdAt).format("DD/MM/YYYY")}
        style={[styles.description, { color: Color.grey999999 }]}
      />
      <CustomText
        text={`${item.user.email}:`}
        style={[styles.description, { color: Color.grey999999 }]}
      />
      <View style={{ flexDirection: "row" }}>
        {Array.from(Array(5)).map((value, index) => {
          if (index < item.rate) {
            return (
              <AntDesign name='star' size={10} key={index} color='#FCBD21' />
            );
          } else {
            return (
              <AntDesign name='staro' size={10} key={index} color='#FCBD21' />
            );
          }
        })}
      </View>
      <CustomText text={item.comment} style={styles.description} />
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollCtn: {
    flex: 1,
    marginTop: 45,
  },
  listImages: {
    width: "20%",
    paddingVertical: 10,
    marginRight: 12,
  },
  imageItem: {
    width: "100%",
    height: 80,
    marginBottom: 15,
    alignSelf: "center",
  },
  imageCtn: {
    width: "80%",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "100%",
  },
  preview: {
    height: height * 0.4,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 12,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  name: {
    fontFamily: "Poppins_400Regular",
    fontSize: 30,
  },
  price: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 22,
    marginTop: 15,
    marginBottom: 20,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  option: {
    fontSize: 16,
    color: Color.text,
    width: 80,
  },
  quantityCtn: {
    minWidth: 120,
    height: 40,
    borderRadius: 1,
    borderWidth: 1,
    flexDirection: "row",
    borderColor: Color.greye6e6e6,
    alignSelf: "flex-start",
  },
  adjust: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  amountCtn: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    borderStartWidth: 1,
    borderEndWidth: 1,
    borderStartColor: Color.greye6e6e6,
    borderEndColor: Color.greye6e6e6,
  },
  amount: {
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 40,
    marginTop: 20,
  },
});

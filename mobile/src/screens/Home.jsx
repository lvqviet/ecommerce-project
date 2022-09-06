import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { cartApi, productApi } from "../api";
import {
  Banner,
  CustomText,
  Header,
  Input,
  Loader,
  ProductItem,
} from "../components";
import Color from "../constants/Color";
import { actions } from "../redux";
import { FontAwesome5 } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const [categorySelected, setCategorySelected] = useState("Tất cả");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterIncrease, setFilterIncrease] = useState(true);
  const [search, setSearch] = useState("");

  const { isLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onPressItem = (id) => {
    navigation.navigate("PRODUCT_DETAIL", { id });
  };

  async function getProducts() {
    try {
      setIsLoading(true);
      const response = await productApi.getProducts();
      setIsLoading(false);
      if (response.ok) {
        const productsData = response.data;
        let sortable = [...productsData];
        sortable.sort((a, b) => a.price - b.price);

        setProducts(sortable);
      } else {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      Alert.alert("An error occurred");
    }
  }

  async function getCategories() {
    try {
      setIsLoading(true);
      const res = await productApi.getCategories();
      setIsLoading(false);
      if (res.ok) {
        setCategories([{ name: "Tất cả", _id: "Tất cả" }, ...res.data]);
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  const onSearch = () => {
    navigation.navigate("SEARCH", { products, key: search });
  };

  useEffect(() => {
    getProducts();
    getCategories();

    if (isLogin) {
      getCart();
    }
  }, [isLogin]);

  useEffect(() => {
    let sortable = [...products];
    if (filterIncrease) sortable.sort((a, b) => a.price - b.price);
    else sortable.sort((a, b) => b.price - a.price);

    setProducts(sortable);
  }, [filterIncrease]);

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={isLoading} />
      <Header navigation={navigation} />
      <ScrollView style={styles.scrollCtn}>
        <View style={styles.content}>
          <Search onSearch={onSearch} setSearch={setSearch} />
          <Banner />

          <View style={styles.overviewCtn}>
            <CustomText
              text={"Danh sách sản phẩm".toUpperCase()}
              style={styles.overviewText}
            />
            {categories ? (
              <View style={styles.categories}>
                {categories.map((item, index) => (
                  <CustomText
                    text={item.name}
                    key={index}
                    onPress={() => setCategorySelected(item._id)}
                    style={[
                      styles.category,
                      {
                        textDecorationLine:
                          categorySelected == item._id ? "underline" : "none",
                        color:
                          categorySelected == item._id
                            ? Color.text
                            : Color.grey999999,
                      },
                    ]}
                  />
                ))}
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.filter}
            onPress={() => {
              setFilterIncrease(!filterIncrease);
            }}
          >
            <FontAwesome5
              name={
                filterIncrease ? "sort-amount-down-alt" : "sort-amount-down"
              }
              size={24}
              color='black'
              onPress={() => {
                setFilterIncrease(!filterIncrease);
              }}
            />
            <CustomText
              text={filterIncrease ? "Giá tăng dần" : "Giá giảm dần"}
              style={styles.textFilter}
              onPress={() => {
                setFilterIncrease(!filterIncrease);
              }}
            />
          </TouchableOpacity>

          <View style={styles.listProduct}>
            {products
              .filter((e) => {
                if (categorySelected === "Tất cả") return true;
                else {
                  return e.category._id == categorySelected;
                }
              })
              .map((item, index) => (
                <ProductItem
                  key={item._id}
                  title={item.name}
                  image={item.pictures[0]}
                  price={item.price}
                  onPress={() => onPressItem(item._id)}
                />
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Search = ({ onSearch, search, setSearch }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 20,
        height: 40,
        marginBottom: 10,
      }}
    >
      <View style={{ width: "80%" }}>
        <TextInput
          placeholder='Tìm kiếm sản phẩm'
          onChangeText={setSearch}
          style={{
            backgroundColor: Color.light,
            height: 40,
            paddingHorizontal: 10,
          }}
        />
      </View>
      <TouchableOpacity
        style={{
          width: "20%",
          backgroundColor: Color.purple717fe0,
          height: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={onSearch}
      >
        <CustomText
          text='Tìm'
          style={{ fontSize: 14, color: Color.white }}
          onPress={onSearch}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollCtn: {
    flex: 1,
    marginTop: 45,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  listProduct: {
    flexWrap: "wrap",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
  },
  overviewCtn: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  overviewText: {
    fontSize: 30,
    fontFamily: "Poppins_600SemiBold",
  },
  categories: {
    width: "100%",
    flexWrap: "wrap",
    flexDirection: "row",
    marginTop: 10,
  },
  category: {
    marginRight: 15,
    fontSize: 16,
  },
  filter: {
    padding: 12,
    borderWidth: 0.5,
    borderColor: Color.grey999999,
    borderRadius: 4,
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  textFilter: {
    fontSize: 16,
    color: Color.text,
    marginLeft: 7,
    fontFamily: "Poppins_400Regular",
  },
});

export default Home;

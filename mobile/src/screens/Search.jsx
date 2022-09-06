import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { CustomText, Header, ProductItem } from "../components";

const Search = ({ navigation, route }) => {
  const { products, key } = route.params;

  const onPressItem = (id) => {
    navigation.navigate("PRODUCT_DETAIL", { id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} showBackButton={true} />
      <ScrollView>
        <CustomText
          text={`Tìm kiếm: ${key}`}
          style={{
            fontSize: 18,
            fontWeight: "600",
            marginTop: 45,
            paddingHorizontal: 10,
          }}
        />
        <View style={styles.listProduct}>
          {products
            .filter((e) => e.name.toLowerCase().includes(key.toLowerCase()))
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listProduct: {
    flexWrap: "wrap",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

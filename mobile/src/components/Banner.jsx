import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";

const ENTRIES1 = [
  {
    url: require("./../../assets/slide-01.jpg"),
  },
  {
    url: require("./../../assets/slide-02.jpg"),
  },
  {
    url: require("./../../assets/slide-03.jpg"),
  },
  {
    url: require("./../../assets/slide-04.jpg"),
  },
  {
    url: require("./../../assets/slide-05.jpg"),
  },
  {
    url: require("./../../assets/slide-06.jpg"),
  },
  {
    url: require("./../../assets/slide-07.jpg"),
  },
];
export const SLIDER_WIDTH = Dimensions.get("window").width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH);

const Banner = (props) => {
  const [entries, setEntries] = useState([]);
  const carouselRef = useRef(null);
  const [index, setIndex] = useState(0);
  const isCarousel = useRef(null);

  const goForward = () => {
    carouselRef.current.snapToNext();
  };

  useEffect(() => {
    setEntries(ENTRIES1);
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.container} key={index}>
        {/* <Image source={item.url} style={styles.image} /> */}
        <Image
          source={{
            uri: "https://bepnamduong.vn/Data/upload/files/Page/giadung/bn-giadung.jpg",
          }}
          style={styles.image}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.body}</Text>
      </View>
    );
  };

  return (
    <View style={styles.bannerCtn}>
      <Carousel
        layout='default'
        ref={isCarousel}
        data={entries}
        renderItem={renderItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
        autoplay={true}
      />
      <Pagination
        containerStyle={{ position: "absolute", bottom: -15 }}
        dotsLength={entries.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={styles.dotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      />
    </View>
  );
};

export default Banner;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: ITEM_WIDTH,
    paddingBottom: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    borderRadius: 10,
  },
  image: {
    width: ITEM_WIDTH,
    height: 200,
    borderRadius: 10,
  },
  body: {
    color: "#222",
    fontSize: 18,
    paddingLeft: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  dotStyle: {
    width: 15,
    height: 3,
    borderRadius: 5,
    marginHorizontal: 0,
    marginVertical: 0,
    backgroundColor: "#fff",
  },
  bannerCtn: {
    height: 200,
    position: "relative",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

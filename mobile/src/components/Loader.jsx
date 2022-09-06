import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Color from "../constants/Color";
import CustomText from "./CustomText";

const Loader = ({ visible = false }) => {
  const { width, height } = useWindowDimensions();
  return (
    visible && (
      <View style={[styles.container, { height, width }]}>
        <View style={styles.loader}>
          <ActivityIndicator size='large' color={Color.purple717fe0} />
          <CustomText style={styles.loadingText} text='Loading...' />
        </View>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  loader: {
    height: 70,
    backgroundColor: Color.white,
    marginHorizontal: 50,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  container: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Loader;

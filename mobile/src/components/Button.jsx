import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Color from "../constants/Color";

const Button = ({ title, color, disabled = false, onPress = () => {} }) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        height: 55,
        width: "100%",
        backgroundColor: color ? color : Color.purple717fe0,
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 25,
      }}
    >
      <Text
        style={{
          color: Color.white,
          fontFamily: "Poppins_600SemiBold",
          fontSize: 18,
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

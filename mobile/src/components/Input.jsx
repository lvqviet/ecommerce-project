import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Color from "../constants/Color";
import CustomText from "./CustomText";

const Input = ({
  label,
  iconName,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View style={styles.container}>
      <CustomText style={styles.label} text={label} />
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? Color.error
              : isFocused
              ? Color.darkBlue
              : Color.light,
            alignItems: "center",
          },
        ]}
      >
        {iconName != null ? (
          <MaterialCommunityIcons name={iconName} style={styles.leftIcon} />
        ) : null}
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={styles.input}
          {...props}
        />
        {password && (
          <MaterialCommunityIcons
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? "eye-off-outline" : "eye-outline"}
            style={styles.rightIcon}
          />
        )}
      </View>
      {error && <CustomText style={styles.error} text={error} />}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginVertical: 5,
    fontSize: 14,
    color: Color.grey999999,
  },
  inputContainer: {
    height: 55,
    backgroundColor: Color.light,
    flexDirection: "row",
    paddingHorizontal: 15,
    borderWidth: 0.5,
  },
  leftIcon: {
    color: Color.darkBlue,
    fontSize: 22,
    marginRight: 10,
  },
  rightIcon: {
    color: Color.darkBlue,
    fontSize: 22,
  },
  error: {
    marginTop: 7,
    color: Color.error,
    fontSize: 12,
  },
  input: {
    color: Color.darkBlue,
    flex: 1,
  },
  container: {
    marginBottom: 20,
  },
});

export default Input;

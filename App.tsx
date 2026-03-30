import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";
import AppNavigator from "./src/navigation/AppNavigator";
import { Dimensions } from "react-native";



const App = () => {
  const { width, height } = Dimensions.get("window");
  const isLargeScreen = Math.min(width, height) >= 600;

  const isTablet = DeviceInfo.isTablet() && isLargeScreen;

  if (!isTablet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tablet Only Application</Text>
        <Text style={styles.message}>
          This application is supported only on tablets.
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});
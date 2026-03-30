import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Survey Application
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Household")
        }
      >
        <Text style={styles.btnText}>
          Start Survey
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
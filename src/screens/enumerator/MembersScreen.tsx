import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const MembersScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Members List
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate("Survey")
                }
            >
                <Text style={styles.btnText}>
                    Continue
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default MembersScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
    },

    button: {
        backgroundColor: "#2563EB",
        padding: 14,
        borderRadius: 10,
    },

    btnText: {
        color: "#fff",
        textAlign: "center",
    },
});
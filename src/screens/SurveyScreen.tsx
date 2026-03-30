import React from "react";
import {
    View,
    Text,
    StyleSheet,
} from "react-native";

const SummaryScreen = () => {
    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Summary Screen
            </Text>

            <Text>
                Survey Completed Successfully ✅
            </Text>

        </View>
    );
};

export default SummaryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10,
    },
});
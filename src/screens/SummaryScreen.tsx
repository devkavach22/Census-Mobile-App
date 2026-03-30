import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";

const SurveyScreen = ({ navigation }: any) => {
    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Survey Questions
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate("Summary")
                }
            >
                <Text style={styles.btnText}>
                    Finish Survey
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default SurveyScreen;

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
import React from "react";
import {
    ScrollView,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import FormInput from "../../components/FormInput";
import { isTablet } from "../../utils/responsive";

const HouseholdScreen = ({ navigation }: any) => {
    return (
        <ScrollView style={styles.container}>

            <View
                style={[
                    styles.row,
                    isTablet && styles.rowTablet,
                ]}
            >
                <FormInput
                    label="Head Name"
                    placeholder="Enter name"
                />

                <FormInput
                    label="Mobile Number"
                    placeholder="Enter mobile"
                />
            </View>

            <FormInput
                label="Address"
                placeholder="Enter address"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate("Members")
                }
            >
                <Text style={styles.btnText}>
                    Next
                </Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

export default HouseholdScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    row: {
        flexDirection: "column",
    },

    rowTablet: {
        flexDirection: "row",
        gap: 12,
    },

    button: {
        marginTop: 20,
        backgroundColor: "#2563EB",
        padding: 14,
        borderRadius: 10,
    },

    btnText: {
        color: "#fff",
        textAlign: "center",
    },
});